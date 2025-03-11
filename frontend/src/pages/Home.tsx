  import React, { useState, useCallback } from 'react';
  import { Upload, FileText, Briefcase, X } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';

  interface FileItem {
    name: string;
    type: string;
    size: number;
  }

  interface JobDescription {
    title: string;
    department: string;
    experience: string;
    skills: string[];
  }

  function Home() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upload');
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [jobDescription, setJobDescription] = useState<JobDescription>({
      title: '',
      department: '',
      experience: '',
      skills: [],
    });
    const [skillInput, setSkillInput] = useState('');

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }));
      setFiles(prev => [...prev, ...droppedFiles]);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files).map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        }));
        setFiles(prev => [...prev, ...selectedFiles]);
      }
    }, []);

    const removeFile = useCallback((fileName: string) => {
      setFiles(prev => prev.filter(file => file.name !== fileName));
    }, []);

    const addSkill = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && skillInput.trim()) {
        setJobDescription(prev => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }));
        setSkillInput('');
      }
    }, [skillInput]);

    const removeSkill = useCallback((skillToRemove: string) => {
      setJobDescription(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
    }, []);

    const handleSubmit = useCallback(() => {
      console.log('Submitting:', { files, jobDescription });
      navigate('/dashboard');
    }, [files, jobDescription, navigate]);

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-600/20 blur-[120px] pointer-events-none" />
        
        {/* Main Content */}
        <main className="relative max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 text-transparent bg-clip-text">
              AI Talent Match
            </h1>
            <p className="text-gray-400 text-lg">
              Upload CVs and job descriptions to find the perfect match
            </p>
          </div>

          {/* Main Action Area */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-800">
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'upload'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Upload CVs
              </button>
              <button
                onClick={() => setActiveTab('match')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'match'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Job Details
              </button>
            </div>

            {activeTab === 'upload' ? (
              <div className="space-y-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-blue-500/50'
                  }`}
                >
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-300 mb-2">
                    Drop CVs here or click to upload
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF, DOCX, and TXT files
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    onChange={handleFileInput}
                    accept=".pdf,.docx,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200 shadow-lg shadow-blue-600/30"
                  >
                    Select Files
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4 text-gray-300">Uploaded Files</h4>
                    <div className="space-y-2">
                      {files.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-300">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(file.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(file.name)}
                            className="text-gray-500 hover:text-red-400 transition-colors duration-200"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={jobDescription.title}
                      onChange={(e) =>
                        setJobDescription((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 placeholder-gray-500"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={jobDescription.department}
                      onChange={(e) =>
                        setJobDescription((prev) => ({ ...prev, department: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 placeholder-gray-500"
                      placeholder="e.g., Engineering"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Experience Required
                    </label>
                    <select
                      value={jobDescription.experience}
                      onChange={(e) =>
                        setJobDescription((prev) => ({ ...prev, experience: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300"
                    >
                      <option value="" className="bg-gray-900">Select experience level</option>
                      <option value="entry" className="bg-gray-900">Entry Level (0-2 years)</option>
                      <option value="mid" className="bg-gray-900">Mid Level (3-5 years)</option>
                      <option value="senior" className="bg-gray-900">Senior Level (5+ years)</option>
                      <option value="lead" className="bg-gray-900">Lead/Principal (8+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Required Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {jobDescription.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded-md text-sm flex items-center border border-blue-800"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 text-blue-400 hover:text-blue-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={addSkill}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 placeholder-gray-500"
                      placeholder="Type a skill and press Enter"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg shadow-blue-600/30"
              >
                Process Matching
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  export default Home;