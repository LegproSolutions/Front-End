"use client";

import { useContext, useState } from "react";
import {
  ChevronLeft,
  Briefcase,
  User,
  GraduationCap,
  MapPin,
  Building,
  Clock,
  Download,
  FileSpreadsheet,
  Lock,
} from "lucide-react";
import { AppContext } from "../../context/AppContext";
import * as XLSX from "xlsx";

/**
 * Helper to get a Tailwind color class for a given status.
 */
function getStatusBadgeColor(status) {
  switch (status) {
    case "Accepted":
      return "bg-green-500 text-white";
    case "Rejected":
      return "bg-red-500 text-white";
    case "Onboarded":
      return "bg-blue-500 text-white";
    case "Interviewed":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-300 text-gray-800";
  }
}

/**
 * Helper function to convert job application data to a format suitable for Excel
 */
/**
 * Helper function to convert job application data to a format suitable for Excel
 * with dedicated columns for each education level
 */
function prepareApplicantDataForExcel(applicants) {
  return applicants.map((app) => {
    const data = app || {};
    const appData = data.applicationData || {};
    const education = appData.education || {};

    // Convert experience data to a more readable format
    const experienceSummary = appData.experience?.length
      ? appData.experience
          .map((exp) => `${exp.company || "N/A"} (${exp.position || "N/A"})`)
          .join("; ")
      : "None";

    // Create a base object with common fields
    const baseData = {
      Name: data.userId?.name || "N/A",
      Email: appData.email || "N/A",
      Phone: appData.phone || "N/A",
      "Job Position": data.jobId?.title || "N/A",
      Status: data.status || "Pending",
      "Interview Status": data.interview || "Not Interviewed",
      "Onboarding Status": data.onboarding || "Not Onboarded",
      "Date of Birth": appData.dateOfBirth || "N/A",
      Gender: appData.gender || "N/A",
      Nationality: appData.nationality || "N/A",
    };

    // Add dedicated columns for each education level
    // 10th Standard
    if (education["10th"]) {
      const tenth = education["10th"].instituteFields || {};
      baseData["10th_Institute"] = tenth.instituteName || "N/A";
      baseData["10th_Board"] = tenth.certificationBody || "N/A";
      baseData["10th_Year"] = tenth.passingYear || "N/A";
      baseData["10th_Percentage"] = tenth.percentage || "N/A";
    } else {
      baseData["10th_Institute"] = "N/A";
      baseData["10th_Board"] = "N/A";
      baseData["10th_Year"] = "N/A";
      baseData["10th_Percentage"] = "N/A";
    }

    // 12th Standard
    if (education["12th"]) {
      const twelfth = education["12th"].instituteFields || {};
      baseData["12th_Institute"] = twelfth.instituteName || "N/A";
      baseData["12th_Board"] = twelfth.certificationBody || "N/A";
      baseData["12th_Year"] = twelfth.passingYear || "N/A";
      baseData["12th_Percentage"] = twelfth.percentage || "N/A";
    } else {
      baseData["12th_Institute"] = "N/A";
      baseData["12th_Board"] = "N/A";
      baseData["12th_Year"] = "N/A";
      baseData["12th_Percentage"] = "N/A";
    }

    // Undergraduate
    if (education["Undergraduate"]) {
      const ug = education["Undergraduate"].instituteFields || {};
      baseData["UG_Institute"] = ug.instituteName || "N/A";
      baseData["UG_University"] = ug.certificationBody || "N/A";
      baseData["UG_Course"] = ug.courseName || "N/A";
      baseData["UG_Specialization"] = ug.specialization || "N/A";
      baseData["UG_Year"] = ug.passingYear || "N/A";
      baseData["UG_Percentage"] = ug.percentage || "N/A";
    } else {
      baseData["UG_Institute"] = "N/A";
      baseData["UG_University"] = "N/A";
      baseData["UG_Course"] = "N/A";
      baseData["UG_Specialization"] = "N/A";
      baseData["UG_Year"] = "N/A";
      baseData["UG_Percentage"] = "N/A";
    }

    // Postgraduate
    if (education["Postgraduate"]) {
      const pg = education["Postgraduate"].instituteFields || {};
      baseData["PG_Institute"] = pg.instituteName || "N/A";
      baseData["PG_University"] = pg.certificationBody || "N/A";
      baseData["PG_Course"] = pg.courseName || "N/A";
      baseData["PG_Specialization"] = pg.specialization || "N/A";
      baseData["PG_Year"] = pg.passingYear || "N/A";
      baseData["PG_Percentage"] = pg.percentage || "N/A";
    } else {
      baseData["PG_Institute"] = "N/A";
      baseData["PG_University"] = "N/A";
      baseData["PG_Course"] = "N/A";
      baseData["PG_Specialization"] = "N/A";
      baseData["PG_Year"] = "N/A";
      baseData["PG_Percentage"] = "N/A";
    }

    // ITI
    if (education["ITI"]) {
      const iti = education["ITI"].instituteFields || {};
      baseData["ITI_Institute"] = iti.instituteName || "N/A";
      baseData["ITI_Board"] = iti.certificationBody || "N/A";
      baseData["ITI_Trade"] = iti.trade || "N/A";
      baseData["ITI_Year"] = iti.passingYear || "N/A";
      baseData["ITI_Percentage"] = iti.percentage || "N/A";
    } else {
      baseData["ITI_Institute"] = "N/A";
      baseData["ITI_Board"] = "N/A";
      baseData["ITI_Trade"] = "N/A";
      baseData["ITI_Year"] = "N/A";
      baseData["ITI_Percentage"] = "N/A";
    }

    // Diploma
    if (education["Diploma"]) {
      const diploma = education["Diploma"].instituteFields || {};
      baseData["Diploma_Institute"] = diploma.instituteName || "N/A";
      baseData["Diploma_Board"] = diploma.certificationBody || "N/A";
      baseData["Diploma_Field"] = diploma.courseName || "N/A";
      baseData["Diploma_Duration"] = diploma.courseDuration || "N/A";
      baseData["Diploma_Year"] = diploma.passingYear || "N/A";
      baseData["Diploma_Percentage"] = diploma.percentage || "N/A";
    } else {
      baseData["Diploma_Institute"] = "N/A";
      baseData["Diploma_Board"] = "N/A";
      baseData["Diploma_Field"] = "N/A";
      baseData["Diploma_Duration"] = "N/A";
      baseData["Diploma_Year"] = "N/A";
      baseData["Diploma_Percentage"] = "N/A";
    }

    // Add address and experience data
    baseData["Current City"] = appData.currentAddress?.city || "N/A";
    baseData["Current State"] = appData.currentAddress?.state || "N/A";
    baseData["Experience"] = experienceSummary;

    return baseData;
  });
}
/**
 * Function to download data as Excel file
 */
