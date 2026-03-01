"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Define types
interface Stats {
  totalQueries: number;
  savedResponses: number;
  categories: string[];
}

interface Activity {
  id: number;
  type: 'Query' | 'Save';
  content: string;
  date: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalQueries: 0,
    savedResponses: 0,
    categories: []
  });
  
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      // API calls will go here
      // For now, using dummy data for structure
      setStats({
        totalQueries: 25,
        savedResponses: 18,
        categories: ['Explanation', 'Summary', 'Code', 'Idea']
      });
      
      setRecentActivity([
        { id: 1, type: 'Query', content: 'What is JavaScript?', date: '2024-02-27' },
        { id: 2, type: 'Save', content: 'React hooks explained', date: '2024-02-26' },
        { id: 3, type: 'Query', content: 'Explain closures', date: '2024-02-25' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Query
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Total Queries</h3>
          <p className="text-3xl font-bold">{stats.totalQueries}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Saved Responses</h3>
          <p className="text-3xl font-bold">{stats.savedResponses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Categories</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {stats.categories.map((cat: string, idx: number) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity: Activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${
                  activity.type === 'Query' ? 'bg-blue-500' : 'bg-green-500'
                }`}></span>
                <div>
                  <p className="font-medium">{activity.content}</p>
                  <p className="text-sm text-gray-500">{activity.type} • {activity.date}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800">View →</button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Quick Query</h3>
          <p className="mb-4">Ask AI anything instantly</p>
          <Link 
            href="/" 
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition inline-block"
          >
            Ask Now →
          </Link>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">View History</h3>
          <p className="mb-4">Check all your previous queries</p>
          <Link 
            href="/history" 
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition inline-block"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Placeholder for future content */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <p className="text-gray-500">
          More features coming soon... (You can add charts, graphs, analytics here)
        </p>
      </div>
    </div>
  );
}