import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../Components/Navbar";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUserAuthenticated, setShowUserLogin } = useContext(AppContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env?.VITE_API_URL;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/jobs/${id}`);
        if (response.data.success) {
          setJob(response.data.job);
        } else {
          toast.error("Job not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Something went wrong!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, navigate]);

  const handleApplyClick = () => {
    if (!isUserAuthenticated) {
      toast.error("Please login to apply for this job");
      setShowUserLogin(true);
      return;
    }
    navigate(`/apply-job/${id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10 text-gray-600">Job not found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Company Info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={job.companyId.email === "info@justjobs.com" ? job.logo : job.companyId.image}
              alt={job.companyDetails.name}
              onError={(e) => {
                e.target.src = "https://cdn.iconscout.com/icon/premium/png-256-thumb/building-icon-svg-download-png-1208046.png?f=webp&w=128";
              }}
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
              <p className="text-gray-600">{job.companyDetails.name}</p>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <DetailCard label="Location" value={job.location} />
            <DetailCard
              label="Experience Required"
              value={`${job.experience} Year(s)`}
            />
            {/* Experience update in Year */}
            <DetailCard label="Job Level" value={job.level} />
            <DetailCard label="Category" value={job.category} />
          </div>

          {/* Job Description */}
          <Section title="Job Description" html={job.description} />

          {/* Benefits */}
          {job.benefits && <Section title="Benefits" html={job.benefits} />}

          {/* Apply Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleApplyClick}
              className="bg-[#432215] text-white px-8 py-3 rounded-md font-medium shadow-md hover:bg-[#DCA972] transition text-lg"
            >
              {isUserAuthenticated ? "Apply Now" : "Login to Apply"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Reusable Detail Card Component
const DetailCard = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-semibold text-gray-700">{label}</h3>
    <p className="text-gray-600">{value}</p>
  </div>
);

// Reusable Section Component
const Section = ({ title, html }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </div>
);

export default JobDetails;
