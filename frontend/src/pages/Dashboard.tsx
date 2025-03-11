import React, { useState } from 'react';
import { BarChart, Search, Bell, User, Star, ArrowUpRight, Settings, Briefcase } from 'lucide-react';

function Dashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const candidates = [
    { 
      name: 'John Carter',
      match: 95,
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: '5 years',
      status: 'Top Match'
    },
    { 
      name: 'Emma Smith',
      match: 88,
      skills: ['Python', 'Machine Learning', 'TensorFlow'],
      experience: '3 years',
      status: 'Strong Match'
    },
    { 
      name: 'Alex Chen',
      match: 78,
      skills: ['Java', 'Spring Boot', 'AWS'],
      experience: '4 years',
      status: 'Good Match'
    },
  ];

  const chartData = [
    { label: 'Engineering', value: 45 },
    { label: 'Design', value: 25 },
    { label: 'Product', value: 20 },
    { label: 'Marketing', value: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-600/20 blur-[120px] pointer-events-none" />
      
      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 text-transparent bg-clip-text">
            Talent Dashboard
          </h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-all">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-all">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex items-center space-x-2 bg-gray-900/60 px-4 py-2 rounded-lg">
              <User className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Admin</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 mb-1">Total Candidates</p>
                <p className="text-3xl font-bold">1,234</p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <User className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              12% from last month
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 mb-1">Average Match</p>
                <p className="text-3xl font-bold">84%</p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              8% improvement
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 mb-1">Open Positions</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <div className="p-3 bg-teal-600/20 rounded-lg">
                <Briefcase className="w-6 h-6 text-teal-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-400">
              <ArrowUpRight className="w-4 h-4 mr-1 rotate-180" />
              3% decrease
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 placeholder-gray-500"
                      placeholder="Search candidates..."
                    />
                    <Search className="w-5 h-5 text-gray-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300"
                  >
                    <option value="all">All Departments</option>
                    <option value="engineering">Engineering</option>
                    <option value="design">Design</option>
                    <option value="product">Product</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Role Distribution</h3>
              <div className="space-y-3">
                {chartData.map((item, index) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-gray-300">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Candidate List */}
          <div className="flex-1">
            <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-xl border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Top Candidates</h3>
                <span className="text-gray-400 text-sm">Showing {candidates.length} results</span>
              </div>

              <div className="space-y-4">
                {candidates.map((candidate, index) => (
                  <div 
                    key={candidate.name}
                    className="group bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-400" />
                          </div>
                          <h4 className="text-lg font-semibold">{candidate.name}</h4>
                          <span className="px-2 py-1 bg-green-900/50 text-green-400 text-sm rounded-md">
                            {candidate.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Match: <strong className="text-blue-400">{candidate.match}%</strong></span>
                          <span>Experience: {candidate.experience}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {candidate.skills.map((skill) => (
                            <span 
                              key={skill}
                              className="px-2 py-1 bg-gray-900/50 text-gray-300 text-sm rounded-md border border-gray-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-700/50 rounded-lg">
                        <ArrowUpRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;