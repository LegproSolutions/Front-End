import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  Briefcase,
  Building2,
  User,
  MapPin,
  GraduationCap,
  IndianRupee,
  Users,
  TrendingUp,
  Plus
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchJob, editJob } = useContext(AppContext);

  // State variables for job details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [level, setLevel] = useState("");
  const [salary, setSalary] = useState("");
  const [openings, setOpenings] = useState("");
  const [experience, setExperience] = useState("");
  const [deadline, setDeadline] = useState("");
  
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
const [showCustomInput, setShowCustomInput] = useState(false);
const [categories, setCategories] = useState(JobCategories);

  // State variables for company details
  const [companyName, setCompanyName] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");

  // State variables for contact person
  const [hrName, setHrName] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [hrPhone, setHrPhone] = useState("");

  // State for UI control
  const [activeSection, setActiveSection] = useState("job");
  const [customCity, setCustomCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Refs for Quill editor and location dropdown
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch job data on component mount if ID exists
  useEffect(() => {
    const fetchJobData = async () => {
      if (id) {
        const jobData = await fetchJob(id);
        if (jobData) {
          setTitle(jobData.title || "");
          setDescription(jobData.description || "");
          setLocation(jobData.location || "Bangalore");
          setCategory(jobData.category || "Programming");
          setLevel(jobData.level || "Beginner level");
          setSalary(jobData.salary ? String(jobData.salary) : "");
          setOpenings(jobData.openings ? String(jobData.openings) : "");
          setExperience(jobData.experience ? String(jobData.experience) : "");
          setDeadline(
            jobData.deadline
              ? new Date(jobData.deadline).toISOString().split("T")[0]
              : ""
          );
          setCompanyName(jobData.companyDetails?.name || "");
          setCompanyDesc(jobData.companyDetails?.shortDescription || "");
          setCompanyCity(jobData.companyDetails?.city || "");
          setCompanyState(jobData.companyDetails?.state || "");
          setCompanyCountry(jobData.companyDetails?.country || "");
          setHrName(jobData.companyDetails?.hrName || "");
          setHrEmail(jobData.companyDetails?.hrEmail || "");
          setHrPhone(jobData.companyDetails?.hrPhone || "");
        }
      }
    };

    fetchJobData();
  }, [id, fetchJob]);

  // Initialize Quill editor
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write detailed job description here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["link"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  // Update Quill editor content when description changes
  useEffect(() => {
    if (quillRef.current && description) {
      quillRef.current.root.innerHTML = description;
    }
  }, [description]);

  // Handle outside click for location dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus on search input when location dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById("citySearchInput")?.focus();
      }, 100);
    }
  }, [isOpen]);




  // Handle form submission for editing job
  const onEditHandler = async (e) => {
    e.preventDefault();
    if (Number(salary) <= 0 || Number(openings) < 1 || Number(experience) < 0) {
      toast.error(
        "Salary must be > 0, Openings must be at least 1, and Experience must be ≥ 0."
      );
      return;
    }
    const jobData = {
      title,
      description: quillRef.current.root.innerHTML,
      location,
      category,
      level,
      salary: Number(salary),
      openings: Number(openings),
      experience: Number(experience),
      deadline,
      companyDetails: {
        name: companyName,
        shortDescription: companyDesc,
        city: companyCity,
        state: companyState,
        country: companyCountry,
        hrName,
        hrEmail,
        hrPhone,
      },
      visible: true,
      date: new Date(),
       isEdited: true, // NEW: Set isEdited to true on save
      isVerified: false, // NEW: Set isVerified to false when edited, for re-verification
    };
    const response = await editJob(id, jobData);
    if (response) {
      toast.success(response.message || "Job updated successfully!");
      navigate("/dashboard/manage-jobs");
    } else {
      toast.error(response?.message || "Failed to update job!");
    }
  };

  // Filter job locations based on search term
  const filteredLocations = JobLocations.filter((loc) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show custom city input if "Other City" is selected
  const showOtherCityInput = location === "Other City";

  // Handle confirmation of custom city input
  const handleConfirmCity = () => {
    if (customCity.trim()) {
      setLocation(customCity.trim());
      setCustomCity("");
      setIsOpen(false);
    }
  };

// category handler
const handleCategoryChange = (value) => {
  if (value === "Other") {
    setShowCustomInput(true);
    setCategory("");
  } else {
    setCategory(value);
    setShowCustomInput(false);
    setCustomCategory("");
  }
};
const addCustomCategory = () => {
  if (customCategory.trim()) {
    const newCategory = customCategory.trim();
    if (!categories.includes(newCategory)) {
      const updated = [...categories.filter(c => c !== "Other"), newCategory, "Other"];
      setCategories(updated);
    }
    setCategory(newCategory);
    setCustomCategory("");
    setShowCustomInput(false);
  }
};

const handleCustomCategorySubmit = (e) => {
  if (e.key === "Enter") {
    addCustomCategory();
  }
};


  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Edit Job Opportunity
              </h2>
              <p className="text-blue-100 mt-1">
                Modify the details of the job listing
              </p>
            </div>
            <Link
              to="/dashboard/manage-jobs"
              className="border px-4 py-2 rounded-lg bg-white text-red-600 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
          </div>

          {/* Progress Tabs */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => setActiveSection("job")}
                className={`px-3 py-2 text-sm sm:text-base font-medium rounded-t-lg flex items-center ${
                  activeSection === "job"
                    ? "bg-white text-blue-700 border-t border-l border-r border-gray-200"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Briefcase className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Job Details</span>
                <span className="sm:hidden">Job</span>
              </button>
              <button
                onClick={() => setActiveSection("company")}
                className={`px-3 py-2 text-sm sm:text-base font-medium rounded-t-lg flex items-center ${
                  activeSection === "company"
                    ? "bg-white text-blue-700 border-t border-l border-r border-gray-200"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Building2 className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Company Info</span>
                <span className="sm:hidden">Company</span>
              </button>
              <button
                onClick={() => setActiveSection("contact")}
                className={`px-3 py-2 text-sm sm:text-base font-medium rounded-t-lg flex items-center ${
                  activeSection === "contact"
                    ? "bg-white text-blue-700 border-t border-l border-r border-gray-200"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <User className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Contact Person</span>
                <span className="sm:hidden">Contact</span>
              </button>
            </div>
          </div>

          <form onSubmit={onEditHandler} className="p-6">
            {/* Job Details Section */}
            {activeSection === "job" && (
              <div className="space-y-6">
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <div
                    ref={editorRef}
                    className="border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                  ></div>
                  <p className="mt-1 text-sm text-gray-500">
                    Include responsibilities, requirements, benefits, and
                    company culture
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                  {/* <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Job Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {JobCategories.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div> */}

                  <div className="w-full">
  <label htmlFor="job-category" className="block text-gray-700 font-medium mb-2">
    Job Category <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Briefcase className="h-5 w-5 text-gray-400" />
    </div>
    <select
      id="job-category"
      className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
      value={category || (showCustomInput ? "Other" : "")}
      onChange={(e) => handleCategoryChange(e.target.value)}
    >
      <option value="" disabled hidden>
        Select category
      </option>
      {categories.map((cat, index) => (
        <option key={index} value={cat}>
          {cat}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg
        className="h-5 w-5 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>

  {showCustomInput && (
    <div className="mt-2 flex items-center gap-2">
      <input
        type="text"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        placeholder="Enter your job category"
        value={customCategory}
        onChange={(e) => setCustomCategory(e.target.value)}
        onKeyDown={handleCustomCategorySubmit}
      />
      <button
        type="button"
        onClick={addCustomCategory}
        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
        title="Add Category"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  )}
</div>


                  {/* Experience Level */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Experience Level <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                      >
                        <option value="Beginner level">Entry Level</option>
                        <option value="Intermediate level">Mid-Level</option>
                        <option value="Senior level">Senior Level</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Job location dropdown  */}
                  <div className="relative w-full" ref={dropdownRef}>
                    <div className="relative w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Job Location <span className="text-red-500">*</span>
                      </label>

                      {/* Trigger Box */}
                      <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 cursor-pointer relative"
                      >
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="flex-1 text-gray-700">
                          {location || "Search city"}
                        </span>
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      {/* Dropdown */}
                      {isOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <input
                            type="text"
                            id="citySearchInput"
                            className="w-full px-3 py-2 border-b border-gray-200 outline-none"
                            placeholder="Search city"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          {filteredLocations.map((loc, index) => (
                            <div
                              key={index}
                              className="px-3 py-1 hover:text-white hover:bg-[#2563EB] cursor-pointer"
                              onClick={() => {
                                setLocation(loc);
                                setIsOpen(false);
                                setSearchTerm("");
                              }}
                            >
                              {loc}
                            </div>
                          ))}
                          {!filteredLocations.includes(searchTerm) &&
                            searchTerm && (
                              <div
                                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                onClick={() => {
                                  setLocation("Other City");
                                  setIsOpen(false);
                                  setCustomCity(searchTerm);
                                  setSearchTerm("");
                                }}
                              >
                                Other City
                              </div>
                            )}
                        </div>
                      )}

                      {/* Custom City Input */}
                      {showOtherCityInput && (
                        <div className="absolute right-0 mt-2 w-full z-10">
                          <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md border">
                            <input
                              type="text"
                              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              placeholder="Enter your city"
                              value={customCity}
                              onChange={(e) => setCustomCity(e.target.value)}
                            />
                            <button
                              onClick={handleConfirmCity}
                              className="flex items-center justify-center bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition-all duration-200"
                              title="Add city"
                            >
                              <span className="text-xl font-bold">+</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ---- */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                  {/* Salary */}
                  <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">
                      Salary (Annual) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="e.g. 75000"
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={salary}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) setSalary(value);
                        }}
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter the annual salary in INR
                    </p>
                  </div>

                  {/* Job Openings */}
                  <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">
                      Job Openings <span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="e.g. 3"
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={openings}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) setOpenings(value);
                        }}
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Specify the number of available positions
                    </p>
                  </div>

                  {/* Experience Required */}
                  <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">
                      Experience Required{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="e.g. 2"
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={experience}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) setExperience(value);
                        }}
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter the experience required in years
                    </p>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">
                    Application Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="w-2/6 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection("company")}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Next: Company Info
                  </button>
                </div>
              </div>
            )}

            {/* Company Details Section */}
            {activeSection === "company" && (
              <div className="space-y-6">
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">
                    Company Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe the company, culture, and mission..."
                    value={companyDesc}
                    onChange={(e) => setCompanyDesc(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="City"
                      value={companyCity}
                      onChange={(e) => setCompanyCity(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      placeholder="State/Province"
                      value={companyState}
                      onChange={(e) => setCompanyState(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="Country"
                      value={companyCountry}
                      onChange={(e) => setCompanyCountry(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection("job")}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("contact")}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Next: Contact Info
                  </button>
                </div>
              </div>
            )}

            {/* Contact Person Section */}
            {activeSection === "contact" && (
              <div className="space-y-6">
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">
                    HR/Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={hrName}
                    onChange={(e) => setHrName(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="email@company.com"
                      value={hrEmail}
                      onChange={(e) => setHrEmail(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (123) 456-7890"
                      value={hrPhone}
                      onChange={(e) => setHrPhone(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
                  <h4 className="text-blue-800 font-medium mb-2">
                    Ready to post?
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Please review all information before submitting. Fields
                    marked with <span className="text-red-500">*</span> are
                    required.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection("company")}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
