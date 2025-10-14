import React, { useContext, useState } from "react";
import { FaUpload, FaFileAlt } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import moment from "moment";
import axios from "../../utils/axiosConfig";
import { Loader2 } from "lucide-react";

const Application = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [lookingForJob, setLookingForJob] = useState(false);
  const [uploading, setUploading] = useState(false);
  const backendUrl = import.meta.env?.VITE_API_URL;

  const { userData, updateUserResume, userApplications, setUserData } =
    useContext(AppContext);

  const handleResumeChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleSave = async () => {
    if (resume) {
      setUploading(true);
      const result = await updateUserResume(resume);

      if (result.success) {
        const userRes = await axios.get(`${backendUrl}/api/users/user`);

        if (userRes.data.success) {
          setUserData({ ...userRes.data.user });
          setResume(null);
        }
        setIsEdit(false);
      } else {
        console.error(result.message);
      }

      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 min-h-screen py-8">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 my-10">
          {/* Resume & Job Search Toggle Section */}
          <div className="bg-white shadow-sm rounded-2xl p-8 mb-8 border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* Resume Section */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <FaFileAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Your Resume
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Upload and manage your resume for job applications
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-6">
                  {isEdit ? (
                    <>
                      <label
                        htmlFor="resume-upload"
                        className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
                      >
                        <FaUpload className="text-base" /> Select Resume
                      </label>
                      <input
                        id="resume-upload"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleResumeChange}
                      />
                      {resume && (
                        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-lg border border-slate-200">
                          <FaFileAlt className="text-slate-600 text-sm" />
                          <p className="text-slate-700 text-sm font-medium truncate max-w-xs">
                            {resume.name}
                          </p>
                        </div>
                      )}
                      {resume && (
                        <button
                          onClick={handleSave}
                          disabled={uploading}
                          className={`bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                            uploading
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:shadow-md hover:from-emerald-700 hover:to-emerald-800"
                          }`}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="animate-spin w-4 h-4" />
                              Uploading...
                            </>
                          ) : (
                            "Save Resume"
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      {userData && userData.resume ? (
                        <a
                          href={userData.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
                        >
                          View Resume
                        </a>
                      ) : (
                        <p className="text-slate-500 bg-slate-100 px-4 py-2.5 rounded-lg border border-slate-200">
                          No resume uploaded
                        </p>
                      )}
                      <button
                        onClick={() => setIsEdit(true)}
                        className="text-slate-700 bg-white border border-slate-300 rounded-lg px-5 py-2.5 font-medium shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

             
            </div>
          </div>

          {/* Jobs Applied Section */}
          <div className="bg-white shadow-sm rounded-2xl p-8 border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">
                Application History
              </h2>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Track and monitor your job application status
            </p>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              {userApplications && userApplications.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userApplications.map((app, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.companyId?.image}
                              alt="Company Logo"
                              className="h-11 w-11 rounded-lg shadow-sm border border-slate-200 object-cover"
                            />
                            <span className="font-semibold text-slate-800">
                              {app.companyId?.name || "Unknown Company"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-700 font-medium">
                          {app.jobId?.title || "N/A"}
                        </td>
                        <td className="p-4 text-slate-600">
                          {app.jobId?.location || "N/A"}
                        </td>
                        <td className="p-4 text-slate-500 text-sm">
                          {app.jobId
                            ? moment(app.jobId.date).format("MMM DD, YYYY")
                            : "N/A"}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              app.status === "Accepted"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : app.status === "Rejected"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-amber-100 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <FaFileAlt className="text-slate-400 text-2xl" />
                  </div>
                  <p className="text-slate-600 font-medium">
                    No applications found
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    Start applying to jobs to see them here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Application;