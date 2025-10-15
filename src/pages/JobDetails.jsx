import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Users, 
  Award, 
  Clock, 
  ChevronLeft,
  ArrowRight,
  LogIn,
  FileText,
  Gift,
  DollarSign,
  Share2,
  Building,
  Layers
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

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
  }, [id, navigate, backendUrl]);

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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#0F3B7A] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading job details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
            <p className="text-gray-600">The job you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Format date for displaying posted date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-[#0F3B7A] hover:text-[#1D5AB9] transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Jobs
          </button>
          
          {/* Header Section */}
          <Card className="overflow-hidden border-none shadow-lg mb-8">
            {/* Top color bar */}
            <div className="h-2 bg-legpro-primary"></div>
            
            <CardContent className="p-0">
              {/* Header content */}
              <div className="bg-legpro-primary p-8 text-white">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="bg-white p-4 rounded-xl shadow-lg flex-shrink-0 w-24 h-24 flex items-center justify-center">
                    <img
                      src={job.companyId.image}
                      alt={job.companyDetails.name}
                      onError={(e) => {
                        e.target.src = "https://cdn.iconscout.com/icon/premium/png-256-thumb/building-icon-svg-download-png-1208046.png?f=webp&w=128";
                      }}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center gap-2 mb-4">
                      <Building className="w-4 h-4" />
                      <p className="text-lg text-white/90">{job.companyDetails.name}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-none text-white backdrop-blur-sm px-4 py-2 rounded-full">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </Badge>
                      
                      <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-none text-white backdrop-blur-sm px-4 py-2 rounded-full">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.level}
                      </Badge>
                      
                      <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-none text-white backdrop-blur-sm px-4 py-2 rounded-full">
                        <Layers className="w-4 h-4 mr-1" />
                        {job.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                <StatCard 
                  icon={<Award />}
                  label="Experience" 
                  value={`${job.experience} ${job.experience === 1 ? 'Year' : 'Years'}`} 
                />
                
                <StatCard 
                  icon={<Calendar />}
                  label="Posted Date" 
                  value={formatDate(job.createdAt)} 
                />
                
                <StatCard 
                  icon={<Clock />}
                  label="Job Type" 
                  value={job.type || "Full Time"} 
                />
                
                <StatCard 
                  icon={<Users />}
                  label="Applicants" 
                  value={job.applicationCount || "Be First"} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#0F3B7A]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Job Description</h2>
                  </div>
                  
                  <div
                    className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </CardContent>
              </Card>

              {/* Benefits */}
              {job.benefits && (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Gift className="w-5 h-5 text-[#0F3B7A]" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Benefits & Perks</h2>
                    </div>
                    
                    <div
                      className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.benefits }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Company Overview */}
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Building className="w-5 h-5 text-[#0F3B7A]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">About the Company</h2>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                      <img
                        src={job.companyId.image}
                        alt={job.companyDetails.name}
                        onError={(e) => {
                          e.target.src = "https://cdn.iconscout.com/icon/premium/png-256-thumb/building-icon-svg-download-png-1208046.png?f=webp&w=128";
                        }}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{job.companyDetails.name}</h3>
                      <p className="text-gray-500">{job.location}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700">
                    {job.companyDetails.description || 
                      `${job.companyDetails.name} is a leading company in the ${job.category} industry, offering great opportunities for career growth and professional development.`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Apply Button Card */}
              <Card className="border-none shadow-lg overflow-hidden sticky top-4">
                <div className="h-2 bg-legpro-primary"></div>
                <CardContent className="p-6">
                  <button
                    onClick={handleApplyClick}
                    className="w-full bg-legpro-primary text-white px-6 py-4 rounded-md font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
                  >
                    {isUserAuthenticated ? (
                      <>
                        Apply Now
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Login to Apply
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#0F3B7A]" />
                      Application Deadline
                    </h3>
                    <p className="text-gray-600">
                      {job.deadline ? formatDate(job.deadline) : "Open until filled"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Job Overview Card */}
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="h-2 bg-legpro-primary"></div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#0F3B7A]" />
                    Job Overview
                  </h3>
                  
                  <div className="space-y-4">
                    <InfoItem icon={<MapPin className="w-4 h-4 text-gray-500" />} label="Location" value={job.location} />
                    <InfoItem icon={<Layers className="w-4 h-4 text-gray-500" />} label="Category" value={job.category} />
                    <InfoItem icon={<Award className="w-4 h-4 text-gray-500" />} label="Experience" value={`${job.experience} Year(s)`} />
                    <InfoItem icon={<Briefcase className="w-4 h-4 text-gray-500" />} label="Job Level" value={job.level} />
                    {job.salary && (
                      <InfoItem icon={<DollarSign className="w-4 h-4 text-gray-500" />} label="Salary" value={job.salary} />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Share Job Card */}
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="h-2 bg-legpro-primary"></div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-[#0F3B7A]" />
                    Share this job
                  </h3>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#1877F2] hover:bg-[#1865D3] text-white px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    
                    <button className="flex-1 bg-[#1DA1F2] hover:bg-[#0d8bd7] text-white px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    
                    <button className="flex-1 bg-[#0077B5] hover:bg-[#006699] text-white px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Similar Jobs Teaser */}
              <Card className="border-none shadow-lg overflow-hidden bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#0F3B7A] mb-3">Looking for similar jobs?</h3>
                  <p className="text-gray-700 mb-4">
                    Explore more opportunities in {job.category} that match your skills and experience.
                  </p>
                  <button 
                    onClick={() => navigate(`/jobs?category=${encodeURIComponent(job.category)}`)}
                    className="text-[#0F3B7A] font-medium flex items-center hover:text-[#1D5AB9] transition-colors"
                  >
                    Browse similar jobs
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value }) => (
  <div className="p-6 text-center">
    <div className="flex justify-center mb-3 text-[#0F3B7A]">
      {icon}
    </div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-lg font-bold text-gray-800">{value}</p>
  </div>
);

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center">
      {icon}
      <span className="text-gray-600 ml-2">{label}</span>
    </div>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);

export default JobDetails;