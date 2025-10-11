// ApplyJob.js
import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Navbar from "../../Components/Navbar";
import { assets } from "../../assets/assets";
import moment from "moment";
import JobCard from "../../Components/Jobs/Jobcard";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react"; // Import ChevronLeft icon
const backendUrl = import.meta.env?.VITE_API_URL;

import {
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  IndianRupee,
  GraduationCap,
} from "lucide-react";
import axios from "../../utils/axiosConfig";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-500 text-white";
    case "Rejected":
      return "bg-red-500 text-white";
    case "In Review":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-300 text-gray-800";
  }
};

const ApplyJob = ({ previewMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    jobs,
    userApplications,
    userData,
    setUserData,
    homeJobs,
    isUserAuthenticated,
  } = useContext(AppContext);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const allJobs = isUserAuthenticated ? homeJobs : jobs;
  // Check if the user is a recruiter
  //  const isRecruiter = userData?.role === 'recruiter';

  const location = useLocation();
  const showBackButton = location.pathname.startsWith("/dashboard/preview-job");
  const getIsUserAuth = () => JSON.parse(localStorage.getItem("boolC"));

  // Function to fetch full user profile
  const fetchFullUserProfile = async () => {
    try {
      if (getIsUserAuth()) {
        const res = await axios.get(`${backendUrl}/api/profile/get-user`);

        if (res.data.success) {
          setUserData(res.data.profile); // Full profile is stored
          setUserDataLoading(false);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchFullUserProfile();
  }, []);

  useEffect(() => {
    if (!allJobs || allJobs.length === 0) {
      setLoading(true);
      return;
    }
    const selectedJob = allJobs.find((job) => job._id === id);
    if (selectedJob) {
      setJobData(selectedJob);
      const filteredJobs = allJobs
        .filter(
          (job) =>
            job._id !== id &&
            (job.level === selectedJob.level ||
              job.category === selectedJob.category ||
              job.location === selectedJob.location)
        )
        .slice(0, 4);
      setSimilarJobs(filteredJobs);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id, allJobs]);

  const userApplication =
    jobData &&
    userApplications &&
    userApplications.find((app) => app.jobId && app.jobId._id === jobData._id);

  const hasApplied = Boolean(userApplication);

  const isProfileComplete = () => {
    return userData && userData.address && userData.address.street;
  };

  const handleApplyNow = () => {
    if (!userData || !userData._id) {
      toast.error("Please wait while we load your profile.");
      return;
    }

    if (!isProfileComplete()) {
      toast.error("Please complete your profile first.");
      navigate("/profile");
      return;
    }

    if (hasApplied) return;
    if (jobData?.url) {
      return window.open(jobData.url, "_blank");
    }

    navigate(`/apply-job-form/${id}`);
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "Not specified";
    return moment(deadline).format("MMMM, DD, YYYY");
  };

  // Handle Back Button click
  const handleBackClick = () => {
    navigate("/dashboard/manage-jobs"); // Navigate back to the manage jobs page
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {!previewMode && <Navbar />}
      <div className="container mx-auto px-4 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-3/4 space-y-6">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mt-4"></div>
                  <div className="h-32 bg-gray-200 rounded mt-6"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading job details...</p>
              </div>
            ) : jobData ? (
              <>
                {/* Job Header */}
                <div className="bg-amber-800 px-8 py-6 text-white">
                  {showBackButton && (
                    <div className="absolute top-20 left-22 -translate-x-10 sm:-translate-x-8">
                      <button
                        onClick={handleBackClick} // Back Button functionality
                        className="px-2 py-2 rounded-md font-medium bg-gray-100 text-black hover:bg-gray-200 flex items-center gap-2 text-sm sm:text-base"
                      >
                        <ChevronLeft className="h-5 w-5 text-black" />{" "}
                        {/* Left Chevron Icon */}
                        Back to Manage Jobs
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-md">
                        <img
                          className="h-16 w-16 object-contain"
                          src={
                            jobData.companyId?.image ||
                            assets.default_company_logo
                          }
                          alt={jobData.companyId?.name || "Company"}
                        />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">{jobData.title}</h1>
                        <p className="text-blue-100 flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {jobData.companyId?.name || "Company Name"}
                        </p>
                      </div>
                    </div>

                    {/* Render Apply Button only if not in preview mode */}
                    {!previewMode && (
                      <div className="mt-4 md:mt-0">
                        <button
                          onClick={handleApplyNow}
                          disabled={hasApplied}
                          className={`px-6 py-2 rounded-md font-medium shadow-md transition ${
                            hasApplied
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "bg-white text-black hover:bg-gray-100"
                          }`}
                        >
                          {hasApplied ? "Already Applied" : "Apply Now"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="p-8">
                  {hasApplied && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-lg font-semibold flex items-center gap-2">
                        Application Status:
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                            userApplication.status
                          )}`}
                        >
                          {userApplication.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Applied on:{" "}
                        {moment(userApplication.appliedDate).format(
                          "MMMM Do, YYYY"
                        )}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-5 w-5 text-amber-900" />
                        <span className="text-sm font-medium">Location</span>
                      </div>
                      <p className="text-gray-900 font-semibold mt-1">
                        {jobData.location}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700">
                        <GraduationCap className="h-5 w-5 text-amber-900" />
                        <span className="text-sm font-medium">Experience</span>
                      </div>
                      <p className="text-gray-900 font-semibold mt-1">
                        {jobData.level}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700">
                        <IndianRupee className="h-5 w-5 text-amber-900" />
                        <span className="text-sm font-medium">
                          Annual Salary
                        </span>
                      </div>
                      <p className="text-gray-900 font-semibold mt-1">
                        ₹{jobData.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between gap-4 mb-8 text-sm text-gray-600 border-b border-gray-200 pb-6">
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-amber-900" />
                      <span>Application Deadline: </span>
                      <span className="font-medium text-gray-900">
                        {formatDeadline(jobData.deadline)}
                      </span>
                    </p>
                    <p className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-amber-900" />
                      <span>Job Category: </span>
                      <span className="font-medium text-gray-900">
                        {jobData.category || "Not specified"}
                      </span>
                    </p>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Job Description
                    </h2>
                    <div
                      className="text-gray-700 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: jobData.description }}
                    ></div>
                  </div>

                  {jobData.requirements && jobData.requirements.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Responsibilities & Requirements
                      </h2>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        {jobData.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {jobData.companyId && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        About the Company
                      </h2>
                      <p className="text-gray-600">
                        {jobData.companyDetails.shortDescription}
                      </p>
                      {jobData.companyDetails && (
                        <div className="mt-4 text-sm text-gray-600">
                          {jobData.companyDetails.city && (
                            <p className="mt-2">
                              Location: {jobData.companyDetails.city}
                              {jobData.companyDetails.state &&
                                `, ${jobData.companyDetails.state}`}
                              {jobData.companyDetails.country &&
                                `, ${jobData.companyDetails.country}`}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Bottom Apply Button only if not in preview mode */}
                  {!previewMode && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleApplyNow}
                        disabled={hasApplied}
                        className={`px-8 py-3 rounded-md font-medium text-lg shadow-md transition ${
                          hasApplied
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-amber-900 text-white hover:bg-[#DCA972]"
                        }`}
                      >
                        {hasApplied
                          ? "You've Already Applied"
                          : "Apply for this Position"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-red-500">
                  Job not found or has been removed.
                </p>
                <button
                  onClick={() => navigate("/jobs")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Browse All Jobs
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}

        <div className="w-full lg:w-1/4 space-y-6">
          {!previewMode && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Similar Jobs
                </h2>
              </div>
              <div className="p-4">
                {similarJobs.length > 0 ? (
                  <div className="space-y-4">
                    {similarJobs.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">
                    No similar jobs found at this time.
                  </p>
                )}
              </div>
            </div>
          )}

          {jobData &&
            jobData.companyDetails &&
            jobData.companyDetails.hrName && (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Contact Information
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-800 font-medium">
                    {jobData.companyDetails.hrName}
                  </p>
                  {jobData.companyDetails.hrEmail && (
                    <p className="text-gray-600 mt-2">
                      Email: {jobData.companyDetails.hrEmail}
                    </p>
                  )}
                  {jobData.companyDetails.hrPhone && (
                    <p className="text-gray-600 mt-1">
                      Phone: {jobData.companyDetails.hrPhone}
                    </p>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
