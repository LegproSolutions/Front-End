import React, { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Award, Code, FileText, Camera, Calendar, Users, Upload, File, X, Check, AlertTriangle } from 'lucide-react';
import axios from '../../utils/axiosConfig';

const ModernUserProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(45);
  const fileInputRef = useRef(null);
  const [resumeUploadStatus, setResumeUploadStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    fatherName: "",
    gender: "",
    dateOfBirth: "",
    email: "john.doe@example.com",
    phone: "",
    aadharNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    skills: ["JavaScript", "React", "Node.js"],
    resume: null, // To store resume information
  });

  const steps = [
    { icon: User, label: "Personal Info", color: "from-blue-500 to-cyan-500" },
    { icon: MapPin, label: "Address", color: "from-purple-500 to-pink-500" },
    { icon: Award, label: "Education", color: "from-orange-500 to-red-500" },
    { icon: Briefcase, label: "Experience", color: "from-green-500 to-teal-500" },
    { icon: Code, label: "Skills", color: "from-indigo-500 to-purple-500" },
    { icon: FileText, label: "Resume", color: "from-teal-500 to-emerald-500" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };
  
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    // Check if file is selected
    if (!file) return;
    
    // Validate file is PDF
    if (file.type !== 'application/pdf') {
      setResumeUploadStatus({
        loading: false,
        error: 'Only PDF files are allowed',
        success: false
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setResumeUploadStatus({
        loading: false,
        error: 'File size should be less than 5MB',
        success: false
      });
      return;
    }

    setResumeUploadStatus({
      loading: true,
      error: null,
      success: false
    });

    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append('resume', file);
      
      const response = await axios.post('/api/profile/upload-resume', formDataForUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setFormData(prev => ({ 
          ...prev, 
          resume: {
            url: response.data.url,
            publicId: response.data.publicId,
            originalName: file.name
          }
        }));
        
        setResumeUploadStatus({
          loading: false,
          error: null,
          success: true
        });
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setResumeUploadStatus({
        loading: false,
        error: error.response?.data?.message || 'Error uploading resume',
        success: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Card with Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 mb-8 border border-white/40">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                  <Camera className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-legpro-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Build Your Profile
                </h1>
                <p className="text-gray-600 mt-2">Complete your journey to success</p>
              </div>
            </div>
            
            {/* Animated Progress Circle */}
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                <circle 
                  cx="64" cy="64" r="56" fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - profileCompletion / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-legpro-primary to-purple-600 bg-clip-text text-transparent">
                  {profileCompletion}%
                </span>
                <span className="text-xs text-gray-500">Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-6 mb-8 border border-white/40">
          <div className="flex justify-between items-center pb-2 overflow-hidden">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              
              return (
                <div key={index} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`flex flex-col items-center gap-2 transition-all duration-300 group ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${step.color} shadow-2xl` 
                        : isCompleted
                        ? 'bg-green-500 shadow-lg'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}>
                      {isCompleted ? (
                        <div className="text-white text-2xl">✓</div>
                      ) : (
                        <Icon className={`w-7 h-7 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-white/30 animate-ping"></div>
                      )}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-12 mx-2 rounded-full transition-all duration-500 ${
                      currentStep > index ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content Card */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/40">
          {/* Personal Info Step */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white/50"
                      placeholder="Enter first name"
                    />
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white/50"
                      placeholder="Enter last name"
                    />
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white/50"
                      placeholder="Enter father's name"
                    />
                    <Users className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white/50"
                    />
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white/50"
                      placeholder="your.email@example.com"
                    />
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white/50"
                      placeholder="10-digit number"
                    />
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <div className="flex gap-4">
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <label key={gender} className="flex items-center gap-2 cursor-pointer group/radio">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleChange}
                          className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 group-hover/radio:text-legpro-primary transition-colors">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address Step */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                Address Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white/50"
                    placeholder="House no., Street name"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white/50"
                    placeholder="City name"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white/50"
                    placeholder="State name"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white/50"
                    placeholder="Country name"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white/50"
                    placeholder="6-digit PIN"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skills Step */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                Your Skills
              </h2>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="group relative">
                    <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                      {skill}
                    </div>
                  </div>
                ))}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Add Skills (comma-separated)</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white/50 min-h-[120px]"
                  placeholder="JavaScript, React, Node.js, Python..."
                />
              </div>
            </div>
          )}
          
          {/* Resume Upload Step */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                Resume Upload
              </h2>
              
              <div className="bg-white/70 rounded-xl border-2 border-dashed border-teal-400 p-8 text-center">
                {formData.resume ? (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <File className="w-10 h-10 text-teal-600" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800">
                      {formData.resume.originalName}
                    </h3>
                    
                    <div className="flex mt-4 gap-3">
                      <a 
                        href={formData.resume.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg flex items-center gap-2 hover:bg-teal-200 transition-colors"
                      >
                        <FileText className="w-4 h-4" /> View Resume
                      </a>
                      
                      <button 
                        onClick={handleFileClick}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                      >
                        <Upload className="w-4 h-4" /> Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={handleFileClick}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                      <Upload className="w-10 h-10 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Your Resume</h3>
                    <p className="text-gray-500 mb-4">PDF format only, max 5MB</p>
                    
                    <button
                      className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium"
                    >
                      Choose File
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                />
                
                {/* Upload Status Messages */}
                {resumeUploadStatus.loading && (
                  <div className="mt-4 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-legpro-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading resume...</span>
                  </div>
                )}
                
                {resumeUploadStatus.error && (
                  <div className="mt-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{resumeUploadStatus.error}</span>
                  </div>
                )}
                
                {resumeUploadStatus.success && (
                  <div className="mt-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Resume uploaded successfully!</span>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-8">
                  Your resume will be shared with employers when you apply for jobs.
                  Only PDF files are allowed to ensure compatibility with all systems.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-legpro-primary to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Next Step
              </button>
            ) : (
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                Submit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ModernUserProfileForm;