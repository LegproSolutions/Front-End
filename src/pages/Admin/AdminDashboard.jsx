import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import RecruiterVerifacationPage from "./RecruiterVerifacationPage";
import JobPostCard from "./JobPostCard"; // Assuming this is the table component for jobs
import UserVerificationPage from "./UserVerificationPage";
import Navbar from "./AdminNavbar";
import Sidebar from "./Siderbar";
import { ChevronLeft, ChevronRight } from "lucide-react";


const backendUrl = import.meta.env?.VITE_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeTab, setActiveTab] = useState("recruiters");
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]); // All users data
  const [allRecruiters, setAllRecruiters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // For 'all_recruiter' tab
  const [searchQuery, setSearchQuery] = useState(""); // For 'all_recruiter' tab
  // Credit system removed



  const itemsPerPage = 10;

  const tabs = [
    { name: "Verify Recruiter", value: "recruiters" },
    { name: "Verify Job Posts", value: "jobs" },
    { name: "All Users", value: "all_user" },
    { name: "All Recruiter", value: "all_recruiter" },
    // Credit system removed
  ];

  // Reset current page and search query when active tab changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery(""); // Clear search query on tab change
  }, [activeTab]);

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'recruiters') {
          const res = await axios.get(`${backendUrl}/api/admin/unverified-recruiters`, { withCredentials: true });
          setRecruiters(res.data?.data || []);
        } else if (activeTab === 'jobs') {
          const res = await axios.get(`${backendUrl}/api/admin/unverified-jobs`, { withCredentials: true });
          setJobs(res.data?.jobs || []);
        } else if (activeTab === 'all_user') {
          const res = await axios.get(`${backendUrl}/api/admin/all-users`, { withCredentials: true });
          setUsers(res.data?.users || []);
        } else if (activeTab === 'all_recruiter') {
          const res = await axios.get(`${backendUrl}/api/admin/all-recruiters`, { withCredentials: true });
          setAllRecruiters(res.data?.recruiters || []);
          console.log(allRecruiters);

        // Credit system removed
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, [activeTab]);

  // Handler for verifying a recruiter
  const handleVerifyRecruiter = async (recruiterId) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/admin/verify-recruiter/${recruiterId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Recruiter verified successfully");
        setRecruiters((prev) => prev.filter(r => r._id !== recruiterId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Recruiter verification failed");
    }
  };
  // Credit system removed

  // Handler for verifying a job post
  const handleVerifyJob = async (jobId) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/admin/verify/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Job post verified successfully");
        setJobs((prev) => prev.filter(j => j._id !== jobId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Job verification failed");
    }
  };

  // Handler for toggling premium access for a recruiter
  const handleTogglePremiumAccess = async (recruiterId, newStatus) => {
    try {
      const res = await axios.put(`${backendUrl}/api/admin/update-premium/${recruiterId}`, {
        havePremiumAccess: newStatus,
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message || "Updated premium access");
        setAllRecruiters(prev =>
          prev.map(r =>
            r._id === recruiterId ? { ...r, havePremiumAccess: newStatus } : r
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update access");
    }
  };

  // Handler for viewing recruiter details (job posts)
  const handleViewRecruiterDetails = (companyId) => {
    navigate(`/admin/recruiter-jobs/${companyId}`);
  };

  // Filter data for 'all_recruiter' tab, as AdminDashboard directly renders these
  const filteredDataForRecruiterTable = allRecruiters.filter(recruiter =>
    recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (recruiter.phone && recruiter.phone.includes(searchQuery))
  );

  // Calculate total pages for the 'all_recruiter' tab
  const totalPagesForRecruiterTable = Math.ceil(filteredDataForRecruiterTable.length / itemsPerPage);

  // Function to change the current page for 'all_recruiter' tab
  const changePageForRecruiterTable = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPagesForRecruiterTable) {
      setCurrentPage(pageNum);
    }
  };

  // Determine if pagination should be shown for 'all_recruiter' tab
  const shouldShowRecruiterTablePagination = activeTab === "all_recruiter" && totalPagesForRecruiterTable > 1;

  // Determine the "no data" message based on activeTab and searchQuery
  let noDataMessage = "";
  if (activeTab === "recruiters") {
    noDataMessage = "No unverified recruiters at the moment.";
  } else if (activeTab === "jobs") {
    noDataMessage = "No unverified job posts available.";
  } else if (activeTab === "all_user") {
    noDataMessage = "No users found.";
  } else if (activeTab === "all_recruiter") {
    noDataMessage = searchQuery ? "No matching recruiters found." : "No recruiters found.";
  } // Credit system removed

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar component */}
      <Navbar />
      <div className="flex flex-1 h-[100vh] overflow-hidden">
        {/* Sidebar component, passing activeTab, setActiveTab, and tabs */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-auto mt-14">
          {activeTab === "recruiters" ? (
            <RecruiterVerifacationPage
              recruiters={recruiters}
              onVerify={handleVerifyRecruiter}
              itemsPerPage={itemsPerPage}
            />
          ) : activeTab === "jobs" ? (
            <JobPostCard
              jobs={jobs}
              onVerifyJob={handleVerifyJob}
              itemsPerPage={itemsPerPage}
            />
          ) :
            // Credit system removed
             activeTab === "all_user" ? (
              <UserVerificationPage
                users={users}
                itemsPerPage={itemsPerPage}
              />
            ) : activeTab === "all_recruiter" ? (
              <>
                {/* Search bar for All Recruiter tab */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, email or phone..."
                      className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>
                {/* All Recruiter Table */}
                {filteredDataForRecruiterTable.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white text-gray-800">
                      <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                        <tr>
                          <th className="py-3 px-6 text-left">Company Image</th>
                          <th className="py-3 px-6 text-left">Company Name</th>
                          <th className="py-3 px-6 text-left">Email</th>
                          <th className="py-3 px-6 text-left">Phone</th>
                          <th className="py-3 px-6 text-left">Premium Access</th>
                          <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {filteredDataForRecruiterTable
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((recruiter) => (
                            <tr key={recruiter._id} className="border-b border-gray-200 hover:bg-gray-100">
                              <td className="py-3 px-6 text-left whitespace-nowrap">
                                <img
                                  src={recruiter.image || "https://placehold.co/40x40/cccccc/333333?text=Logo"}
                                  alt={recruiter.name}
                                  className="w-10 h-10 object-cover rounded-full"
                                />
                              </td>
                              <td className="py-3 px-6 text-left">{recruiter.name}</td>
                              <td className="py-3 px-6 text-left break-words">{recruiter.email}</td>
                              <td className="py-3 px-6 text-left">{recruiter.phone || "N/A"}</td>
                              <td className="py-3 px-6 text-left">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${recruiter.havePremiumAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                  {recruiter.havePremiumAccess ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-center flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => handleTogglePremiumAccess(recruiter._id, !recruiter.havePremiumAccess)}
                                  className={`py-2 px-4 rounded-md text-xs font-semibold transition ${recruiter.havePremiumAccess
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                    }`}
                                >
                                  {recruiter.havePremiumAccess ? "Revoke" : "Grant"}
                                </button>
                                <button
                                  onClick={() => handleViewRecruiterDetails(recruiter._id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-xs font-semibold transition"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full mt-12">
                    <p className="text-gray-400 text-lg italic">
                      {noDataMessage}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full mt-12">
                <p className="text-gray-400 text-lg italic">
                  {noDataMessage}
                </p>
              </div>
            )}

          {shouldShowRecruiterTablePagination && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => changePageForRecruiterTable(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-white hover:bg-gray-700"
                  }`}
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(5, totalPagesForRecruiterTable) }, (_, i) => {
                let pageNum;
                if (totalPagesForRecruiterTable <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPagesForRecruiterTable - 2) {
                  pageNum = totalPagesForRecruiterTable - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => changePageForRecruiterTable(pageNum)}
                    className={`px-3 py-1 rounded-md ${currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPagesForRecruiterTable > 5 && currentPage < totalPagesForRecruiterTable - 2 && (
                <>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => changePageForRecruiterTable(totalPagesForRecruiterTable)}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-800"
                  >
                    {totalPagesForRecruiterTable}
                  </button>
                </>
              )}
              <button
                onClick={() => changePageForRecruiterTable(currentPage + 1)}
                disabled={currentPage === totalPagesForRecruiterTable}
                className={`p-2 rounded-md ${currentPage === totalPagesForRecruiterTable
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-white hover:bg-gray-700"
                  }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
