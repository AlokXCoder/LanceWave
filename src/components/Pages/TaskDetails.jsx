import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router'; 
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../../assets/loading.json';
import { Fade } from 'react-awesome-reveal';
import { FireBaseAuthContext } from '../../Provider/FireBaseAuthContext';
import { db } from '../../Firebase/Firebase';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { formatINR } from '../../utils/formatCurrency';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);
  const { user } = useContext(FireBaseAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Task Details || Lance Wave';
  }, []);

  useEffect(() => {
    const unsubTask = onSnapshot(doc(db, 'tasks', id), (snap) => {
      if (!snap.exists()) {
        setTask(null);
        setLoading(false);
        return;
      }
      setTask({ _id: snap.id, id: snap.id, ...snap.data() });
      setLoading(false);
    }, () => setLoading(false));

    const unsubBids = onSnapshot(collection(db, 'tasks', id, 'bids'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
      setBids(list);
    });

    return () => {
      unsubTask();
      unsubBids();
    };
  }, [id]);

  const handleBid = () => {
    if (!user) {
      navigate('/login', { state: { from: `/task-details/${id}` } });
    } else {
      navigate(`/tasks/${id}/bid`);
    }
  };

  const handleUpdateBidStatus = async (bidId, status) => {
    try {
      await updateDoc(doc(db, 'tasks', id, 'bids', bidId), { status });
      toast.success(`Bid ${status}`);
    } catch (e) {
      toast.error('Failed to update bid');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Player autoplay loop src={loadingAnimation} style={{ height: '200px', width: '200px' }} />
      </div>
    );
  }

  if (!task) {
    return (
      <p className="text-center mt-10 text-red-500 text-lg dark:text-red-400">❌ Task not found.</p>
    );
  }

  const isOwner = user?.email === task.email;

  return (
    <Fade>
      <div className="max-w-4xl mt-20 mb-12 mx-auto p-8 shadow-xl bg-white dark:bg-base-300 rounded-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          {task.title}
        </h2>

        <div className="space-y-3 text-base">
          <p><strong>📂 Category:</strong> {task.category}</p>
          <p><strong>📝 Description:</strong> {task.description}</p>
          <p><strong>⏰ Deadline:</strong> {task.deadline}</p>
          <p><strong>💵 Budget:</strong> {formatINR(task.budget)}</p>
          <p><strong>👤 Posted by:</strong> {task.name} ({task.email})</p>
          <p className="text-green-600 dark:text-green-400 font-medium">
            ✅ {bids.length} Bids Submitted
          </p>
        </div>

        {!isOwner && (
          <button
            onClick={handleBid}
            className="mt-6 w-full py-2 px-4 font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition"
          >
            💼 Bid Now
          </button>
        )}

        {bids.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Bids</h3>
            <div className="space-y-3">
              {bids.map((b) => (
                <div key={b.id} className="p-4 rounded-lg border dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p><strong>Bidder:</strong> {b.bidderName || 'Anonymous'} ({b.bidderEmail})</p>
                    <p><strong>Amount:</strong> {formatINR(b.amount)}</p>
                    {b.message && <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Message:</strong> {b.message}</p>}
                    <p className="text-sm"><strong>Status:</strong> {b.status || 'pending'}</p>
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                        onClick={() => handleUpdateBidStatus(b.id, 'accepted')}
                        disabled={b.status === 'accepted'}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleUpdateBidStatus(b.id, 'declined')}
                        disabled={b.status === 'declined'}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Link to="/browse-tasks">
          <button className="btn btn-outline btn-primary mt-6 w-full">
            🔍 Browse More Tasks
          </button>
        </Link>
      </div>
    </Fade >
  );
};

export default TaskDetails;