function downloadAsExcel(data, filename = "applicants-data") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

  // Auto-size columns
  const maxWidths = {};
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      const value = String(row[key]);
      maxWidths[key] = Math.max(maxWidths[key] || 0, value.length);
    });
  });

  worksheet["!cols"] = Object.keys(data[0]).map((key) => ({
    wch: Math.min(Math.max(maxWidths[key], key.length), 50), // Cap width at 50 characters
  }));

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

const ViewApplications = () => {
  const {
    jobs = [],
    jobApplicants = [],
    fetchJobApplicants,
    fetchJobs,
    jobAppData = [],
    changeJobApplicationStatus,
    changeInterviewStatus,
    changeOnboardingStatus,
    companyData
  } = useContext(AppContext);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [allApplicantsData, setAllApplicantsData] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 2;

  const handleJobClick = async (job) => {
    setSelectedJob(job);
    setLoading(true);
    await fetchJobApplicants(job._id);
    setLoading(false);
    setCurrentPage(1);
  };

  const handleDownloadAllApplicants = async () => {
    setIsDownloading(true);
    try {
      // Fetch all job applications if not already available
      // This assumes you have a function in your context to fetch all applications
      // If not, you'll need to implement it
      let allData = allApplicantsData;
      if (!allData.length) {
        allData = await fetchJobs();
        setAllApplicantsData(allData);
      }

      const excelData = prepareApplicantDataForExcel(allData);
      downloadAsExcel(excelData, "all-job-applicants");
    } catch (error) {
      console.error("Error downloading applicants data:", error);
      alert("Failed to download data. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadJobApplicants = () => {
    if (!jobApplicants?.length) return;

    const excelData = prepareApplicantDataForExcel(jobApplicants);
    downloadAsExcel(
      excelData,
      `applicants-${selectedJob.title.replace(/\s+/g, "-").toLowerCase()}`
    );
  };

  if (!selectedJob) {
    return (
         <div className="relative container mx-auto px-4 sm:px-6 py-6 overflow-auto w-full">

      {/* Lock screen if user does not have premium access */}
      {!companyData?.havePremiumAccess && (
        <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center px-4">
          <Lock className="w-16 h-16 text-gray-500 mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Premium Access Required</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-md">
            You need a premium subscription to access The View Appications feature. Please contact support or upgrade your plan to continue.
          </p>
        </div>
      )}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-center">Job Applications</h2>
          {/* <button
            onClick={handleDownloadAllApplicants}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            <FileSpreadsheet className="h-5 w-5" />
            {isDownloading ? 'Downloading...' : 'Download All Data'}
          </button> */}
        </div>
       <div className="bg-white shadow-md rounded-lg p-6">
  <div className="flex items-center gap-2 mb-4">
    <Briefcase className="h-5 w-5" />
    <h3 className="text-xl font-semibold">Available Positions</h3>
  </div>

  <div className="grid gap-3 sm:grid-cols-2">
    {jobs?.map((job) => {
      const isVerified = job.isVerified;

      return (
        <div
          key={job._id}
          className={`border rounded-lg p-4 transition-all ${
            isVerified
              ? "bg-white cursor-pointer hover:shadow-md hover:border-blue-300 border-gray-200"
              : "bg-gray-100 cursor-not-allowed border-gray-300"
          }`}
          onClick={() => {
            if (isVerified) {
              handleJobClick(job);
            } else {
              toast.error(
                "This job post is pending admin verification. Please contact support for more information."
              );
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{job.title}</h3>
              {job.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {job.location}
                </p>
              )}
              {!isVerified && (
                <p className="text-xs text-red-500 mt-1">
                 Almost There! Waiting for Admin Confirmation
                </p>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl font-sans">
        <button
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md mb-6 hover:bg-gray-600 transition"
          onClick={() => setSelectedJob(null)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </button>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!jobApplicants?.length) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl font-sans">
        <button
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md mb-6 hover:bg-gray-600 transition"
          onClick={() => setSelectedJob(null)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </button>
        <div className="bg-white shadow-md rounded-lg p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <User className="h-12 w-12 text-gray-400" />
            <h3 className="text-xl font-medium">No Applications Found</h3>
            <p className="text-gray-500">
              There are currently no applications for this position.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalApplicants = jobApplicants?.length || 0;
  const totalPages = Math.ceil(totalApplicants / applicantsPerPage);
  const startIndex = (currentPage - 1) * applicantsPerPage;
  const endIndex = startIndex + applicantsPerPage;
  const currentApplicants = jobApplicants?.slice(startIndex, endIndex) || [];

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold">
            {selectedJob?.title}
          </h2>
          <p className="text-gray-500 mt-1">
            {totalApplicants} applicant{totalApplicants !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            onClick={() => setSelectedJob(null)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </button>
          <button
            onClick={handleDownloadJobApplicants}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Download className="h-4 w-4" /> Download Excel
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, totalApplicants)} of{" "}
          {totalApplicants} candidates
        </p>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="space-y-6">
        {currentApplicants?.map((app, index) => {
          const data = app || {};
          const badgeColor = getStatusBadgeColor(data.status);
          const applicantName = data.userId?.name || "N/A";
          const initials =
            applicantName !== "N/A"
              ? applicantName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "NA";

          return (
            <div
              key={data._id || index}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 p-4 pb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      data.interview === "Interviewed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {data.interview || "Not Interviewed"}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      data.onboarding === "Onboarded"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {data.onboarding || "Not Onboarded"}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      data.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {data.status || "Pending"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{applicantName}</h3>
                      <p className="text-sm text-gray-500">
                        {data.applicationData.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-6">
                  {/* Toggle Interview */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Interview</span>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0"
                        onChange={async () => {
                          const newInterviewStatus =
                            data.interview === "Interviewed"
                              ? "Not Interviewed"
                              : "Interviewed";
                          await changeInterviewStatus(
                            data._id,
                            newInterviewStatus
                          );
                        }}
                        checked={data.interview === "Interviewed"}
                      />
                      <span
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-full ${
                          data.interview === "Interviewed"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      <span
                        className={`absolute left-1 top-1 transition-all duration-300 bg-white rounded-full w-4 h-4 transform ${
                          data.interview === "Interviewed"
                            ? "translate-x-6"
                            : ""
                        }`}
                      ></span>
                    </label>
                  </div>

                  {/* Toggle Onboarding */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Onboarding</span>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0"
                        onChange={async () => {
                          const newOnboardingStatus =
                            data.onboarding === "Onboarded"
                              ? "Not Onboarded"
                              : "Onboarded";
                          await changeOnboardingStatus(
                            data._id,
                            newOnboardingStatus
                          );
                        }}
                        checked={data.onboarding === "Onboarded"}
                      />
                      <span
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-full ${
                          data.onboarding === "Onboarded"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      <span
                        className={`absolute left-1 top-1 transition-all duration-300 bg-white rounded-full w-4 h-4 transform ${
                          data.onboarding === "Onboarded" ? "translate-x-6" : ""
                        }`}
                      ></span>
                    </label>
                  </div>

                  {/* Toggle Accept/Reject */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Decision</span>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0"
                        onChange={async () => {
                          const newStatus =
                            data.status === "Accepted"
                              ? "Rejected"
                              : "Accepted";
                          await changeJobApplicationStatus(data._id, newStatus);
                        }}
                        checked={data.status === "Accepted"}
                      />
                      <span
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-full ${
                          data.status === "Accepted"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span
                        className={`absolute left-1 top-1 transition-all duration-300 bg-white rounded-full w-4 h-4 transform ${
                          data.status === "Accepted" ? "translate-x-6" : ""
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "personal"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Personal Info
                  </button>
                  <button
                    onClick={() => setActiveTab("education")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "education"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Education
                  </button>
                  <button
                    onClick={() => setActiveTab("experience")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "experience"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Experience
                  </button>
                  <button
                    onClick={() => setActiveTab("address")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "address"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Address
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "personal" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {data.applicationData?.dateOfBirth || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Father's Name</p>
                      <p className="font-medium">
                        {data.applicationData.fatherName || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">
                        {data.applicationData.gender || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Marital Status</p>
                      <p className="font-medium">
                        {data.applicationData.maritalStatus || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Nationality</p>
                      <p className="font-medium">
                        {data.applicationData.nationality || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Aadhaar</p>
                      <p className="font-medium">
                        {data.applicationData.aadharNumber || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {data.applicationData.phone || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Alternate Phone</p>
                      <p className="font-medium">
                        {data.applicationData.altPhone || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-medium">
                        {data.applicationData.height || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Job Title</p>
                      <p className="font-medium">{data.jobId.title || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {data.applicationData.currentAddress.city || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">
                        {data.applicationData.experience &&
                        data.applicationData.experience.length
                          ? `${data.applicationData.experience.length} Year(s)`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "education" &&
                  data.applicationData.education && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {Object.keys(data.applicationData.education).map(
                        (level) => {
                          const eduEntry =
                            data.applicationData.education[level];
                          const fields = eduEntry.instituteFields || {};
                          return (
                            <div
                              key={level}
                              className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full"
                            >
                              <div className="p-3 border-b border-gray-100">
                                <h4 className="text-base font-medium flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4" />
                                  {level}
                                </h4>
                              </div>
                              <div className="p-3 flex-1 overflow-auto">
                                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                                  <dt className="text-gray-500">Institute</dt>
                                  <dd className="font-medium">
                                    {fields.instituteName || "N/A"}
                                  </dd>

                                  <dt className="text-gray-500">
                                    Certification
                                  </dt>
                                  <dd className="font-medium">
                                    {fields.certificationBody || "N/A"}
                                  </dd>

                                  {fields.courseName && (
                                    <>
                                      <dt className="text-gray-500">Course</dt>
                                      <dd className="font-medium">
                                        {fields.courseName}
                                      </dd>
                                    </>
                                  )}

                                  {fields.courseType && (
                                    <>
                                      <dt className="text-gray-500">Type</dt>
                                      <dd className="font-medium">
                                        {fields.courseType}
                                      </dd>
                                    </>
                                  )}

                                  {fields.courseDuration && (
                                    <>
                                      <dt className="text-gray-500">
                                        Duration
                                      </dt>
                                      <dd className="font-medium">
                                        {fields.courseDuration}
                                      </dd>
                                    </>
                                  )}

                                  <dt className="text-gray-500">Year</dt>
                                  <dd className="font-medium">
                                    {fields.passingYear || "N/A"}
                                  </dd>

                                  <dt className="text-gray-500">Percentage</dt>
                                  <dd className="font-medium">
                                    {fields.percentage || "N/A"}
                                  </dd>

                                  {fields.specialization && (
                                    <>
                                      <dt className="text-gray-500">
                                        Specialization
                                      </dt>
                                      <dd className="font-medium col-span-1">
                                        {fields.specialization}
                                      </dd>
                                    </>
                                  )}

                                  {fields.trade && (
                                    <>
                                      <dt className="text-gray-500">Trade</dt>
                                      <dd className="font-medium">
                                        {fields.trade}
                                      </dd>
                                    </>
                                  )}
                                </dl>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                {activeTab === "experience" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Apprenticeship
                      </h3>
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Company</p>
                            <p className="font-medium">
                              {data.applicationData.apprenticeship
                                ?.companyName || "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Tenure</p>
                            <p className="font-medium">
                              {data.applicationData.apprenticeship?.tenure ||
                                "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Salary</p>
                            <p className="font-medium">
                              {data.applicationData.apprenticeship?.salary ||
                                "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">
                              {data.applicationData.apprenticeship?.location ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Work Experience
                      </h3>
                      {data.applicationData.experience?.length ? (
                        <div className="space-y-4">
                          {data.applicationData.experience.map((exp, i) => (
                            <div
                              key={i}
                              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-500">
                                    Company
                                  </p>
                                  <p className="font-medium">
                                    {exp.company || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-500">
                                    Position
                                  </p>
                                  <p className="font-medium">
                                    {exp.position || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-500">
                                    Start Date
                                  </p>
                                  <p className="font-medium">
                                    {exp.startDate || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-500">
                                    End Date
                                  </p>
                                  <p className="font-medium">
                                    {exp.endDate || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-500">
                                    Description
                                  </p>
                                  <p className="font-medium">
                                    {exp.description || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-gray-500">No work experience</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "address" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="p-4 border-b border-gray-100">
                        <h4 className="text-base font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Permanent Address
                        </h4>
                      </div>
                      <div className="p-4">
                        <p>
                          {data.applicationData?.permanentAddress
                            ? `${data.applicationData.permanentAddress.street}, ${data.applicationData.permanentAddress.city}, ${data.applicationData.permanentAddress.state}, ${data.applicationData.permanentAddress.pincode}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="p-4 border-b border-gray-100">
                        <h4 className="text-base font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Current Address
                        </h4>
                      </div>
                      <div className="p-4">
                        <p>
                          {data.applicationData?.currentAddress
                            ? `${data.applicationData.currentAddress.street}, ${data.applicationData.currentAddress.city}, ${data.applicationData.currentAddress.state}, ${data.applicationData.currentAddress.pincode}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-md ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
