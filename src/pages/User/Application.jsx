import moment from "moment";
import { useContext } from "react";
import { FaFileAlt } from "react-icons/fa";
import Footer from "../../Components/Footer";
import Navbar from "../../Components/Navbar";
import { AppContext } from "../../context/AppContext";

const Application = () => {
  const { userApplications } = useContext(AppContext);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 min-h-screen py-8">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 my-10">
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