import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import Navbar from "./AdminNavbar";
import DetailsNavbarPage from "./DetailsNavbarPage";
import SafeHtml from "../../utils/SafeHtml";

const backendUrl = import.meta.env?.VITE_API_URL;

const JobDetailsPage = () => {
  const { jobId } = useParams(); // from /admin/job-details/:jobId
  const [job, setJob] = useState(null);
  const [showObjectionModal, setShowObjectionModal] = useState(false); // State for modal visibility
  const [objectionMessage, setObjectionMessage] = useState(""); // State for objection message
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/jobs/${jobId}`, { withCredentials: true });
        if (res.data?.success && res.data.job) {
          setJob(res.data.job);
        } else {
          toast.error("Job not found.");
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load job details");
      }
    };
    if (jobId) fetchJob();
  }, [jobId, navigate]);

  // Verify flow not available (no endpoint). If needed, implement later.

  const handleSubmitObjection = async () => {
    if (!objectionMessage.trim()) {
      toast.error("Objection message cannot be empty.");
      return;
    }

    try {
      const res = await axios.put(
        `${backendUrl}/api/admin/job-objection/${jobId}`, // New endpoint for raising objection
        { message: objectionMessage },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Objection raised successfully!");
        // Optionally update the job state to reflect the new objection
        setJob(prevJob => ({
          ...prevJob,
          objections: [...(prevJob.objections || []), { message: objectionMessage, timestamp: new Date().toISOString() }],
          objectionsTrack: [...(prevJob.objectionsTrack || []), { message: objectionMessage, timestamp: new Date().toISOString() }]
        }));
        setObjectionMessage(""); // Clear message input
        setShowObjectionModal(false); // Close the modal
      } else {
        toast.error(res.data.message || "Failed to raise objection.");
      }
    } catch (error) {
      console.error("Error raising objection:", error);
      toast.error(error.response?.data?.message || "Something went wrong while raising objection.");
    }
  };

  if (!job) return <div className="text-center mt-10 text-white">Loading job details...</div>;

  return (
    <>
      <DetailsNavbarPage />
      <div className="max-w-4xl mx-auto p-4 mt-16">
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">

          {/* Job Header */}
          <div className="flex items-center gap-4">
            <img
              src={job?.companyId?.image || "https://placehold.co/64x64/cccccc/333333?text=Logo"}
              alt={job?.companyId?.name}
              className="w-16 h-16 object-contain rounded-md border"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{job?.title}</h1>
              <p className="text-sm text-gray-500">{job?.companyId?.name}</p>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Job Description</h2>
            <SafeHtml html={job.description} className="text-base text-gray-700 leading-relaxed" />
          </div>

          {/* Job Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Level:</strong> {job.level}</p>
              <p><strong>Salary:</strong> ₹{job.salary}</p>
              <p><strong>Openings:</strong> {job.openings}</p>
              <p><strong>Experience:</strong> {job.experience} months</p>
              <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
              <p><strong>Category:</strong> {job.category}</p>
            </div>
          </div>

          {/* Company Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Company Details</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Name:</strong> {job.companyDetails?.name}</p>
              <p><strong>Short Description:</strong> {job.companyDetails?.shortDescription}</p>
              <p><strong>Location:</strong> {job.companyDetails?.city}, {job.companyDetails?.state}, {job.companyDetails?.country}</p>
              <p><strong>HR Name:</strong> {job.companyDetails?.hrName}</p>
              <p><strong>HR Email:</strong> {job.companyDetails?.hrEmail}</p>
              <p><strong>HR Phone:</strong> {job.companyDetails?.hrPhone}</p>
            </div>
          </div>

          {/* Objections Section (New) */}
          {/* {job.objectionsTrack && job.objectionsTrack.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Objections Raised</h2>
              <div className="space-y-2">
                {job.objectionsTrack.map((obj, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md">
                    <p className="text-sm">{obj.message}</p>
                    <p className="text-xs text-red-600 mt-1">
                      <span className="font-semibold">Raised On:</span> {new Date(obj.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )} */}
          {job.objectionsTrack && job.objectionsTrack.length > 0 ? ( // Ensure job.objections exists and has items
  job.objectionsTrack.map((obj, index) => (
    <div key={index} className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md relative mb-3">
      <p className="text-sm">
        <span className="font-semibold">Objection:</span> {obj.message}
      </p>
      <p className="text-xs text-red-600 mt-1">
        <span className="font-semibold">Raised On:</span> {new Date(obj.timestamp).toLocaleString()}
      </p>
      {/* Badge to show if the job has been edited */}
      {obj.isEditedTrack && ( // Check the top-level 'job.isEdited' property
        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          Job Edited
        </span>
      )}
    </div>
  ))
) : (
  <p className="text-gray-500 italic">No objections recorded for this job.</p>
)}


          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => setShowObjectionModal(true)}
              className="bg-red-600 hover:bg-red-700 transition text-white font-medium py-2 px-6 rounded-lg shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Raise Objection
            </button>
          </div>

        </div>
      </div>

      {/* Objection Modal */}
      {showObjectionModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Raise an Objection</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
              rows="5"
              placeholder="Enter your objection message here..."
              value={objectionMessage}
              onChange={(e) => setObjectionMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowObjectionModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitObjection}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Submit Objection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobDetailsPage;
