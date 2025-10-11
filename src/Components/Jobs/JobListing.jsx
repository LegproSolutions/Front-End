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
} from "lucide-react";
import SkeletonJobCard from "./SkeletonJobCard";

const JobListing = () => {
  const {
    searchFilter,
    setSearchFilter,
    homeJobs,
    isJobsLoading,
    jobType,
    setJobType,
    jobsPagination,
    fetchHomeJobs,
  } = useContext(AppContext);

  // Filter states
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState("");
  
  // View mode state
  const [viewMode, setViewMode] = useState("list"); // "grid" or "list"

  // Get unique categories from current jobs
  const JobCategories = [...new Set(homeJobs.map((job) => job.category))];

  // Build filters object for API
  const buildFilters = useCallback(() => {
    const filters = {};

    if (jobType) filters.type = jobType;
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
    jobType,
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
    setJobType("");
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Filter Summary Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-lg text-gray-800">
                Active Filters:
              </h3>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2">
                {!searchFilter.title &&
                !searchFilter.location &&
                selectedCategories.length === 0 &&
                selectedLocations.length === 0 &&
                !jobType &&
                !selectedSalary ? (
                  <span className="text-gray-400 text-sm">
                    No filters applied
                  </span>
                ) : (
                  <>
                    {jobType && (
                      <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <Briefcase size={14} />
                        {jobType === "blue" ? "Blue Collar" : "White Collar"}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-blue-900"
                          onClick={() => setJobType("")}
                        />
                      </span>
                    )}

                    {searchFilter.title && (
                      <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                        <Search size={14} />
                        {searchFilter.title}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-green-900"
                          onClick={() =>
                            setSearchFilter((prev) => ({ ...prev, title: "" }))
                          }
                        />
                      </span>
                    )}

                    {searchFilter.location && (
                      <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                        <MapPin size={14} />
                        {searchFilter.location}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-red-900"
                          onClick={() =>
                            setSearchFilter((prev) => ({
                              ...prev,
                              location: "",
                            }))
                          }
                        />
                      </span>
                    )}

                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                      >
                        <Briefcase size={14} />
                        {category}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-purple-900"
                          onClick={() => toggleCategory(category)}
                        />
                      </span>
                    ))}

                    {selectedSalary && (
                      <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        <IndianRupee size={14} />
                        {selectedSalary}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-yellow-900"
                          onClick={() => setSelectedSalary("")}
                        />
                      </span>
                    )}

                    {selectedLocations.map((location) => (
                      <span
                        key={location}
                        className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm"
                      >
                        <MapPin size={14} />
                        {location}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-orange-900"
                          onClick={() => toggleLocation(location)}
                        />
                      </span>
                    ))}

                    <button
                      onClick={clearAllFilters}
                      className="text-gray-600 hover:text-gray-900 text-sm underline"
                    >
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 flex items-center gap-2 lg:hidden"
            >
              <Filter size={16} />
              {showFilter ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 bg-white rounded-lg shadow-sm p-5 ${
              showFilter ? "" : "max-lg:hidden"
            } lg:sticky lg:top-4 lg:self-start`}
          >
            <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center">
              <Filter size={18} className="mr-2" />
              Filter Options
            </h3>

            {/* Job Type Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-lg text-gray-700 pb-2 border-b">
                Job Type
              </h4>
              <div className="mt-3 space-y-2">
                {[
                  { label: "All Jobs", value: "" },
                  { label: "Blue Collar", value: "blue" },
                  { label: "White Collar", value: "white" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="jobType"
                      value={type.value}
                      checked={jobType === type.value}
                      onChange={(e) => setJobType(e.target.value)}
                      className="mr-3 h-4 w-4 accent-blue-600"
                    />
                    {type.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-lg text-gray-700 pb-2 border-b">
                Categories
              </h4>
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {JobCategories.map((category, index) => (
                  <label
                    key={index}
                    className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="mr-3 h-4 w-4 accent-blue-600"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-lg text-gray-700 pb-2 border-b">
                Salary Range
              </h4>
              <div className="mt-3 space-y-2">
                {["0-3 LPA", "3-6 LPA", "6-10 LPA", "10+ LPA"].map((range) => (
                  <label
                    key={range}
                    className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="salary"
                      value={range}
                      checked={selectedSalary === range}
                      onChange={(e) => setSelectedSalary(e.target.value)}
                      className="mr-3 h-4 w-4 accent-blue-600"
                    />
                    {range}
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h4 className="font-medium text-lg text-gray-700 pb-2 border-b">
                Locations
              </h4>
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {JobLocations.map((location, index) => (
                  <label
                    key={index}
                    className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => toggleLocation(location)}
                      className="mr-3 h-4 w-4 accent-blue-600"
                    />
                    {location}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Job Listing Section */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-2xl text-gray-800">
                  Find Your Perfect Job
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing {homeJobs.length} of{" "}
                  <span className="font-medium text-blue-600">
                    {jobsPagination.totalJobs}
                  </span>{" "}
                  results
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
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
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
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
                    className={viewMode === 'list' ? '' : 'transition-all duration-300 hover:-translate-y-1'}
                  >
                    <Jobcard job={job} viewMode={viewMode} />
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg border p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters to find more opportunities
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {jobsPagination.totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center bg-white rounded-lg shadow-sm px-2 py-1">
                  <button
                    onClick={() => changePage(jobsPagination.currentPage - 1)}
                    disabled={!jobsPagination.hasPrev}
                    className={`p-2 rounded-md ${
                      !jobsPagination.hasPrev
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft size={18} />
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
                            className={`w-8 h-8 flex items-center justify-center mx-1 rounded-md ${
                              jobsPagination.currentPage === pageNum
                                ? "bg-blue-600 text-white"
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
                          <span className="w-8 h-8 flex items-center justify-center mx-1">
                            ...
                          </span>
                          <button
                            onClick={() =>
                              changePage(jobsPagination.totalPages)
                            }
                            className="w-8 h-8 flex items-center justify-center mx-1 rounded-md text-gray-700 hover:bg-gray-100"
                          >
                            {jobsPagination.totalPages}
                          </button>
                        </>
                      )}
                  </div>

                  <button
                    onClick={() => changePage(jobsPagination.currentPage + 1)}
                    disabled={!jobsPagination.hasNext}
                    className={`p-2 rounded-md ${
                      !jobsPagination.hasNext
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              </div>
            )}

            {/* Job Count Display */}
            {jobsPagination.totalJobs > 0 && (
              <div className="text-center text-gray-600 mt-4">
                Showing {(jobsPagination.currentPage - 1) * 9 + 1}-
                {Math.min(
                  jobsPagination.currentPage * 9,
                  jobsPagination.totalJobs
                )}{" "}
                of {jobsPagination.totalJobs} jobs
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
