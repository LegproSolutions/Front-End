import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  IndianRupee,
  Clock,
  Users,
  Building2,
  Calendar,
  X,
  Mail,
  Phone,
  User,
  FileText,
  Download,
  Award,
  Briefcase,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../utils/axiosConfig";
import { exportToCSV } from "../../utils/csvExport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const backendUrl = import.meta.env?.VITE_API_URL;

const JobManagement = () => {
  // --- STATE MANAGEMENT ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [editModal, setEditModal] = useState({ open: false, job: null });
  const [applicantsModal, setApplicantsModal] = useState({
    open: false,
    job: null,
    applicants: [],
  });
  const [userProfileModal, setUserProfileModal] = useState({
    open: false,
    user: null,
    application: null,
  });
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [loadingUserProfile, setLoadingUserProfile] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    userProfileModal.application
      ? userProfileModal.application.status?.toLowerCase()
      : "pending"
  );
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    employmentType: "",
    salary: 0,
    openings: 1,
    deadline: "",
    visible: false,
  });

  const jobsPerPage = 10;

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/jobs/`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error(error.response?.data?.message || "Could not fetch jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (editModal.open || applicantsModal.open || userProfileModal.open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editModal.open, applicantsModal.open, userProfileModal.open]);

  // --- FILTERING & PAGINATION ---
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        (job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyId?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        job.category?.toLowerCase().includes(filterCategory.toLowerCase()) &&
        job.location?.toLowerCase().includes(filterLocation.toLowerCase())
    );
  }, [jobs, searchQuery, filterCategory, filterLocation]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobs, currentPage, jobsPerPage]);

  // --- CSV EXPORT HELPERS ---
  const exportJobsCSV = () => {
    const now = new Date();
    const rows = filteredJobs.map((job) => {
      const deadline = job.deadline ? new Date(job.deadline) : null;
      let status = job.visible ? "Active" : "Inactive";
      if (deadline && deadline < now) status = "Expired";
      return {
        Title: job.title || "",
        Company: job.companyId?.name || "",
        Location: job.location || "",
        Category: job.category || "",
        "Employment Type": job.employmentType || "",
        Salary: job.salary || "",
        Openings: job.openings || "",
        Experience: job.experience || "",
        Deadline: job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN") : "",
        Visible: job.visible ? "Yes" : "No",
        Status: status,
        "Posted On": new Date(job.date || job.createdAt || Date.now()).toLocaleDateString("en-IN"),
      };
    });
    exportToCSV({ data: rows, filename: "jobs" });
  };

  const exportApplicantsCSV = () => {
    const rows = (applicantsModal.applicants || []).map((application) => {
      const applicant = application.userId || application;
      return {
        Name: applicant.name || applicant.firstName || "",
        Email: applicant.email || "",
        Phone: applicant.phone || "",
        Status: (application.status || "").toString(),
        "Applied On": new Date(
          application.appliedAt || application.createdAt || Date.now()
        ).toLocaleString("en-IN"),
        "Resume URL": applicant.resume || applicant.resumeUrl || "",
      };
    });
    exportToCSV({ data: rows, filename: `applications_${applicantsModal.job?.title || "job"}` });
  };

  // --- EVENT HANDLERS ---
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const resp = await axios.delete(`${backendUrl}/api/admin/jobs/${jobId}`, {
        withCredentials: true,
      });
      if (resp.data.success) {
        toast.success("Job deleted successfully");
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      } else {
        toast.error(resp.data.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Delete job error:", error);
      toast.error(error.response?.data?.message || "Deletion failed");
    }
  };

  const handleViewApplications = async (job) => {
    setLoadingApplicants(true);
    setApplicantsModal({ open: true, job: job, applicants: [] });

    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/job-applicants/${job._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setApplicantsModal((prev) => ({
          ...prev,
          applicants: response.data.applications || [],
        }));
      } else {
        toast.error(response.data.message || "Failed to fetch applicants");
      }
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
      toast.error(
        error.response?.data?.message || "Could not fetch applicants."
      );
    } finally {
      setLoadingApplicants(false);
    }
  };

  const closeApplicantsModal = () => {
    setApplicantsModal({ open: false, job: null, applicants: [] });
  };

  const handleViewUserProfile = async (userId, application = null) => {
    setLoadingUserProfile(true);
    setUserProfileModal({ open: true, user: null, application: null });

    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/user-profile/${userId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUserProfileModal((prev) => ({
          ...prev,
          user: response.data.profile || response.data.user,
          application: application,
        }));
        setSelectedStatus(
          application ? application.status?.toLowerCase() : "pending"
        );
      } else {
        toast.error(response.data.message || "Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error(
        error.response?.data?.message || "Could not fetch user profile."
      );
    } finally {
      setLoadingUserProfile(false);
    }
  };

  const closeUserProfileModal = () => {
    setUserProfileModal({ open: false, user: null, application: null });
  };

  // --- APPLICATION STATUS MANAGEMENT ---
  const handleUpdateStatus = async (
    applicationId,
    applicantName,
    newStatus
  ) => {
    if (updateStatusLoading) return;
    try {
      setUpdateStatusLoading(true);

      const response = await axios.put(
        `${backendUrl}/api/admin/applications/${applicationId}/status`,
        {
          status: newStatus,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the applicants list in the modal
        setApplicantsModal((prev) => ({
          ...prev,
          applicants: prev.applicants.map((applicant) => {
            const id = applicant._id || applicant.applicationId;
            return id === applicationId
              ? { ...applicant, status: newStatus }
              : applicant;
          }),
        }));

        // Update the user profile modal if it's open for this application
        if (
          userProfileModal.application &&
          (userProfileModal.application._id === applicationId ||
            userProfileModal.application.applicationId === applicationId)
        ) {
          setUserProfileModal((prev) => ({
            ...prev,
            application: { ...prev.application, status: newStatus },
          }));
        }

        toast.success(
          `Application from ${applicantName} has been updated successfully!`
        );
      } else {
        toast.error(response.data.message || "Failed to update application");
      }
    } catch (error) {
      console.error("Error accepting application:", error);
      toast.error(
        `Failed to accept application from ${applicantName}. Please try again.`
      );
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const getApplicationStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Accepted
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "under_review":
        return <Badge variant="warning">Under Review</Badge>;
      case "interviewed":
        return <Badge variant="primary">Interviewed</Badge>;
      case "onboarded":
        return <Badge variant="primary">Onboarded</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const startEdit = (job) => {
    setEditForm({
      employmentType: job.employmentType || "",
      salary: job.salary || 0,
      openings: job.openings || 1,
      deadline: job.deadline
        ? new Date(job.deadline).toISOString().split("T")[0]
        : "",
      visible: job.visible || false,
    });
    setEditModal({ open: true, job: job });
  };

  const closeEdit = () => {
    setEditModal({ open: false, job: null });
  };

  const submitEdit = async () => {
    if (!editModal.job) return;
    try {
      const payload = { ...editForm };
      const resp = await axios.put(
        `${backendUrl}/api/admin/jobs/${editModal.job._id}`,
        payload,
        { withCredentials: true }
      );
      if (resp.data.success) {
        toast.success("Job updated successfully");
        setJobs((prev) =>
          prev.map((j) => (j._id === editModal.job._id ? resp.data.job : j))
        );
        closeEdit();
      } else {
        toast.error(resp.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update job error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // --- HELPER FUNCTIONS ---
  const formatSalary = (salary) => {
    if (!salary) return "N/A";
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L`;
    }
    return `₹${Math.round(salary / 1000)}K`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (job) => {
    const now = new Date();
    const deadline = new Date(job.deadline);
    if (job.deadline && deadline < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (job.visible) {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Active
        </Badge>
      );
    }
    return <Badge variant="secondary">Inactive</Badge>;
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legpro-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-legpro-primary flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Job Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters + Export */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Filter by category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-40"
              />
              <Input
                placeholder="Filter by location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full md:w-40"
              />
            </div>
            <div className="md:ml-auto">
              <Button variant="outline" onClick={exportJobsCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paginatedJobs.map((job) => (
              <Card
                key={job._id}
                className="border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span>{job.companyId?.name || "Unknown Company"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(job)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="h-4 w-4" />
                      <span>{formatSalary(job.salary)}/month</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{job.experience}+ years</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{job.openings} openings</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="outline">{job.category}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {job.employmentType}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 pt-1 space-y-1">
                    {job.deadline && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {formatDate(job.deadline)}</span>
                      </div>
                    )}
                    <div>Posted: {formatDate(job.date || job.createdAt)}</div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewApplications(job)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Applications
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(job)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteJob(job._id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No jobs found */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-10">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500">
                {searchQuery || filterCategory || filterLocation
                  ? "Try adjusting your search or filters."
                  : "No jobs have been created yet."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Job Modal */}
      {editModal.open && (
        <div className="fixed inset-0 -top-6 h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Job Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-legpro-primary focus:border-legpro-primary"
                    value={editForm.employmentType}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        employmentType: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary (₹/month)
                  </label>
                  <input
                    type="number"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-legpro-primary focus:border-legpro-primary"
                    value={editForm.salary}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, salary: e.target.value }))
                    }
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Openings
                  </label>
                  <input
                    type="number"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-legpro-primary focus:border-legpro-primary"
                    value={editForm.openings}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, openings: e.target.value }))
                    }
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-legpro-primary focus:border-legpro-primary"
                    value={editForm.deadline}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, deadline: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="visible"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-legpro-primary focus:ring-legpro-primary"
                  checked={!!editForm.visible}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, visible: e.target.checked }))
                  }
                />
                <label
                  htmlFor="visible"
                  className="text-sm font-medium text-gray-700"
                >
                  Make job listing visible
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={closeEdit}>
                Cancel
              </Button>
              <Button
                onClick={submitEdit}
                className="bg-legpro-primary hover:bg-legpro-primary-hover"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {applicantsModal.open && (
        <div className="fixed inset-0 -top-6 h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] p-6 m-4 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Job Applications
                </h3>
                <p className="text-gray-600 mt-1">
                  {applicantsModal.job?.title} at{" "}
                  {applicantsModal.job?.companyId?.name}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={closeApplicantsModal}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Export applicants */}
            {!loadingApplicants && applicantsModal.applicants?.length > 0 && (
              <div className="mb-4">
                <Button variant="outline" size="sm" onClick={exportApplicantsCSV} className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {loadingApplicants ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legpro-primary"></div>
                </div>
              ) : applicantsModal.applicants.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Applications Yet
                  </h4>
                  <p className="text-gray-500">
                    No one has applied for this position yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {applicantsModal.applicants.map((application, index) => {
                    const applicant = application.userId || application; // Handle nested structure
                    return (
                      <Card
                        key={application._id || index}
                        className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() =>
                          handleViewUserProfile(
                            applicant._id || applicant.userId,
                            application
                          )
                        }
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-legpro-primary rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-gray-900">
                                {applicant.name || "N/A"}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {applicant.email || "No email provided"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {applicant.phone || "No phone provided"}
                              </p>

                              <p className="text-xs text-legpro-primary mt-1">
                                Click to view full profile
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <Badge variant="outline" className="text-xs">
                                Applied{" "}
                                {new Date(
                                  application.appliedAt ||
                                    application.createdAt ||
                                    Date.now()
                                ).toLocaleDateString()}
                              </Badge>
                              {getApplicationStatusBadge(application.status)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm text-gray-600">
                            {applicant.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{applicant.phone}</span>
                              </div>
                            )}
                            {applicant.gender && (
                              <div className="flex items-center gap-2 mt-1">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="capitalize">
                                  {applicant.gender}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Contact and document buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `mailto:${applicant.email}`,
                                  "_blank"
                                );
                              }}
                              className="flex items-center gap-1"
                            >
                              <Mail className="h-4 w-4" />
                              Email
                            </Button>
                            {applicant.resume && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(applicant.resume, "_blank");
                                }}
                                className="flex items-center gap-1"
                              >
                                <Download className="h-4 w-4" />
                                Resume
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {applicantsModal.applicants.length} applicant
                {applicantsModal.applicants.length !== 1 ? "s" : ""} found
              </p>
              <Button variant="outline" onClick={closeApplicantsModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Detail Modal */}
      {userProfileModal.open && (
        <div className="fixed inset-0 -top-6 h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] p-6 m-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  User Profile
                </h3>
                <p className="text-gray-600 mt-1">Complete profile details</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={closeUserProfileModal}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingUserProfile ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legpro-primary"></div>
                </div>
              ) : !userProfileModal.user ? (
                <div className="text-center py-16">
                  <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Profile Not Found
                  </h4>
                  <p className="text-gray-500">
                    Could not load user profile information.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProfileModal.user.firstName && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            First Name
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.firstName}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.lastName && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Last Name
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.lastName}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.middleName && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Middle Name
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.middleName}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.email && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Email
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.email}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Phone
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.phone}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.alternatePhone && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Alternate Phone
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.alternatePhone}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.dateOfBirth && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Date of Birth
                          </label>
                          <p className="text-gray-900">
                            {new Date(
                              userProfileModal.user.dateOfBirth
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.gender && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Gender
                          </label>
                          <p className="text-gray-900 capitalize">
                            {userProfileModal.user.gender}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.maritalStatus && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Marital Status
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.maritalStatus}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.nationality && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Nationality
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.nationality}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.fatherName && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Father's Name
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.fatherName}
                          </p>
                        </div>
                      )}
                      {userProfileModal.user.aadharNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Aadhar Number
                          </label>
                          <p className="text-gray-900">
                            {userProfileModal.user.aadharNumber}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Address Information */}
                  {(userProfileModal.user.address ||
                    userProfileModal.user.permanentAddress) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <MapPin className="h-5 w-5" />
                          Address Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {userProfileModal.user.address && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              Current Address
                            </h4>
                            <p className="text-gray-900">
                              {[
                                userProfileModal.user.address.street,
                                userProfileModal.user.address.city,
                                userProfileModal.user.address.state,
                                userProfileModal.user.address.country,
                                userProfileModal.user.address.pincode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        )}
                        {userProfileModal.user.permanentAddress && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              Permanent Address
                            </h4>
                            <p className="text-gray-900">
                              {[
                                userProfileModal.user.permanentAddress.street,
                                userProfileModal.user.permanentAddress.city,
                                userProfileModal.user.permanentAddress.state,
                                userProfileModal.user.permanentAddress.country,
                                userProfileModal.user.permanentAddress.pincode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Education */}
                  {userProfileModal.user.education &&
                    Object.keys(userProfileModal.user.education).length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Award className="h-5 w-5" />
                            Education
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(
                              userProfileModal.user.education
                            ).map(([key, edu]) => (
                              <div
                                key={key}
                                className="border-l-4 border-legpro-primary pl-4"
                              >
                                <h4 className="font-medium text-gray-900">
                                  {edu.instituteType || key}
                                </h4>
                                {edu.instituteFields && (
                                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                                    {edu.instituteFields.instituteName && (
                                      <p>
                                        Institute:{" "}
                                        {edu.instituteFields.instituteName}
                                      </p>
                                    )}
                                    {edu.instituteFields.courseName && (
                                      <p>
                                        Course: {edu.instituteFields.courseName}
                                      </p>
                                    )}
                                    {edu.instituteFields.percentage && (
                                      <p>
                                        Percentage:{" "}
                                        {edu.instituteFields.percentage}%
                                      </p>
                                    )}
                                    {edu.instituteFields.passingYear && (
                                      <p>
                                        Passing Year:{" "}
                                        {edu.instituteFields.passingYear}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  {/* Experience */}
                  {userProfileModal.user.experience &&
                    userProfileModal.user.experience.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Briefcase className="h-5 w-5" />
                            Work Experience
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {userProfileModal.user.experience.map(
                              (exp, index) => (
                                <div
                                  key={index}
                                  className="border-l-4 border-legpro-primary pl-4"
                                >
                                  <h4 className="font-medium text-gray-900">
                                    {exp.position}
                                  </h4>
                                  <p className="text-gray-700">{exp.company}</p>
                                  <p className="text-sm text-gray-600">
                                    {exp.startDate &&
                                      new Date(
                                        exp.startDate
                                      ).toLocaleDateString()}{" "}
                                    -
                                    {exp.endDate
                                      ? new Date(
                                          exp.endDate
                                        ).toLocaleDateString()
                                      : "Present"}
                                  </p>
                                  {exp.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {exp.description}
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  {/* Skills & Languages */}
                  {((userProfileModal.user.skills &&
                    userProfileModal.user.skills.length > 0) ||
                    (userProfileModal.user.languages &&
                      userProfileModal.user.languages.length > 0)) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Award className="h-5 w-5" />
                          Skills & Languages
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {userProfileModal.user.skills &&
                          userProfileModal.user.skills.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {userProfileModal.user.skills.map(
                                  (skill, index) => (
                                    <Badge key={index} variant="secondary">
                                      {skill}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        {userProfileModal.user.languages &&
                          userProfileModal.user.languages.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Languages
                              </h4>
                              <div className="space-y-2">
                                {userProfileModal.user.languages.map(
                                  (lang, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center"
                                    >
                                      <span className="text-gray-900">
                                        {lang.name}
                                      </span>
                                      <Badge variant="outline">
                                        {lang.proficiency}
                                      </Badge>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Documents */}
                  {userProfileModal.user.resume?.url && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <FileText className="h-5 w-5" />
                          Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex gap-3">
                        {userProfileModal.user.resume && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                userProfileModal.user.resume.url,
                                "_blank"
                              )
                            }
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Resume
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              {/* Accept/Reject buttons - only show if application is provided and status is pending */}
              {userProfileModal.application && (
                <div className="flex gap-3 mb-4">
                  <Select
                    defaultValue={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Change Application Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">
                        Accept Application
                      </SelectItem>
                      <SelectItem value="rejected">
                        Reject Application
                      </SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                      <SelectItem value="onboarded">Onboarded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdateStatus(
                        userProfileModal.application._id,
                        userProfileModal.user.firstName,
                        selectedStatus.toLowerCase()
                      )
                    }
                  >
                    {updateStatusLoading && (
                      <Loader className="animate-spin" />
                    )}
                    Update Status
                  </Button>
                </div>
              )}

              {/* Application Status Display */}
              {userProfileModal.application &&
                userProfileModal.application.status &&
                userProfileModal.application.status.toLowerCase() !==
                  "pending" && (
                  <div className="mb-4 p-3 rounded-lg border bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        Application Status:
                      </span>
                      {getApplicationStatusBadge(
                        userProfileModal.application.status
                      )}
                    </div>
                    {userProfileModal.application.reviewedAt && (
                      <p className="text-sm text-gray-600 mt-1">
                        Reviewed on{" "}
                        {new Date(
                          userProfileModal.application.reviewedAt
                        ).toLocaleString()}
                      </p>
                    )}
                    {userProfileModal.application.rejectionReason && (
                      <p className="text-sm text-gray-600 mt-1">
                        Reason: {userProfileModal.application.rejectionReason}
                      </p>
                    )}
                  </div>
                )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={closeUserProfileModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
