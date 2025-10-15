import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Code,
  FileText,
  Camera,
  Calendar,
  Users,
  Upload,
  File,
  X,
  Check,
  AlertTriangle,
  GraduationCap,
  Building2,
  Globe,
  Languages,
  Star,
  Plus,
  Trash2,
  Edit,
  Save,
  ChevronDown,
  Search,
  Loader,
} from "lucide-react";
import axios from "../../utils/axiosConfig";

const UserProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(15);
  const fileInputRef = useRef(null);
  const profileImageRef = useRef(null);

  const [uploadStatus, setUploadStatus] = useState({
    resume: { loading: false, error: null, success: false },
    profileImage: { loading: false, error: null, success: false },
    submit: { loading: false, error: null, success: false },
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [formData, setFormData] = useState({
    // Basic Information
    personalInfo: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      nationality: "Indian",
      profileImage: null,
    },

    // Address Information
    address: {
      current: {
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        landmark: "",
      },
      permanent: {
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        landmark: "",
        sameAsCurrent: false,
      },
    },

    // Professional Information
    professional: {
      currentJobTitle: "",
      currentCompany: "",
      workExperience: "",
      currentSalary: "",
      expectedSalary: "",
      noticePeriod: "",
      workMode: "",
      preferredLocations: [],
      industryExperience: [],
      availableFrom: "",
    },

    // Education
    education: [],

    // Experience
    experience: [],

    // Skills & Languages
    skills: {
      technical: [],
      soft: [],
      languages: [],
      certifications: [],
    },

    // Documents
    documents: {
      resume: null,
      profilePicture: null,
      portfolio: null,
    },

    // Social & Portfolio Links
    links: {
      linkedin: "",
      github: "",
      portfolio: "",
      website: "",
      other: [],
    },

    // Preferences
    preferences: {
      jobTypes: [],
      workShifts: [],
      disabilities: "",
      careerObjective: "",
    },
  });

  const steps = [
    {
      icon: User,
      label: "Personal",
      description: "Basic information",
      fields: ["firstName", "lastName", "email", "phone", "dateOfBirth"],
    },
    {
      icon: MapPin,
      label: "Address",
      description: "Location details",
      fields: ["current.street", "current.city", "current.state"],
    },
    {
      icon: Briefcase,
      label: "Professional",
      description: "Career & experience",
      fields: ["currentJobTitle", "workExperience", "currentSalary"],
    },
    {
      icon: GraduationCap,
      label: "Education",
      description: "Academic background",
      fields: ["education"],
    },
    {
      icon: Award,
      label: "Experience",
      description: "Work history",
      fields: ["experience"],
    },
    {
      icon: Code,
      label: "Skills",
      description: "Technical & soft skills",
      fields: ["technical", "languages"],
    },
    {
      icon: Globe,
      label: "Portfolio",
      description: "Links & documents",
      fields: ["resume", "linkedin", "github"],
    },
    {
      icon: Star,
      label: "Preferences",
      description: "Job preferences",
      fields: ["jobTypes", "workShifts", "careerObjective"],
    },
  ];

  // Helper function to update nested form data
  const updateFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Helper function to update deeply nested data
  const updateNestedData = (section, subsection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  // Add item to arrays (for experience, education, etc.)
  const addArrayItem = (section, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  // Remove item from arrays
  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // Calculate profile completion
  const calculateCompletion = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Count required fields completion
    const requiredFields = [
      formData.personalInfo.firstName,
      formData.personalInfo.lastName,
      formData.personalInfo.email,
      formData.personalInfo.phone,
      formData.address.current.city,
      formData.professional.workExperience,
    ];

    totalFields += requiredFields.length;
    completedFields += requiredFields.filter(
      (field) => field && field.trim()
    ).length;

    // Add bonus for additional sections
    if (formData.education.length > 0) completedFields += 2;
    if (formData.experience.length > 0) completedFields += 2;
    if (formData.skills.technical.length > 0) completedFields += 1;
    if (formData.documents.resume) completedFields += 2;

    totalFields += 7; // Bonus fields

    return Math.min(Math.round((completedFields / totalFields) * 100), 100);
  };

  // File upload handlers
  const handleFileUpload = async (file, type = "resume") => {
    if (!file) return;

    const allowedTypes =
      type === "resume"
        ? ["application/pdf"]
        : ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setUploadStatus((prev) => ({
        ...prev,
        [type]: {
          loading: false,
          error: `Only ${
            type === "resume" ? "PDF" : "image"
          } files are allowed`,
          success: false,
        },
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus((prev) => ({
        ...prev,
        [type]: {
          loading: false,
          error: "File size should be less than 5MB",
          success: false,
        },
      }));
      return;
    }

    setUploadStatus((prev) => ({
      ...prev,
      [type]: { loading: true, error: null, success: false },
    }));

    try {
      const uploadData = new FormData();
      uploadData.append(type, file);

      const response = await axios.post(
        `/api/profile/upload-${type}`,
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        updateFormData("documents", type, {
          url: response.data.url,
          publicId: response.data.publicId,
          originalName: file.name,
        });

        setUploadStatus((prev) => ({
          ...prev,
          [type]: { loading: false, error: null, success: true },
        }));
      }
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        [type]: {
          loading: false,
          error: error.response?.data?.message || `Error uploading ${type}`,
          success: false,
        },
      }));
    }
  };

  // Transform frontend form data to match backend schema
  const transformFormDataForAPI = () => {
    return {
      // Basic fields from personalInfo
      firstName: formData.personalInfo.firstName,
      lastName: formData.personalInfo.lastName,
      middleName: formData.personalInfo.middleName,
      email: formData.personalInfo.email,
      phone: formData.personalInfo.phone,
      alternatePhone: formData.personalInfo.alternatePhone,
      dateOfBirth: formData.personalInfo.dateOfBirth,
      gender: formData.personalInfo.gender,
      maritalStatus: formData.personalInfo.maritalStatus,
      nationality: formData.personalInfo.nationality,
      
      // Optional fields
      fatherName: formData.personalInfo.fatherName || '',
      aadharNumber: formData.personalInfo.aadharNumber || '',
      
      // Address - use current address as main address
      address: {
        street: formData.address.current.street,
        city: formData.address.current.city,
        state: formData.address.current.state,
        country: formData.address.current.country,
        pincode: formData.address.current.pincode,
        landmark: formData.address.current.landmark,
      },
      
      // Permanent address if different from current
      permanentAddress: formData.address.permanent.sameAsCurrent ? null : {
        street: formData.address.permanent.street,
        city: formData.address.permanent.city,
        state: formData.address.permanent.state,
        country: formData.address.permanent.country,
        pincode: formData.address.permanent.pincode,
        landmark: formData.address.permanent.landmark,
      },
      
      // Education - convert array to Map structure expected by backend
      education: formData.education.reduce((acc, edu, index) => {
        acc[`education_${index}`] = {
          instituteType: edu.type || 'University',
          instituteFields: {
            instituteName: edu.institution || '',
            certificationBody: edu.certificationBody || edu.institution || '',
            passingYear: parseInt(edu.year) || new Date().getFullYear(),
            percentage: parseFloat(edu.percentage) || 0,
            courseType: edu.courseType || 'Full-time',
            courseDuration: parseInt(edu.duration) || 4,
            specialization: edu.field || edu.specialization || '',
            courseName: edu.degree || '',
            trade: edu.trade || '',
          }
        };
        return acc;
      }, {}),
      
      // Experience array
      experience: formData.experience.map(exp => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate || null,
        description: exp.description,
      })),
      
      // Professional Information
      professional: {
        currentJobTitle: formData.professional.currentJobTitle,
        currentCompany: formData.professional.currentCompany,
        workExperience: formData.professional.workExperience,
        currentSalary: formData.professional.currentSalary,
        expectedSalary: formData.professional.expectedSalary,
        noticePeriod: formData.professional.noticePeriod,
        workMode: formData.professional.workMode,
        preferredLocations: formData.professional.preferredLocations,
        industryExperience: formData.professional.industryExperience,
        availableFrom: formData.professional.availableFrom,
      },
      
      // Skills - flatten technical and soft skills into array (for backward compatibility)
      skills: [
        ...formData.skills.technical,
        ...formData.skills.soft,
      ],
      
      // Detailed skills breakdown
      skillsDetailed: {
        technical: formData.skills.technical,
        soft: formData.skills.soft,
        certifications: formData.skills.certifications,
      },
      
      // Languages with proficiency
      languages: formData.skills.languages.map(lang => ({
        name: typeof lang === 'string' ? lang : lang.name,
        proficiency: typeof lang === 'object' ? lang.proficiency : 'Intermediate',
      })),
      
      // Documents
      documents: {
        resume: formData.documents.resume,
        profilePicture: formData.documents.profilePicture,
        portfolio: formData.documents.portfolio,
      },
      
      // Social Media and Portfolio Links
      socialLinks: {
        linkedin: formData.links.linkedin,
        github: formData.links.github,
        portfolio: formData.links.portfolio,
        website: formData.links.website,
        other: formData.links.other.map(link => ({
          platform: typeof link === 'object' ? link.platform : 'Other',
          url: typeof link === 'object' ? link.url : link,
        })),
      },
      
      // Job Preferences
      preferences: {
        jobTypes: formData.preferences.jobTypes,
        workShifts: formData.preferences.workShifts,
        disabilities: formData.preferences.disabilities,
        careerObjective: formData.preferences.careerObjective,
      },
      
      // Resume and profile picture (keeping for backward compatibility)
      resume: formData.documents.resume,
      profilePicture: formData.documents.profilePicture?.url || formData.personalInfo.profileImage,
    };
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      setUploadStatus(prev => ({
        ...prev,
        submit: { loading: true, error: null, success: false }
      }));

      const transformedData = transformFormDataForAPI();
      console.log('Submitting data:', transformedData);

      const response = await axios.post('/api/profile/create', transformedData);

      if (response.data.success) {
        setUploadStatus(prev => ({
          ...prev,
          submit: { loading: false, error: null, success: true }
        }));
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setUploadStatus(prev => ({
            ...prev,
            submit: { loading: false, error: null, success: false }
          }));
        }, 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setUploadStatus(prev => ({
        ...prev,
        submit: { 
          loading: false, 
          error: error.response?.data?.message || 'Failed to save profile', 
          success: false 
        }
      }));
    }
  };

  // Transform API data back to form structure
  const transformAPIDataToForm = (profileData) => {
    return {
      personalInfo: {
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        middleName: profileData.middleName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        alternatePhone: profileData.alternatePhone || '',
        dateOfBirth: profileData.dateOfBirth || '',
        gender: profileData.gender || '',
        maritalStatus: profileData.maritalStatus || '',
        nationality: profileData.nationality || 'Indian',
        fatherName: profileData.fatherName || '',
        aadharNumber: profileData.aadharNumber || '',
        profileImage: profileData.profilePicture || null,
      },
      address: {
        current: {
          street: profileData.address?.street || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          country: profileData.address?.country || 'India',
          pincode: profileData.address?.pincode || '',
          landmark: profileData.address?.landmark || '',
        },
        permanent: {
          street: profileData.permanentAddress?.street || '',
          city: profileData.permanentAddress?.city || '',
          state: profileData.permanentAddress?.state || '',
          country: profileData.permanentAddress?.country || 'India',
          pincode: profileData.permanentAddress?.pincode || '',
          landmark: profileData.permanentAddress?.landmark || '',
          sameAsCurrent: !profileData.permanentAddress,
        },
      },
      professional: {
        currentJobTitle: profileData.professional?.currentJobTitle || '',
        currentCompany: profileData.professional?.currentCompany || '',
        workExperience: profileData.professional?.workExperience || '',
        currentSalary: profileData.professional?.currentSalary || '',
        expectedSalary: profileData.professional?.expectedSalary || '',
        noticePeriod: profileData.professional?.noticePeriod || '',
        workMode: profileData.professional?.workMode || '',
        preferredLocations: profileData.professional?.preferredLocations || [],
        industryExperience: profileData.professional?.industryExperience || [],
        availableFrom: profileData.professional?.availableFrom || '',
      },
      education: profileData.education ? Object.values(profileData.education).map(edu => ({
        type: edu.instituteType || '',
        institution: edu.instituteFields?.instituteName || '',
        degree: edu.instituteFields?.courseName || '',
        field: edu.instituteFields?.specialization || '',
        year: edu.instituteFields?.passingYear || '',
        percentage: edu.instituteFields?.percentage || '',
        courseType: edu.instituteFields?.courseType || 'Full-time',
        duration: edu.instituteFields?.courseDuration || '',
        trade: edu.instituteFields?.trade || '',
      })) : [],
      experience: profileData.experience || [],
      skills: {
        technical: profileData.skillsDetailed?.technical || [],
        soft: profileData.skillsDetailed?.soft || [],
        languages: profileData.languages || [],
        certifications: profileData.skillsDetailed?.certifications || [],
      },
      documents: {
        resume: profileData.documents?.resume || profileData.resume || null,
        profilePicture: profileData.documents?.profilePicture || null,
        portfolio: profileData.documents?.portfolio || null,
      },
      links: {
        linkedin: profileData.socialLinks?.linkedin || '',
        github: profileData.socialLinks?.github || '',
        portfolio: profileData.socialLinks?.portfolio || '',
        website: profileData.socialLinks?.website || '',
        other: profileData.socialLinks?.other || [],
      },
      preferences: {
        jobTypes: profileData.preferences?.jobTypes || [],
        workShifts: profileData.preferences?.workShifts || [],
        disabilities: profileData.preferences?.disabilities || '',
        careerObjective: profileData.preferences?.careerObjective || '',
      },
    };
  };

  // Fetch existing profile data
  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await axios.get('/api/profile/get-user');
      
      if (response.data.success && response.data.profile) {
        const transformedData = transformAPIDataToForm(response.data.profile);
        setFormData(transformedData);
      }
    } catch (error) {
      // If no profile exists, that's fine - user is creating new profile
      if (error.response?.status !== 404) {
        console.error('Error fetching profile:', error);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fetch profile data when component mounts
  React.useEffect(() => {
    fetchProfileData();
  }, []);

  // Update profile completion when form data changes
  React.useEffect(() => {
    setProfileCompletion(calculateCompletion());
  }, [formData]);

  // Show loading indicator while fetching profile data
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-legpro-primary" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-legpro-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-legpro-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Profile Image Upload */}
              <div className="relative group">
                <div
                  onClick={() => profileImageRef.current?.click()}
                  className="w-20 h-20 bg-legpro-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-legpro-primary-hover transition-colors"
                >
                  {formData.documents.profilePicture ? (
                    <img
                      src={formData.documents.profilePicture.url}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </div>
                <input
                  type="file"
                  ref={profileImageRef}
                  onChange={(e) =>
                    handleFileUpload(e.target.files[0], "profileImage")
                  }
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Complete Your Profile
                </h1>
                <p className="text-gray-600 mt-1">
                  Help employers find the perfect match
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-legpro-primary">
                  {profileCompletion}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
              <div className="w-20 h-20 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#00394d"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={226}
                    strokeDashoffset={226 * (1 - profileCompletion / 100)}
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;

              return (
                <div key={index} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className="flex flex-col items-center gap-2 w-full group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-legpro-primary text-white shadow-lg"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-legpro-primary"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </button>

                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-all ${
                        currentStep > index ? "bg-green-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Personal Information - Step 0 */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Personal Information
                    </h2>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.firstName}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "firstName",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.middleName}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "middleName",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="Middle name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.lastName}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "lastName",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.personalInfo.email}
                        onChange={(e) =>
                          updateFormData(
                            "personalInfo",
                            "email",
                            e.target.value
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) =>
                          updateFormData(
                            "personalInfo",
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.personalInfo.alternatePhone}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "alternatePhone",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="Alternative contact"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.personalInfo.dateOfBirth}
                        onChange={(e) =>
                          updateFormData(
                            "personalInfo",
                            "dateOfBirth",
                            e.target.value
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.personalInfo.gender}
                      onChange={(e) =>
                        updateFormData("personalInfo", "gender", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Marital Status
                    </label>
                    <select
                      value={formData.personalInfo.maritalStatus}
                      onChange={(e) =>
                        updateFormData(
                          "personalInfo",
                          "maritalStatus",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Address Information - Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Address Details
                    </h2>
                    <p className="text-gray-600">Where are you located?</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Current Address */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Current Address
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.address.current.street}
                          onChange={(e) =>
                            updateNestedData(
                              "address",
                              "current",
                              "street",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                          placeholder="House no., Building, Street name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.address.current.city}
                          onChange={(e) =>
                            updateNestedData(
                              "address",
                              "current",
                              "city",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                          placeholder="City name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.address.current.state}
                          onChange={(e) =>
                            updateNestedData(
                              "address",
                              "current",
                              "state",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                          placeholder="State name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.address.current.pincode}
                          onChange={(e) =>
                            updateNestedData(
                              "address",
                              "current",
                              "pincode",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                          placeholder="6-digit PIN"
                          maxLength="6"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.address.current.country}
                          onChange={(e) =>
                            updateNestedData(
                              "address",
                              "current",
                              "country",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Information - Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Professional Information
                    </h2>
                    <p className="text-gray-600">Tell us about your career</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.professional.currentJobTitle}
                      onChange={(e) =>
                        updateFormData(
                          "professional",
                          "currentJobTitle",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Company
                    </label>
                    <input
                      type="text"
                      value={formData.professional.currentCompany}
                      onChange={(e) =>
                        updateFormData(
                          "professional",
                          "currentCompany",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="Company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Total Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.professional.workExperience}
                      onChange={(e) =>
                        updateFormData(
                          "professional",
                          "workExperience",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Experience</option>
                      <option value="Fresher">Fresher</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="6-10 years">6-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Salary (Annual)
                    </label>
                    <input
                      type="text"
                      value={formData.professional.currentSalary}
                      onChange={(e) =>
                        updateFormData(
                          "professional",
                          "currentSalary",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g., 5,00,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Expected Salary (Annual)
                    </label>
                    <input
                      type="text"
                      value={formData.professional.expectedSalary}
                      onChange={(e) =>
                        updateFormData(
                          "professional",
                          "expectedSalary",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                      placeholder="e.g., 7,00,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Notice Period
                    </label>
                    <select
                      value={formData.professional.noticePeriod}
                      onChange={(e) =>
                        updateFormData(
                          "professional",
                          "noticePeriod",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Notice Period</option>
                      <option value="Immediate">Immediate</option>
                      <option value="15 days">15 days</option>
                      <option value="1 month">1 month</option>
                      <option value="2 months">2 months</option>
                      <option value="3 months">3 months</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Career Objective
                  </label>
                  <textarea
                    value={formData.preferences.careerObjective}
                    onChange={(e) =>
                      updateFormData(
                        "preferences",
                        "careerObjective",
                        e.target.value
                      )
                    }
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe your career goals and what you're looking for in your next role..."
                  />
                </div>
              </div>
            )}

            {/* Education - Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Education
                      </h2>
                      <p className="text-gray-600">
                        Add your educational qualifications
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      addArrayItem("education", {
                        degree: "",
                        field: "",
                        institution: "",
                        year: "",
                        percentage: "",
                        type: "Full-time",
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-legpro-primary text-white rounded-lg hover:bg-legpro-primary-hover transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.education.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>
                        No education added yet. Click "Add Education" to get
                        started.
                      </p>
                    </div>
                  ) : (
                    formData.education.map((edu, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">
                            Education {index + 1}
                          </h4>
                          <button
                            onClick={() => removeArrayItem("education", index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Degree/Qualification
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...formData.education];
                                updated[index].degree = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  education: updated,
                                }));
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                              placeholder="e.g., B.Tech, MBA, M.Sc"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Field of Study
                            </label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => {
                                const updated = [...formData.education];
                                updated[index].field = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  education: updated,
                                }));
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                              placeholder="e.g., Computer Science, Marketing"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Institution Name
                            </label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = [...formData.education];
                                updated[index].institution = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  education: updated,
                                }));
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                              placeholder="University/College name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Year of Passing
                            </label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => {
                                const updated = [...formData.education];
                                updated[index].year = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  education: updated,
                                }));
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                              placeholder="e.g., 2023"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Skills - Step 5 */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Skills & Languages
                    </h2>
                    <p className="text-gray-600">Showcase your abilities</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Technical Skills
                    </label>
                    <div className="flex flex-wrap gap-2 p-4 border border-gray-300 rounded-lg min-h-[100px] bg-gray-50">
                      {formData.skills.technical.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-legpro-primary text-white rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              const updated = formData.skills.technical.filter(
                                (_, i) => i !== index
                              );
                              updateFormData("skills", "technical", updated);
                            }}
                            className="hover:bg-red-500 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add technical skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          const newSkill = e.target.value.trim();
                          if (!formData.skills.technical.includes(newSkill)) {
                            updateFormData("skills", "technical", [
                              ...formData.skills.technical,
                              newSkill,
                            ]);
                          }
                          e.target.value = "";
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Languages
                    </label>
                    <div className="flex flex-wrap gap-2 p-4 border border-gray-300 rounded-lg min-h-[100px] bg-gray-50">
                      {formData.skills.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-500 text-white rounded-full text-sm flex items-center gap-2"
                        >
                          {lang}
                          <button
                            onClick={() => {
                              const updated = formData.skills.languages.filter(
                                (_, i) => i !== index
                              );
                              updateFormData("skills", "languages", updated);
                            }}
                            className="hover:bg-red-500 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add language and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          const newLang = e.target.value.trim();
                          if (!formData.skills.languages.includes(newLang)) {
                            updateFormData("skills", "languages", [
                              ...formData.skills.languages,
                              newLang,
                            ]);
                          }
                          e.target.value = "";
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio & Documents - Step 6 */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Portfolio & Documents
                    </h2>
                    <p className="text-gray-600">
                      Upload your resume and add links
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Resume Upload */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Resume Upload <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-legpro-primary transition-colors">
                      {formData.documents.resume ? (
                        <div className="space-y-3">
                          <FileText className="w-12 h-12 mx-auto text-green-500" />
                          <p className="font-medium text-gray-900">
                            {formData.documents.resume.originalName}
                          </p>
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1 text-sm bg-legpro-primary text-white rounded hover:bg-legpro-primary-hover"
                            >
                              Replace
                            </button>
                            <a
                              href={formData.documents.resume.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="space-y-3 cursor-pointer"
                        >
                          <Upload className="w-12 h-12 mx-auto text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Upload Resume
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF, max 5MB
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) =>
                          handleFileUpload(e.target.files[0], "resume")
                        }
                        accept=".pdf"
                        className="hidden"
                      />
                    </div>

                    {uploadStatus.resume.loading && (
                      <div className="text-blue-600 text-sm flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </div>
                    )}
                    {uploadStatus.resume.error && (
                      <p className="text-red-600 text-sm">
                        {uploadStatus.resume.error}
                      </p>
                    )}
                  </div>

                  {/* Portfolio Links */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Portfolio Links
                    </label>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          value={formData.links.linkedin}
                          onChange={(e) =>
                            updateFormData("links", "linkedin", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          GitHub Profile
                        </label>
                        <input
                          type="url"
                          value={formData.links.github}
                          onChange={(e) =>
                            updateFormData("links", "github", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                          placeholder="https://github.com/yourusername"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Portfolio Website
                        </label>
                        <input
                          type="url"
                          value={formData.links.portfolio}
                          onChange={(e) =>
                            updateFormData("links", "portfolio", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences - Step 7 */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-legpro-primary rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Job Preferences
                    </h2>
                    <p className="text-gray-600">What are you looking for?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Job Types
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        "Full-time",
                        "Part-time",
                        "Contract",
                        "Freelance",
                        "Internship",
                        "Remote",
                      ].map((type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.preferences.jobTypes.includes(
                              type
                            )}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...formData.preferences.jobTypes, type]
                                : formData.preferences.jobTypes.filter(
                                    (t) => t !== type
                                  );
                              updateFormData(
                                "preferences",
                                "jobTypes",
                                updated
                              );
                            }}
                            className="rounded border-gray-300 text-legpro-primary focus:ring-legpro-primary"
                          />
                          <span className="text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Work Shifts
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {["Day Shift", "Night Shift", "Flexible"].map((shift) => (
                        <label
                          key={shift}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.preferences.workShifts.includes(
                              shift
                            )}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...formData.preferences.workShifts, shift]
                                : formData.preferences.workShifts.filter(
                                    (s) => s !== shift
                                  );
                              updateFormData(
                                "preferences",
                                "workShifts",
                                updated
                              );
                            }}
                            className="rounded border-gray-300 text-legpro-primary focus:ring-legpro-primary"
                          />
                          <span className="text-sm text-gray-700">{shift}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error/Success Messages */}
          {(uploadStatus.submit?.error || uploadStatus.submit?.success) && (
            <div className="px-8 py-4 border-t border-gray-200">
              {uploadStatus.submit?.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Error submitting profile</span>
                  </div>
                  <p className="text-red-700 mt-2">{uploadStatus.submit.error}</p>
                </div>
              )}
              
              {uploadStatus.submit?.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Profile submitted successfully!</span>
                  </div>
                  <p className="text-green-700 mt-2">Your profile has been created and saved.</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="bg-gray-50 px-8 py-6 flex justify-between items-center rounded-b-2xl">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-legpro-primary text-white rounded-lg font-medium hover:bg-legpro-primary-hover transition-all shadow-md hover:shadow-lg"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleFormSubmit}
                  disabled={uploadStatus.submit?.loading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadStatus.submit?.loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Submit Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
