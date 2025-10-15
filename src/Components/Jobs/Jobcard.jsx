import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  MapPin,
  Clock,
  IndianRupee,
  Briefcase,
  Building,
  Calendar,
  TrendingUp,
  ExternalLink,
  Bookmark,
  BookmarkPlus,
  Star,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { cn } from "../../lib/utils";

const JobCard = ({ job, viewMode = "grid" }) => {
  const navigate = useNavigate();
  const { isUserAuthenticated, setShowUserLogin } = useContext(AppContext);

  const handleApplyClick = () => {
    if (!isUserAuthenticated) {
      toast.error("Please login to apply for this job");
      setShowUserLogin(true);
      return;
    }
    navigate(`/apply-job/${job._id}`);
    window.scrollTo(0, 0);
  };

  const handleViewDetails = () => {
    navigate(`/job-details/${job._id}`);
    window.scrollTo(0, 0);
  };

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return "Salary not disclosed";
    if (typeof salary === "number") {
      if (salary >= 100000) {
        return `₹${(salary / 100000).toFixed(1)} LPA`;
      }
      return `₹${salary.toLocaleString()}`;
    }
    return salary;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "";
    const now = new Date();
    const jobDate = new Date(date);
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return jobDate.toLocaleDateString();
  };

  // Get company logo
  const getCompanyLogo = () => {
    return job.companyId?.image;
  };

  // Get company name
  const getCompanyName = () => {
    return job.companyDetails?.name || job.companyId?.name || "Company";
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-legpro-primary">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Company Logo & Basic Info */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-12 w-12 border">
                <AvatarImage 
                  src={getCompanyLogo()} 
                  alt={getCompanyName()}
                />
                <AvatarFallback>
                  <Building className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-legpro-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{getCompanyName()}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.employmentType || job.level || "Full-time"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    <span>{formatSalary(job.salary || job.salaryRange)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(job.date)}</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.category && (
                    <Badge variant="secondary" className="text-xs">
                      {job.category}
                    </Badge>
                  )}
                  {job.workMode && (
                    <Badge variant="outline" className="text-xs">
                      {job.workMode}
                    </Badge>
                  )}
                  {job.experience && (
                    <Badge variant="outline" className="text-xs">
                      {job.experience}
                    </Badge>
                  )}
                </div>
                
                {/* Description preview */}
                {job.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {job.description.replace(/<[^>]*>/g, '').slice(0, 150)}...
                  </p>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-2 md:w-48">
              <Button 
                onClick={handleApplyClick}
                className="bg-legpro-primary hover:bg-legpro-primary/90"
              >
                Apply Now
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewDetails}
                className="text-legpro-primary border-legpro-primary hover:bg-legpro-primary hover:text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarImage 
                src={getCompanyLogo()} 
                alt={getCompanyName()}
              />
              <AvatarFallback>
                <Building className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-legpro-primary transition-colors line-clamp-2">
                {job.title}
              </h3>
              <p className="text-gray-600 font-medium mt-1">{getCompanyName()}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Job Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{job.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <Briefcase className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{job.employmentType || job.level || "Full-time"}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <IndianRupee className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium text-legpro-primary">
                {formatSalary(job.salary || job.salaryRange)}
              </span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {job.category && (
              <Badge variant="secondary" className="text-xs">
                {job.category}
              </Badge>
            )}
            {job.workMode && (
              <Badge variant="outline" className="text-xs">
                {job.workMode}
              </Badge>
            )}
            {job.experience && (
              <Badge variant="outline" className="text-xs">
                {job.experience}
              </Badge>
            )}
          </div>
          
          {/* Description */}
          {job.description && (
            <p className="text-gray-600 text-sm line-clamp-3">
              {job.description.replace(/<[^>]*>/g, '').slice(0, 120)}...
            </p>
          )}
          
          {/* Posted Date */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Posted {formatDate(job.date)}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleApplyClick}
              className="flex-1 bg-legpro-primary hover:bg-legpro-primary/90"
              size="sm"
            >
              Apply Now
            </Button>
            <Button 
              variant="outline" 
              onClick={handleViewDetails}
              className="text-legpro-primary border-legpro-primary hover:bg-legpro-primary hover:text-white"
              size="sm"
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;