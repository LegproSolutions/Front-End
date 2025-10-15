import React, { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import { JobLocations, assets } from "../../assets/assets";
import Jobcard from "./Jobcard";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import SkeletonJobCard from "./SkeletonJobCard";

const JobListing = () => {
  const {
    searchFilter,
    setSearchFilter,
    homeJobs,
    isJobsLoading,
    jobsPagination,
    fetchHomeJobs,
  } = useContext(AppContext);

  // Filter states
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState("");
  
  // View mode state
  const [viewMode, setViewMode] = useState("grid");

  // Get unique categories from current jobs
  const JobCategories = [...new Set(homeJobs.map((job) => job.category))];

  // Build filters object for API
  const buildFilters = useCallback(() => {
    const filters = {};

    if (searchFilter.title) filters.title = searchFilter.title;
    if (searchFilter.location) filters.location = searchFilter.location;
    if (selectedCategories.length > 0) filters.category = selectedCategories[0];
    if (selectedLocations.length > 0) filters.states = selectedLocations;

    if (selectedSalary) {
      switch (selectedSalary) {
        case "0-3 LPA":
          filters.salaryMin = 0;
          filters.salaryMax = 299999;
          break;
        case "3-6 LPA":
          filters.salaryMin = 300000;
          filters.salaryMax = 599999;
          break;
        case "6-10 LPA":
          filters.salaryMin = 600000;
          filters.salaryMax = 1000000;
          break;
        case "10+ LPA":
          filters.salaryMin = 1000001;
          break;
      }
    }

    return filters;
  }, [
    searchFilter,
    selectedCategories,
    selectedLocations,
    selectedSalary,
  ]);

  // Fetch jobs when filters change
  useEffect(() => {
    const filters = buildFilters();
    fetchHomeJobs(filters, 1, 9);
  }, [buildFilters, fetchHomeJobs]);

  // Handle pagination
  const changePage = (page) => {
    if (page >= 1 && page <= jobsPagination.totalPages) {
      const filters = buildFilters();
      fetchHomeJobs(filters, page, 9);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSearchFilter({ title: "", location: "" });
    setSelectedSalary("");
    fetchHomeJobs({}, 1, 9);
  };

  // Toggle filter functions
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  // Check if any filters are active
  const hasActiveFilters = 
    searchFilter.title ||
    searchFilter.location ||
    selectedCategories.length > 0 ||
    selectedLocations.length > 0 ||
    selectedSalary;

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {/* Filter Summary Bar */}
        {hasActiveFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2 text-gray-700">
                  <SlidersHorizontal size={18} className="text-legpro-primary" />
                  <h3 className="font-semibold text-sm">Active Filters</h3>
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap gap-2">
                  {searchFilter.title && (
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200 transition-all hover:shadow-md">
                      <Search size={14} />
                      {searchFilter.title}
                      <button
                        onClick={() =>
                          setSearchFilter((prev) => ({ ...prev, title: "" }))
                        }
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}

                  {searchFilter.location && (
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-emerald-200 transition-all hover:shadow-md">
                      <MapPin size={14} />
                      {searchFilter.location}
                      <button
                        onClick={() =>
                          setSearchFilter((prev) => ({
                            ...prev,
                            location: "",
                          }))
                        }
                        className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}

                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-purple-200 transition-all hover:shadow-md"
                    >
                      <Briefcase size={14} />
                      {category}
                      <button
                        onClick={() => toggleCategory(category)}
                        className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}

                  {selectedSalary && (
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-amber-200 transition-all hover:shadow-md">
                      <IndianRupee size={14} />
                      {selectedSalary}
                      <button
                        onClick={() => setSelectedSalary("")}
                        className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}

                  {selectedLocations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-rose-200 transition-all hover:shadow-md"
                    >
                      <MapPin size={14} />
                      {location}
                      <button
                        onClick={() => toggleLocation(location)}
                        className="hover:bg-rose-200 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}

                  <button
                    onClick={clearAllFilters}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium underline underline-offset-2 transition-colors ml-2"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="px-4 py-2 rounded-lg border-2 border-blue-200 bg-white hover:bg-blue-50 flex items-center gap-2 lg:hidden transition-all font-medium text-blue-700"
              >
                <Filter size={16} />
                {showFilter ? "Hide" : "Show"} Filters
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${
              showFilter ? "" : "max-lg:hidden"
            } lg:sticky lg:top-4 lg:self-start transition-all`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-legpro-primary rounded-lg flex items-center justify-center">
                  <Filter size={16} className="text-white" />
                </div>
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-legpro-primary hover:text-legpro-primary-hover font-medium transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Briefcase size={14} className="text-legpro-primary" />
                Categories
              </h4>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {JobCategories.map((category, index) => (
                  <label
                    key={index}
                    className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="mr-3 h-4 w-4 accent-legpro-primary rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                <IndianRupee size={14} className="text-legpro-primary" />
                Salary Range
              </h4>
              <div className="space-y-1.5">
                {["0-3 LPA", "3-6 LPA", "6-10 LPA", "10+ LPA"].map((range) => (
                  <label
                    key={range}
                    className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors group"
                  >
                    <input
                      type="radio"
                      name="salary"
                      value={range}
                      checked={selectedSalary === range}
                      onChange={(e) => setSelectedSalary(e.target.value)}
                      className="mr-3 h-4 w-4 accent-legpro-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                      {range}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                <MapPin size={14} className="text-legpro-primary" />
                Locations
              </h4>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {JobLocations.map((location, index) => (
                  <label
                    key={index}
                    className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => toggleLocation(location)}
                      className="mr-3 h-4 w-4 accent-legpro-primary rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                      {location}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Job Listing Section */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div>
                <h2 className="font-bold text-2xl text-gray-900 mb-1">
                  Available Positions
                </h2>
                <p className="text-gray-600 text-sm">
                  {homeJobs.length > 0 ? (
                    <>
                      Showing <span className="font-semibold text-gray-900">{homeJobs.length}</span> of{" "}
                      <span className="font-semibold text-legpro-primary">{jobsPagination.totalJobs}</span> jobs
                    </>
                  ) : (
                    <span className="text-gray-500">No results found</span>
                  )}
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-legpro-primary text-white shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-legpro-primary text-white shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Job Cards */}
            <div className={`mb-8 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                : 'space-y-4'
            }`}>
              {isJobsLoading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <SkeletonJobCard key={i} />
                ))
              ) : homeJobs.length > 0 ? (
                homeJobs.map((job, index) => (
                  <div
                    key={index}
                    className={viewMode === 'list' ? '' : 'transition-all duration-300 hover:-translate-y-2 hover:scale-105'}
                  >
                    <Jobcard job={job} viewMode={viewMode} />
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Jobs Found
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We couldn't find any positions matching your criteria. Try adjusting your filters for better results.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-gradient-to-r from-legpro-primary to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {jobsPagination.totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center bg-white rounded-xl shadow-lg border border-gray-100 px-2 py-2">
                  <button
                    onClick={() => changePage(jobsPagination.currentPage - 1)}
                    disabled={!jobsPagination.hasPrev}
                    className={`p-2 rounded-lg transition-all ${
                      !jobsPagination.hasPrev
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex px-1">
                    {Array.from(
                      { length: Math.min(5, jobsPagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (jobsPagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (jobsPagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          jobsPagination.currentPage >=
                          jobsPagination.totalPages - 2
                        ) {
                          pageNum = jobsPagination.totalPages - 4 + i;
                        } else {
                          pageNum = jobsPagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => changePage(pageNum)}
                            className={`min-w-[2.5rem] h-10 flex items-center justify-center mx-1 rounded-lg font-medium transition-all ${
                              jobsPagination.currentPage === pageNum
                                ? "bg-legpro-primary text-white shadow-md scale-110"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    {jobsPagination.totalPages > 5 &&
                      jobsPagination.currentPage <
                        jobsPagination.totalPages - 2 && (
                        <>
                          <span className="min-w-[2.5rem] h-10 flex items-center justify-center mx-1 text-gray-400">
                            ...
                          </span>
                          <button
                            onClick={() =>
                              changePage(jobsPagination.totalPages)
                            }
                            className="min-w-[2.5rem] h-10 flex items-center justify-center mx-1 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
                          >
                            {jobsPagination.totalPages}
                          </button>
                        </>
                      )}
                  </div>

                  <button
                    onClick={() => changePage(jobsPagination.currentPage + 1)}
                    disabled={!jobsPagination.hasNext}
                    className={`p-2 rounded-lg transition-all ${
                      !jobsPagination.hasNext
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              </div>
            )}

            {/* Job Count Display */}
            {jobsPagination.totalJobs > 0 && (
              <div className="text-center text-gray-600 mt-5 text-sm font-medium">
                Displaying jobs {(jobsPagination.currentPage - 1) * 9 + 1}-
                {Math.min(
                  jobsPagination.currentPage * 9,
                  jobsPagination.totalJobs
                )}{" "}
                of {jobsPagination.totalJobs}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default JobListing;