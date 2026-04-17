import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Navbar from "../../Components/Navbar";
import { assets } from "../../assets/assets";
import moment from "moment";
import JobCard from "../../Components/Jobs/Jobcard";
import toast from "react-hot-toast";
import { ChevronLeft, Share2, Bookmark, ExternalLink } from "lucide-react";
const backendUrl = import.meta.env?.VITE_API_URL;

import {
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  IndianRupee,
  GraduationCap,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import axios from "../../utils/axiosConfig";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30";
    case "Rejected":
      return "bg-rose-500 text-white shadow-lg shadow-rose-500/30";
    case "In Review":
      return "bg-amber-500 text-white shadow-lg shadow-amber-500/30";
    default:
      return "bg-slate-400 text-white";
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

  const location = useLocation();
  const showBackButton = location.pathname.startsWith("/dashboard/preview-job");
  const getIsUserAuth = () => JSON.parse(localStorage.getItem("boolC"));

  const fetchFullUserProfile = async () => {
    try {
      if (getIsUserAuth()) {
        const res = await axios.get(`${backendUrl}/api/profile/get-user`);
        if (res.data.success) {
          setUserData(res.data.profile);
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
    return moment(deadline).format("MMM DD, YYYY");
  };

  const handleBackClick = () => {
    navigate("/dashboard/manage-jobs");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {!previewMode && <Navbar />}
      
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="mb-6 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium group"
          >
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Manage Jobs</span>
          </button>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-6">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="animate-pulse space-y-6">
                  <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
                  <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-48 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ) : jobData ? (
              <>
                {/* Job Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                  <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-10">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="bg-white p-4 rounded-xl shadow-2xl border-4 border-white/50">
                          <img
                            className="h-20 w-20 object-contain"
                            src={jobData.companyId?.image || assets.default_company_logo}
                            alt={jobData.companyId?.name || "Company"}
                          />
                        </div>
                        <div className="flex-1 text-white">
                          <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                            {jobData.title}
                          </h1>
                          <p className="text-indigo-100 flex items-center gap-2 text-lg mb-4">
                            <Building2 className="h-5 w-5" />
                            {jobData.companyId?.name || "Company Name"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                              {jobData.level}
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                              {jobData.category || "General"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!previewMode && (
                        <div className="mt-6 flex flex-wrap gap-3">
                          <button
                            onClick={handleApplyNow}
                            disabled={hasApplied}
                            className={`px-8 py-3 rounded-xl font-semibold shadow-2xl transition-all transform hover:scale-105 ${
                              hasApplied
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                : "bg-white text-indigo-600 hover:bg-indigo-50"
                            }`}
                          >
                            {hasApplied ? "✓ Applied" : "Apply Now"}
                          </button>
                          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
                            <Bookmark className="h-5 w-5 text-white" />
                          </button>
                          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
                            <Share2 className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Application Status */}
                  {hasApplied && (
                    <div className="mx-8 -mt-4 mb-6 relative z-20">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white shadow-2xl">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <p className="text-sm opacity-90 mb-1">Application Status</p>
                            <div className="flex items-center gap-3">
                              <span className={`px-4 py-1.5 rounded-lg text-sm font-bold ${getStatusBadgeColor(userApplication.status)}`}>
                                {userApplication.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm opacity-90">Applied on</p>
                            <p className="font-semibold">
                              {moment(userApplication.appliedDate).format("MMM DD, YYYY")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Details Grid */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-indigo-600 rounded-lg">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">Location</span>
                        </div>
                        <p className="text-slate-900 font-bold text-lg">{jobData.location}</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-purple-600 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">Experience</span>
                        </div>
                        <p className="text-slate-900 font-bold text-lg">{jobData.level}</p>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-emerald-600 rounded-lg">
                            <IndianRupee className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">Salary</span>
                        </div>
                        <p className="text-slate-900 font-bold text-lg">₹{jobData.salary.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-slate-200">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm">Deadline:</span>
                        <span className="font-semibold text-slate-900">{formatDeadline(jobData.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Briefcase className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm">Category:</span>
                        <span className="font-semibold text-slate-900">{jobData.category || "General"}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                        Job Description
                      </h2>
                      <div
                        className="text-slate-700 prose max-w-none leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: jobData.description }}
                      ></div>
                    </div>

                    {/* Requirements */}
                    {jobData.requirements && jobData.requirements.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                          Requirements
                        </h2>
                        <ul className="space-y-3">
                          {jobData.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3 text-slate-700">
                              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                ✓
                              </span>
                              <span className="flex-1">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Company Info */}
                    {jobData.companyId && (
                      <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Building2 className="h-6 w-6 text-indigo-600" />
                          About the Company
                        </h2>
                        <p className="text-slate-700 mb-4">{jobData.companyDetails.shortDescription}</p>
                        {jobData.companyDetails && jobData.companyDetails.city && (
                          <p className="text-sm text-slate-600">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            {jobData.companyDetails.city}
                            {jobData.companyDetails.state && `, ${jobData.companyDetails.state}`}
                            {jobData.companyDetails.country && `, ${jobData.companyDetails.country}`}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Bottom Apply Button */}
                    {!previewMode && (
                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={handleApplyNow}
                          disabled={hasApplied}
                          className={`px-10 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all transform hover:scale-105 ${
                            hasApplied
                              ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                          }`}
                        >
                          {hasApplied ? "✓ Application Submitted" : "Apply for this Position →"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="h-10 w-10 text-rose-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Job Not Found</h3>
                <p className="text-slate-600 mb-6">This job posting may have been removed or doesn't exist.</p>
                <button
                  onClick={() => navigate("/jobs")}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Browse All Jobs
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            {!previewMode && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Similar Opportunities
                  </h2>
                </div>
                <div className="p-4">
                  {similarJobs.length > 0 ? (
                    <div className="space-y-3">
                      {similarJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm">No similar jobs available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {jobData && jobData.companyDetails && jobData.companyDetails.hrName && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Contact HR
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">HR Manager</p>
                    <p className="text-slate-900 font-bold text-lg">{jobData.companyDetails.hrName}</p>
                  </div>
                  {jobData.companyDetails.hrEmail && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-600 mb-1">Email</p>
                      <p className="text-slate-900 font-semibold text-sm break-all">{jobData.companyDetails.hrEmail}</p>
                    </div>
                  )}
                  {jobData.companyDetails.hrPhone && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-600 mb-1">Phone</p>
                      <p className="text-slate-900 font-semibold">{jobData.companyDetails.hrPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;