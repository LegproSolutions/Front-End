import React, { useContext } from "react";
import Navbar from "../../Components/Navbar";
import UserProfileForm from "../../Components/Form/UserProfileForm";
import { AppContext } from "../../context/AppContext";

const UserProfile = () => {
  const { userData, profileCompletion } = useContext(AppContext);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden py-16 md:py-24">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Overlay Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-20"></div>

        <div className="relative container mx-auto px-4 text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm mb-4 animate-pulse">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-amber-400 text-sm font-medium">Active Profile</span>
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-snug">
            Welcome back,{" "}
            <span className="block mt-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent animate-pulse">
              {userData?.name?.split(" ")[0] || userData?.firstName || "User"}!
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Manage your professional profile, showcase your skills, and advance your career with ease.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
            {/* Profile Completion */}
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-amber-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-amber-500/50 transition-shadow duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{profileCompletion}%</h3>
                  <p className="text-gray-400 font-medium text-sm">Profile Complete</p>
                  <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${profileCompletion}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-shadow duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{userData?.experience?.length || 0}</h3>
                  <p className="text-gray-400 font-medium text-sm">Work Experience</p>
                  <p className="text-xs text-gray-500 mt-2">{userData?.experience?.length > 0 ? 'Great progress!' : 'Add your first role'}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-shadow duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{userData?.skills?.length || 0}</h3>
                  <p className="text-gray-400 font-medium text-sm">Skills Added</p>
                  <p className="text-xs text-gray-500 mt-2">{userData?.skills?.length > 0 ? 'Keep expanding!' : 'Start building your skillset'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="mt-10">
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8">
        <UserProfileForm />
      </div>
    </>
  );
};

export default UserProfile;