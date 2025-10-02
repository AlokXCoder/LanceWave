import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FireBaseAuthContext } from '../../Provider/FireBaseAuthContext';
import { db } from '../../Firebase/Firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const PlaceBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(FireBaseAuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place a bid');
      return navigate('/login', { state: { from: `/task-details/${id}/bid` } });
    }
    if (!amount || Number(amount) <= 0) return toast.error('Enter a valid amount');

    setSubmitting(true);
    try {
      const taskSnap = await getDoc(doc(db, 'tasks', id));
      if (!taskSnap.exists()) throw new Error('Task not found');
      const taskData = taskSnap.data();

      await addDoc(collection(db, 'tasks', id, 'bids'), {
        taskId: id,
        taskOwnerUid: taskData.ownerUid || null,
        bidderUid: user.uid,
        bidderEmail: user.email,
        bidderName: user.displayName || '',
        amount: Number(amount),
        message: message || '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast.success('Bid placed successfully');
      navigate(`/task-details/${id}`);
    } catch (e) {
      toast.error('Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 rounded-xl shadow bg-white dark:bg-base-300">
      <title>Place Bid || Lance Wave</title>
      <h2 className="text-2xl font-bold mb-6 text-center">Place Your Bid</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Amount (₹)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea textarea-bordered w-full min-h-[100px]"
            placeholder="Describe your approach or timeline"
          />
        </div>
        <button
          type="submit"
          className="btn w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          disabled={submitting}
        >
          {submitting ? 'Submitting…' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
};

export default PlaceBid; 