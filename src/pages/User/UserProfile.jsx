import React, { useContext } from "react";
import Navbar from "../../Components/Navbar";
import UserProfileForm from "../../Components/Form/UserProfileForm";
import { AppContext } from "../../context/AppContext";

const UserProfile = () => {
  const { userData, profileCompletion } = useContext(AppContext);

  return (
    <>
      <Navbar />

      {/* Professional Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-full translate-y-20 -translate-x-20"></div>

        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center mb-4">
            {/* Welcome Message */}
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              Welcome back,
              <span className="text-amber-600">
                {userData?.name
                  ? ` ${userData.name.split(" ")[0]}!`
                  : userData?.firstName
                  ? ` ${userData.firstName}!`
                  : " User!"}
              </span>
            </h1>

            <p className="text-sm text-text-secondary max-w-xl mx-auto leading-snug">
              Manage your professional profile, showcase your skills, and take
              control of your career journey.
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {profileCompletion}%
                  </h3>
                  <p className="text-text-secondary font-medium">
                    Profile Complete
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {userData?.experience?.length || 0}
                  </h3>
                  <p className="text-text-secondary font-medium">
                    Work Experience
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {userData?.skills?.length || 0}
                  </h3>
                  <p className="text-text-secondary font-medium">
                    Skills Added
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-gray-50 min-h-screen">
        <UserProfileForm />
      </div>
    </>
  );
};

export default UserProfile;
