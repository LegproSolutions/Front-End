import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "../../utils/axiosConfig";
import { exportToCSV } from "../../utils/csvExport";

// Presentational components extracted for readability
import ApplicantsModal from "./JobManagementComponents/ApplicantsModal";
import EditJobModal from "./JobManagementComponents/EditJobModal";
import JobCard from "./JobManagementComponents/JobCard";
import JobFilters from "./JobManagementComponents/JobFilters";
import UserProfileModal from "./JobManagementComponents/UserProfileModal";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

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
    title: "",
    description: "",
    location: "",
    category: "",
    level: "",
    experience: 0,
    requirements: "",
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
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      category: job.category || "",
      level: job.level || "",
      experience: job.experience || 0,
      requirements: Array.isArray(job.requirements)
        ? job.requirements.join(", ")
        : job.requirements || "",
      employmentType: job.employmentType || "",
      salary: job.salary || 0,
      openings: job.openings || 1,
      deadline: job.deadline
        ? new Date(job.deadline).toISOString().split("T")[0]
        : "",
      visible: job.visible || false,
      // Prefill company-related fields if available on the job
      companyId: job.companyId?._id || job.companyId || "",
      companyCity: job.companyDetails?.city || "",
      companyState: job.companyDetails?.state || "",
      companyCountry: job.companyDetails?.country || "",
    });
    setEditModal({ open: true, job: job });
  };

  const closeEdit = () => {
    setEditModal({ open: false, job: null });
  };

  const submitEdit = async () => {
    if (!editModal.job) return;
    try {
      const payload = {
        ...editForm,
        salary: Number(editForm.salary) || 0,
        openings: Number(editForm.openings) || 1,
        experience: Number(editForm.experience) || 0,
        requirements:
          typeof editForm.requirements === "string"
            ? editForm.requirements
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : editForm.requirements,
      };
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
          <JobFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterLocation={filterLocation}
            setFilterLocation={setFilterLocation}
            exportJobsCSV={exportJobsCSV}
          />

          {/* Jobs Grid (presentational JobCard component handles rendering/actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                formatSalary={formatSalary}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                onViewApplications={handleViewApplications}
                onEdit={startEdit}
                onDelete={handleDeleteJob}
              />
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

      {/* Edit Job Modal (moved to presentational component) */}
      {editModal.open && (
        <EditJobModal
          editModal={editModal}
          editForm={editForm}
          setEditForm={setEditForm}
          closeEdit={closeEdit}
          submitEdit={submitEdit}
        />
      )}

      {/* Applicants Modal (moved to presentational component) */}
      {applicantsModal.open && (
        <ApplicantsModal
          open={applicantsModal.open}
          applicantsModal={applicantsModal}
          loadingApplicants={loadingApplicants}
          closeApplicantsModal={closeApplicantsModal}
          handleViewUserProfile={handleViewUserProfile}
          exportApplicantsCSV={exportApplicantsCSV}
          getApplicationStatusBadge={getApplicationStatusBadge}
        />
      )}

      {/* User Profile Detail Modal (moved to presentational component) */}
      {userProfileModal.open && (
        <UserProfileModal
          open={userProfileModal.open}
          userProfileModal={userProfileModal}
          loadingUserProfile={loadingUserProfile}
          closeUserProfileModal={closeUserProfileModal}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          handleUpdateStatus={handleUpdateStatus}
          updateStatusLoading={updateStatusLoading}
          getApplicationStatusBadge={getApplicationStatusBadge}
        />
      )}
    </div>
  );
};

export default JobManagement;
