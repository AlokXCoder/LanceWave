import React, { useEffect, useState } from 'react';
import { Link } from 'react-router'; // ✅ Corrected import!
import { db } from '../Firebase/Firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { formatINR } from '../utils/formatCurrency';

const FeaturedTask = () => {
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setFeaturedTasks(snap.docs.map(d => ({ _id: d.id, id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const displayedFeaturedTasks = showAll ? featuredTasks : featuredTasks.slice(0, 8);

  return (
    <div className="container mx-auto py-12 px-4 md:px-12 lg:px-20">
      <h2 className="text-3xl font-extrabold mb-10 text-center text-purple-500 dark:text-purple-400">
        🌟 Featured Tasks
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayedFeaturedTasks.map(task => (
          <div
            key={task._id} // ✅ Corrected key from task.id to task._id
            className="bg-white dark:bg-base-300 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            {task.symbolicLogo && (
              <div className="text-5xl mb-4 flex justify-center">
                {task.symbolicLogo}
              </div>
            )}

            <h3 className="text-xl font-bold text-center text-blue-700 dark:text-blue-400 mb-3">
              {task.title}
            </h3>

            {task.deadline && (
              <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-1">
                📅 <strong>Deadline:</strong> {task.deadline}
              </p>
            )}

            {task.bid ? (
              <p className="text-sm text-center text-gray-700 dark:text-gray-300">
                💰 <strong>Bid:</strong> {task.bid}
              </p>
            ) : (
              <p className="text-sm text-center text-gray-700 dark:text-gray-300">
                💸 <strong>Budget:</strong> {formatINR(task.budget)}
              </p>
            )}

            <Link to={`/featured-tasks-details/${task._id}`}>
              <button className="btn mt-5 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-105 transition-transform">
                🔍 View Details
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* ✅ Fix showAll logic to check featuredTasks */}
      {featuredTasks.length > 8 && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-outline btn-primary"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedTask;
