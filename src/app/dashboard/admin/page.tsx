"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Users, Activity, CreditCard, Stethoscope, CheckCircle, XCircle, Shield, Clock, X, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'settings'>('overview');
  const [settings, setSettings] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, logsRes, settingsRes] = await Promise.all([
        api.get("/analytics/admin"),
        api.get("/admin/users"),
        api.get("/admin/audit-logs"),
        api.get("/admin/settings")
      ]);
      
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (logsRes.data.success) setAuditLogs(logsRes.data.logs);
      if (settingsRes.data.success) setSettings(settingsRes.data.settings);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    try {
      const res = await api.put(`/admin/users/${userId}`, { status });
      if (res.data.success) {
        fetchAllData();
      }
    } catch (error) {
      alert("Error updating user status");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.put("/admin/settings", settings);
      if (res.data.success) {
        alert("Settings updated successfully");
      }
    } catch (error) {
      alert("Error saving settings");
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  // Formatting for the chart
  const chartData = [
    { name: 'Patients', count: stats?.totalPatients || 0 },
    { name: 'Doctors', count: stats?.totalDoctors || 0 },
    { name: 'Pro Users', count: stats?.proUsers || 0 },
  ];

  const recentAppointments: any[] = stats?.recentAppointments || [];

  // Formatting for charts
  const platformOverviewData = [
    { name: 'Patients', count: stats?.totalPatients || 0 },
    { name: 'Doctors', count: stats?.totalDoctors || 0 },
    { name: 'Pro Users', count: stats?.proUsers || 0 },
  ];

  const registrationTrends = stats?.registrationTrends?.map((item: any) => ({
    name: item._id,
    patients: item.count
  })).reverse() || [];

  const topDoctors = stats?.topDoctors?.map((item: any) => ({
    name: item.name,
    appointments: item.count
  })) || [];

  const peakHours = stats?.peakHours?.map((item: any) => ({
    name: item._id,
    count: item.count
  })) || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="bg-white p-1 rounded-lg shadow-sm border flex space-x-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            User Management
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'logs' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Audit Logs
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Patients</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{stats?.totalPatients || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Stethoscope className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Doctors</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{stats?.totalDoctors || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <Activity className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Monthly Appointments</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{stats?.monthlyAppointments || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Simulated Revenue</dt>
                      <dd className="text-2xl font-semibold text-gray-900">${stats?.simulatedRevenue || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration Trends Line Chart */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Registration Trends</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={registrationTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" fontSize={12} tickMargin={10} />
                    <YAxis fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Doctors Bar Chart */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Top Performing Doctors</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDoctors} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" fontSize={12} width={100} />
                    <Tooltip cursor={{fill: '#f9fafb'}} />
                    <Bar dataKey="appointments" fill="#10b981" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Peak Hours Pie Chart */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Peak Appointment Hours</h2>
              <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={peakHours}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }: any) => `${name || 'Other'} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {peakHours.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Overview Bar Chart (Original) */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformOverviewData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">User Management</h2>
            <div className="text-sm text-gray-500">{users.length} total users</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 
                        user.status === 'blocked' ? 'bg-red-100 text-red-800 border-red-200' : 
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {user.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.status === 'blocked' ? (
                        <button 
                          onClick={() => handleUpdateUserStatus(user._id, 'active')}
                          className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md border border-green-100"
                        >
                          Approve
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUpdateUserStatus(user._id, 'blocked')}
                          className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md border border-red-100"
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-400" />
              Audit Logs & Activity
            </h2>
          </div>
          <div className="p-0">
            {auditLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map((log: any) => (
                      <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1.5 text-gray-400" />
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{log.userId?.name || 'System'}</div>
                          <div className="text-xs text-gray-500">{log.userId?.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          {log.module}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                          {JSON.stringify(log.details)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500 bg-white">
                No activity logs found.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white shadow rounded-lg border border-gray-100 max-w-4xl">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">System Configuration</h2>
          </div>
          <form onSubmit={handleSaveSettings} className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Consultation Fees */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Consultation Fees</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">General Consultation ($)</label>
                    <input 
                      type="number" 
                      value={settings?.consultationFees?.general || 0} 
                      onChange={e => setSettings({...settings, consultationFees: {...settings.consultationFees, general: Number(e.target.value)}})}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Specialist Consultation ($)</label>
                    <input 
                      type="number" 
                      value={settings?.consultationFees?.specialist || 0} 
                      onChange={e => setSettings({...settings, consultationFees: {...settings.consultationFees, specialist: Number(e.target.value)}})}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Appointment Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Slot Duration (minutes)</label>
                    <input 
                      type="number" 
                      value={settings?.appointmentSlots?.duration || 30} 
                      onChange={e => setSettings({...settings, appointmentSlots: {...settings.appointmentSlots, duration: Number(e.target.value)}})}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Hour</label>
                      <input 
                        type="time" 
                        value={settings?.appointmentSlots?.startTime || "09:00"} 
                        onChange={e => setSettings({...settings, appointmentSlots: {...settings.appointmentSlots, startTime: e.target.value}})}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Hour</label>
                      <input 
                        type="time" 
                        value={settings?.appointmentSlots?.endTime || "18:00"} 
                        onChange={e => setSettings({...settings, appointmentSlots: {...settings.appointmentSlots, endTime: e.target.value}})}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Departments</h3>
                <div className="flex flex-wrap gap-2">
                  {settings?.departments?.map((dept: any, idx: number) => (
                    <div key={idx} className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-gray-200">
                      <span className="text-sm font-medium mr-2">{dept.name}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newDepts = settings.departments.filter((_: any, i: number) => i !== idx);
                          setSettings({...settings, departments: newDepts});
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => {
                      const name = prompt("Enter department name:");
                      if (name) setSettings({...settings, departments: [...(settings.departments || []), { name, isActive: true }]});
                    }}
                    className="flex items-center bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Dept
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <button 
                type="submit" 
                disabled={savingSettings}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 shadow-lg transition-all font-bold disabled:bg-blue-300"
              >
                {savingSettings ? 'Saving...' : 'Save All Configurations'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
