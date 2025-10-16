import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../utils/axiosConfig";

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
  const [editForm, setEditForm] = useState({
    employmentType: "",
    salary: 0,
    openings: 1,
    deadline: "",
    visible: false,
  });

  const navigate = useNavigate();
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

  // --- FILTERING & PAGINATION ---
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        (job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyId?.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        job.category?.toLowerCase().includes(filterCategory.toLowerCase()) &&
        job.location?.toLowerCase().includes(filterLocation.toLowerCase())
    );
  }, [jobs, searchQuery, filterCategory, filterLocation]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobs, currentPage, jobsPerPage]);

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
  
  const handleViewApplications = (jobId) => {
    navigate(`/admin/job-applicants/${jobId}`);
  };

  const startEdit = (job) => {
    setEditForm({
      employmentType: job.employmentType || "",
      salary: job.salary || 0,
      openings: job.openings || 1,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "",
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
      const resp = await axios.put(`${backendUrl}/api/admin/jobs/${editModal.job._id}`, payload, { withCredentials: true });
      if (resp.data.success) {
        toast.success("Job updated successfully");
        setJobs(prev => prev.map(j => j._id === editModal.job._id ? resp.data.job : j));
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
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getStatusBadge = (job) => {
    const now = new Date();
    const deadline = new Date(job.deadline);
    if (job.deadline && deadline < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (job.visible) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>;
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
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paginatedJobs.map((job) => (
              <Card key={job._id} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span>{job.companyId?.name || 'Unknown Company'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">{getStatusBadge(job)}</div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /><span>{job.location}</span></div>
                        <div className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4" /><span>{formatSalary(job.salary)}/month</span></div>
                        <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /><span>{job.experience}+ years</span></div>
                        <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /><span>{job.openings} openings</span></div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="outline">{job.category}</Badge>
                      <Badge variant="outline" className="capitalize">{job.employmentType}</Badge>
                    </div>
                    <div className="text-sm text-gray-500 pt-1 space-y-1">
                        {job.deadline && <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /><span>Deadline: {formatDate(job.deadline)}</span></div>}
                        <div>Posted: {formatDate(job.date || job.createdAt)}</div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t mt-3">
                      <Button size="sm" variant="outline" onClick={() => handleViewApplications(job._id)} className="flex items-center gap-1"><Eye className="h-4 w-4" />Applications</Button>
                      <Button size="sm" variant="outline" onClick={() => startEdit(job)} className="flex items-center gap-1"><Edit className="h-4 w-4" />Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteJob(job._id)} className="flex items-center gap-1"><Trash2 className="h-4 w-4" />Delete</Button>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No jobs found */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-10">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">
                {searchQuery || filterCategory || filterLocation ? "Try adjusting your search or filters." : "No jobs have been created yet."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
              <span className="px-4 text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Job Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Job Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-legpro-primary focus:border-legpro-primary" value={editForm.employmentType} onChange={(e) => setEditForm((f) => ({ ...f, employmentType: e.target.value }))}>
                    <option value="">Select Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹/month)</label>
                  <input type="number" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-legpro-primary focus:border-legpro-primary" value={editForm.salary} onChange={(e) => setEditForm((f) => ({ ...f, salary: e.target.value }))} min={0} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Openings</label>
                  <input type="number" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-legpro-primary focus:border-legpro-primary" value={editForm.openings} onChange={(e) => setEditForm((f) => ({ ...f, openings: e.target.value }))} min={1}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input type="date" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-legpro-primary focus:border-legpro-primary" value={editForm.deadline} onChange={(e) => setEditForm((f) => ({ ...f, deadline: e.target.value }))} />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input id="visible" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-legpro-primary focus:ring-legpro-primary" checked={!!editForm.visible} onChange={(e) => setEditForm((f) => ({ ...f, visible: e.target.checked }))}/>
                <label htmlFor="visible" className="text-sm font-medium text-gray-700">Make job listing visible</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={closeEdit}>Cancel</Button>
              <Button onClick={submitEdit} className="bg-legpro-primary hover:bg-legpro-primary-hover">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;