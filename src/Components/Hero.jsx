import React, { useEffect, useState } from "react";

const Hero = () => {
  const [stats, setStats] = useState({ companies: 0, jobs: 0, applications: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("https://bitojobs-backend-mn78.onrender.com/new-stats");
        const data = await response.json();
        setStats({
          companies: data?.registeredCompanies || 0,
          jobs: data?.verifiedJobs || 0,
          applications: data?.applications || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative w-full px-4 py-10 md:py-16 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-r from-blue-200 to-purple-200 blur-[120px] opacity-40" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        {/* Search Bar on Top */}
        <div className="w-full max-w-xl mx-auto mb-6">
          <input
            type="text"
            placeholder="Search for jobs, companies..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          Find Opportunities That Match Your Skills
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-gray-600 text-base md:text-lg">
          Search, explore, and apply for jobs across verified companies.
        </p>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.companies}</p>
            <p className="text-gray-700 text-sm md:text-base">Registered Companies</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.jobs}</p>
            <p className="text-gray-700 text-sm md:text-base">Verified Jobs</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.applications}</p>
            <p className="text-gray-700 text-sm md:text-base">Applications Submitted</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
