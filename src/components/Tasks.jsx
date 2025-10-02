import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { db } from '../Firebase/Firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import LoadingSpinner from './LoadingSpinner';
import { formatINR } from '../utils/formatCurrency';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const allTasks = snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
      // Filter out featured tasks - only show regular tasks
      setTasks(allTasks.filter(task => !task.featured));
    });
    return () => unsub();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-12 lg:px-20">
      <h2 className="text-4xl font-extrabold mb-12 text-center text-indigo-500 dark:text-purple-400">
  📋 My Tasks
</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-8 rounded-xl border border-indigo-300 dark:border-purple-700 hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 text-center"
          >
            <h3 className="text-2xl font-bold mb-6 text-blue-700 dark:text-purple-300">
              {task.title}
            </h3>

            {task.category && (
              <p className="text-md mb-2 text-indigo-600 dark:text-purple-400 font-semibold">
                Category: <span className="font-normal">{task.category}</span>
              </p>
            )}

            {task.deadline && (
              <p className="text-md mb-2 text-indigo-600 dark:text-purple-400 font-semibold">
                Deadline: <span className="font-normal">{task.deadline}</span>
              </p>
            )}

            {task.bid && (
              <p className="text-md mb-2 text-indigo-600 dark:text-purple-400 font-semibold">
                Bid: <span className="font-normal">{task.bid}</span>
              </p>
            )}

            {task.budget && (
              <p className="text-md text-indigo-600 dark:text-purple-400 font-semibold">
                Budget: <span className="font-normal">{formatINR(task.budget)}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
