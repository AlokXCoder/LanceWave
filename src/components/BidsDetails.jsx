import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { FireBaseAuthContext } from '../Provider/FireBaseAuthContext';
import { db } from '../Firebase/Firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { formatINR } from '../utils/formatCurrency';

const BidsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(FireBaseAuthContext);
  const [bid, setBid] = useState(null);
  const [bidsCount, setBidsCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, 'tasks', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) return setBid(null);
        const data = { _id: snap.id, id: snap.id, ...snap.data() };
        setBid(data);
        const bidsSnap = await getDocs(collection(db, 'tasks', id, 'bids'));
        setBidsCount(bidsSnap.size || 0);
      } catch (e) {
        setBid(null);
      }
    };
    load();
  }, [id]);

  const handleBid = () => {
    if (!user) {
      navigate('/login', { state: { from: `/task-details/${id}` } });
    } else {
      navigate(`/tasks/${id}/bid`);
    }
  };

  if (!bid) return null;
  const isOwner = user?.email === bid.email;

  return (
    <div className="max-w-4xl mx-auto text-center mt-25 px-4 sm:px-6 ">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-xl shadow-md border dark:border-gray-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 text-center">
          {bid.title}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base mb-4">
          <p><strong>📂 Category:</strong> {bid.category}</p>
          <p><strong>📅 Deadline:</strong> {bid.deadline}</p>
          <p><strong>📊 Status:</strong> {bid.status}</p>
          <p><strong>💰 Budget:</strong> {formatINR(bid.budget)}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium mb-1">📝 Description:</p>
          <p className="whitespace-pre-line">{bid.description}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium mb-1">👤 Posted By:</p>
          <p className="whitespace-pre-line">
            <strong>Name:</strong> {bid.name} <br />
            <strong>Email:</strong> {bid.email}
          </p>
        </div>

        <p className="text-green-600 font-medium mb-4">
          You bid for {bidsCount} {bidsCount === 1 ? 'opportunity' : 'opportunities'}.
        </p>

        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          <p>📌 Created At: {bid.createdAt || 'N/A'}</p>
          <p>🛠 Last Updated: {bid.updatedAt || 'N/A'}</p>
        </div>

        {!isOwner && (
          <button
            onClick={handleBid}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold transition"
          >
            💼 Bid Now
          </button>
        )}

        <Link to={`/task-details/${id}`}>
          <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition">
            🔍 View Task Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BidsDetails;
