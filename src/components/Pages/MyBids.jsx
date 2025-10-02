import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FireBaseAuthContext } from '../../Provider/FireBaseAuthContext';
import { db } from '../../Firebase/Firebase';
import { collectionGroup, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { formatINR } from '../../utils/formatCurrency';

const MyBids = () => {
  const { user } = useContext(FireBaseAuthContext);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collectionGroup(db, 'bids'), where('bidderUid', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => {
        const taskRef = d.ref.parent.parent; // tasks/{taskId}
        return {
          id: d.id,
          taskId: taskRef ? taskRef.id : null,
          ...d.data(),
        };
      });
      setBids(items);
    });
    return () => unsub();
  }, [user?.uid]);

  const cancelBid = async (taskId, bidId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId, 'bids', bidId));
      toast.success('Bid cancelled');
    } catch (e) {
      toast.error('Failed to cancel bid');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 px-4">
      <title>My Bids || Lance Wave</title>
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 dark:text-blue-400">My Bids</h2>

      {bids.length === 0 ? (
        <p className="text-center text-gray-600">You have not placed any bids yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm md:text-base">
            <thead>
              <tr className="bg-base-300 text-left">
                <th className="p-3 border dark:border-gray-700">Task</th>
                <th className="p-3 border dark:border-gray-700">Amount</th>
                <th className="p-3 border dark:border-gray-700">Status</th>
                <th className="p-3 border dark:border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bids.map(b => (
                <tr key={b.id} className="hover:bg-base-200">
                  <td className="p-3 border dark:border-gray-700">
                    {b.taskId ? (
                      <Link className="text-blue-600" to={`/task-details/${b.taskId}`}>View Task</Link>
                    ) : '—'}
                  </td>
                  <td className="p-3 border dark:border-gray-700">{formatINR(b.amount)}</td>
                  <td className="p-3 border dark:border-gray-700">{b.status || 'pending'}</td>
                  <td className="p-3 border dark:border-gray-700">
                    <button
                      className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                      onClick={() => cancelBid(b.taskId, b.id)}
                    >
                      Cancel Bid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBids; 