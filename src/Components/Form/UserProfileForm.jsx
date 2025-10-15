import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Award, Code, Camera, Calendar, Users, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

const UserProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(45);
  
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
    education: {
      additionalLevels: [],
      tenthGrade: {
        instituteName: "",
        certificationBody: "",
        passingYear: "",
        percentage: "",
        courseType: ""
      }
    },
    experience: {
      companyName: "",
      designation: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      jobDescription: ""
    },
    skills: ["JavaScript", "React", "Node.js"],
  });

  const steps = [
    { icon: User, label: "Personal", color: "from-blue-600 to-indigo-600" },
    { icon: MapPin, label: "Address", color: "from-violet-600 to-purple-600" },
    { icon: Award, label: "Education", color: "from-amber-600 to-orange-600" },
    { icon: Briefcase, label: "Experience", color: "from-emerald-600 to-teal-600" },
    { icon: Code, label: "Skills", color: "from-pink-600 to-rose-600" },
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

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        tenthGrade: { ...prev.education.tenthGrade, [name]: value }
      }
    }));
  };

  const toggleEducationLevel = (level) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        additionalLevels: prev.education.additionalLevels.includes(level)
          ? prev.education.additionalLevels.filter(l => l !== level)
          : [...prev.education.additionalLevels, level]
      }
    }));
  };

  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const currentColor = steps[currentStep].color;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #e5e7eb 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="relative">
                <div className={`w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br ${currentColor} rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl`}>
                  <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Profile Setup
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">Let's complete your profile together</p>
              </div>
            </div>
            
            {/* Progress Circle */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#f3f4f6" strokeWidth="8"/>
                  <circle 
                    cx="56" cy="56" r="48" fill="none" 
                    stroke="url(#circle-gradient)" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - profileCompletion / 100)}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {profileCompletion}%
                  </span>
                  <span className="text-xs text-gray-500">Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex justify-between items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              
              return (
                <React.Fragment key={index}>
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`flex flex-col items-center gap-1.5 sm:gap-2 transition-all duration-300 flex-shrink-0 ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                  >
                    <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${step.color} shadow-xl shadow-${step.color}/30` 
                        : isCompleted
                        ? 'bg-green-500 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-200'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-4 border-white/50"></div>
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-6 sm:w-12 rounded-full transition-all duration-500 flex-shrink-0 ${
                      currentStep > index ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
          {/* Personal Info Step */}
          {currentStep === 0 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-gray-100">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${currentColor} flex items-center justify-center shadow-lg`}>
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Information</h2>
                  <p className="text-sm text-gray-500">Tell us about yourself</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter first name"
                    />
                    <User className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter last name"
                    />
                    <User className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter father's name"
                    />
                    <Users className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-gray-900"
                    />
                    <Calendar className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="your.email@example.com"
                    />
                    <Mail className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="10-digit number"
                    />
                    <Phone className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3">Gender</label>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <label key={gender} className="flex items-center gap-2 cursor-pointer px-5 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address Step */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-gray-100">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${currentColor} flex items-center justify-center shadow-lg`}>
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Address Details</h2>
                  <p className="text-sm text-gray-500">Where can we reach you?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                <div className="sm:col-span-2 group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                    placeholder="House no., Building, Street name"
                  />
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                    placeholder="City name"
                  />
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                    placeholder="State name"
                  />
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Country name"
                  />
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                    placeholder="6-digit PIN"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Education Step */}
          {currentStep === 2 && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-gray-100">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${currentColor} flex items-center justify-center shadow-lg`}>
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Education Details</h2>
                  <p className="text-sm text-gray-500">Your academic background</p>
                </div>
              </div>

              {/* Additional Education Levels */}
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border-2 border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-gray-700" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Select Additional Education Levels</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['12th', 'ITI', 'Diploma', 'UG', 'PG'].map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all group bg-white">
                      <input
                        type="checkbox"
                        checked={formData.education.additionalLevels.includes(level)}
                        onChange={() => toggleEducationLevel(level)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-amber-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 10th Grade Details */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-gray-100">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">10th Grade Details</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-5">
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Institute Name</label>
                    <input
                      type="text"
                      name="instituteName"
                      value={formData.education.tenthGrade.instituteName}
                      onChange={handleEducationChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter institute name"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Certification Body</label>
                    <input
                      type="text"
                      name="certificationBody"
                      value={formData.education.tenthGrade.certificationBody}
                      onChange={handleEducationChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter certification body"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Passing Year</label>
                      <input
                        type="text"
                        name="passingYear"
                        value={formData.education.tenthGrade.passingYear}
                        onChange={handleEducationChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                        placeholder="YYYY"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Percentage/CGPA</label>
                      <input
                        type="text"
                        name="percentage"
                        value={formData.education.tenthGrade.percentage}
                        onChange={handleEducationChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                        placeholder="Enter percentage"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Course Type</label>
                    <input
                      type="text"
                      name="courseType"
                      value={formData.education.tenthGrade.courseType}
                      onChange={handleEducationChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter course type"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Experience Step */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-gray-100">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${currentColor} flex items-center justify-center shadow-lg`}>
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Work Experience</h2>
                  <p className="text-sm text-gray-500">Your professional journey</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.experience.companyName}
                      onChange={handleExperienceChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter company name"
                    />
                    <Briefcase className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Designation</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="designation"
                      value={formData.experience.designation}
                      onChange={handleExperienceChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400"
                      placeholder="e.g., Software Engineer"
                    />
                    <Award className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="startDate"
                        value={formData.experience.startDate}
                        onChange={handleExperienceChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none bg-white text-gray-900"
                      />
                      <Calendar className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="endDate"
                        value={formData.experience.endDate}
                        onChange={handleExperienceChange}
                        disabled={formData.experience.currentlyWorking}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-11 sm:pl-12 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <Calendar className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer px-5 py-3 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group w-fit">
                    <input
                      type="checkbox"
                      name="currentlyWorking"
                      checked={formData.experience.currentlyWorking}
                      onChange={handleExperienceChange}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">Currently working here</span>
                  </label>
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Job Description</label>
                  <textarea
                    name="jobDescription"
                    value={formData.experience.jobDescription}
                    onChange={handleExperienceChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400 min-h-[120px] sm:min-h-[140px] resize-none"
                    placeholder="Describe your role, responsibilities, and achievements..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skills Step */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-gray-100">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${currentColor} flex items-center justify-center shadow-lg`}>
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Skills</h2>
                  <p className="text-sm text-gray-500">What are you good at?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border-2 border-gray-100">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Add More Skills</label>
                <textarea
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all outline-none bg-white text-gray-900 placeholder-gray-400 min-h-[100px] sm:min-h-[120px] resize-none"
                  placeholder="JavaScript, React, Node.js, Python, etc..."
                />
                <p className="text-xs text-gray-500 mt-2">Separate skills with commas</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md transform hover:-translate-y-0.5'
              }`}
            >
              ← Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r ${currentColor} text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2`}
              >
                Continue
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default UserProfileForm;