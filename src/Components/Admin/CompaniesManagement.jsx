import {
  Building2,
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  Search,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "../../utils/axiosConfig";
import { exportToCSV } from "../../utils/csvExport";

const backendUrl = import.meta.env?.VITE_API_URL;

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const companiesPerPage = 12;

  // Fetch all companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/admin/companies`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setCompanies(response.data.companies);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on search
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.city && company.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (company.state && company.state.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const startIndex = (currentPage - 1) * companiesPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + companiesPerPage);

  const handleViewJobs = (companyId) => {
    // Navigate to company jobs page (route exists as /admin/recruiter-jobs/:companyId)
    window.open(`/admin/recruiter-jobs/${companyId}`, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getCompanyInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const exportCompaniesCSV = () => {
    const rows = filteredCompanies.map((c) => ({
      Name: c.name || "",
      Email: c.email || "",
      Phone: c.phone || "",
      City: c.city || "",
      State: c.state || "",
      Website: c.website || "",
      Verified: c.isVerified ? "Yes" : "No",
      Premium: c.havePremiumAccess ? "Yes" : "No",
      Joined: formatDate(c.date || c.createdAt),
    }));
    exportToCSV({ data: rows, filename: "companies" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legpro-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-legpro-primary flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Companies Management
          </CardTitle>
          <p className="text-gray-600">
            Manage all companies in the platform. Total: {companies.length} companies
          </p>
        </CardHeader>
        <CardContent>
          {/* Search + Export */}
          <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="md:ml-auto">
              <Button variant="outline" onClick={exportCompaniesCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Download CSV
              </Button>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCompanies.map((company) => (
              <Card key={company._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {/* Company Avatar */}
                    <div className="w-12 h-12 bg-legpro-primary text-white rounded-lg flex items-center justify-center font-semibold">
                      {company.image ? (
                        <img 
                          src={company.image} 
                          alt={company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        getCompanyInitials(company.name)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Badge variant={company.isVerified ? "default" : "secondary"}>
                          {company.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{company.email}</span>
                      </div>
                      
                      {company.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{company.phone}</span>
                        </div>
                      )}
                      
                      {(company.city || company.state) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {[company.city, company.state].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {company.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4 flex-shrink-0" />
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-legpro-primary hover:underline truncate"
                          >
                            {company.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    {company.description && (
                      <div className="text-sm text-gray-600">
                        <p className="line-clamp-2">{company.description}</p>
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {formatDate(company.date || company.createdAt)}</span>
                      </div>
                      {company.havePremiumAccess && (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">Premium</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No companies found */}
          {filteredCompanies.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "No companies have been registered yet"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesManagement;