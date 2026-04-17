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
      formData.personalInfo.dateOfBirth,
      formData.personalInfo.gender,
      formData.address.current.city,
      formData.address.current.state,
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
  const transformAPIDataToForm = (profileData, userData = null) => {
    // Parse name from userData if available
    const userFirstName = userData?.name?.split(' ')[0] || '';
    const userLastName = userData?.name?.split(' ').slice(1).join(' ') || '';
    
    return {
      personalInfo: {
        // Prioritize userData for name and email, fallback to profileData
        firstName: userFirstName || profileData.firstName || '',
        lastName: userLastName || profileData.lastName || '',
        middleName: profileData.middleName || '',
        email: userData?.email || profileData.email || '',
        phone: profileData.phone || '',
        alternatePhone: profileData.alternatePhone || '',
        dateOfBirth: profileData.dateOfBirth || '',
        gender: profileData.gender || '',
        maritalStatus: profileData.maritalStatus || '',
        nationality: profileData.nationality || 'Indian',
        fatherName: profileData.fatherName || '',
        aadharNumber: profileData.aadharNumber || '',
        // Prioritize userData image, then profilePicture, then documents.profilePicture
        profileImage: userData?.image || profileData.profilePicture || profileData.documents?.profilePicture || null,
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
      education: profileData.education && Object.keys(profileData.education).length > 0 ? Object.values(profileData.education).map(edu => ({
        type: edu.instituteType || '',
        institution: edu.instituteFields?.instituteName || '',
        degree: edu.instituteFields?.courseName || '',
        field: edu.instituteFields?.specialization || '',
        year: edu.instituteFields?.passingYear || '',
        percentage: edu.instituteFields?.percentage || '',
        courseType: edu.instituteFields?.courseType || 'Full Time',
        duration: edu.instituteFields?.courseDuration || '',
        trade: edu.instituteFields?.trade || '',
        universityNotInList: false
      })) : [{
        type: "",
        institution: "",
        degree: "",
        field: "",
        year: "",
        percentage: "",
        courseType: "Full Time",
        universityNotInList: false
      }],
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

  // Fetch current user data (for prefilling name and email)
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/users/user');
      
      if (response.data.success && response.data.user) {
        return response.data.user;
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
    return null;
  };

  // Fetch existing profile data
  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      
      // First fetch current user data
      const userData = await fetchCurrentUser();
      
      // Then fetch profile data
      const response = await axios.get('/api/profile/get-user');
      
      if (response.data.success && response.data.profile) {
        const transformedData = transformAPIDataToForm(response.data.profile, userData);
        setFormData(transformedData);
      } else if (userData) {
        // If no profile exists but we have user data, prefill basic info
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            firstName: userData.name?.split(' ')[0] || '',
            lastName: userData.name?.split(' ').slice(1).join(' ') || '',
            email: userData.email || '',
            profileImage: userData.image || null,
          }
        }));
      }
    } catch (error) {
      // If no profile exists, that's fine - user is creating new profile
      if (error.response?.status !== 404) {
        console.error('Error fetching profile:', error);
      }
      
      // Still try to prefill user data even if profile fetch fails
      const userData = await fetchCurrentUser();
      if (userData) {
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            firstName: userData.name?.split(' ')[0] || '',
            lastName: userData.name?.split(' ').slice(1).join(' ') || '',
            email: userData.email || '',
            profileImage: userData.image || null,
          }
        }));
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
                      <span className="text-xs text-gray-500 ml-2">(From your account)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.personalInfo.email}
                        readOnly
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        placeholder="your.email@example.com"
                      />
                      <div className="absolute right-3 top-3.5">
                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Email cannot be changed as it's linked to your account
                    </p>
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
              <div className="space-y-8">
                <div className="bg-blue-50 border-b-4 border-blue-200 p-4 rounded-t-xl mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Current Location</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      State : <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Andaman And Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
                        "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", 
                        "Himachal Pradesh", "Jammu And Kashmir", "Jharkhand", "Karnataka", "Kerala", 
                        "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", 
                        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
                        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
                        "Dadra And Nagar Haveli And Daman And Diu", "Tripura", "Uttarakhand", 
                        "Uttar Pradesh", "West Bengal"
                      ].map((state) => (
                        <button
                          key={state}
                          onClick={() => updateNestedData("address", "current", "state", state)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            formData.address.current.state === state
                              ? "bg-legpro-primary border-legpro-primary text-white shadow-md scale-105"
                              : "bg-white border-gray-200 text-gray-600 hover:border-legpro-primary/30"
                          }`}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 max-w-md">
                    <label className="block text-sm font-semibold text-gray-700">
                      District : <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.address.current.city}
                      onChange={(e) => updateNestedData("address", "current", "city", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary"
                    >
                      <option value="">Select District</option>
                      {/* Normally you'd filter districts by state, here we'll provide some defaults or keep it simple */}
                      <option value="Gautam Buddha Nagar">Gautam Buddha Nagar</option>
                      <option value="Ghaziabad">Ghaziabad</option>
                      <option value="Gurugram">Gurugram</option>
                      <option value="Faridabad">Faridabad</option>
                      <option value="North Delhi">North Delhi</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 border-b-4 border-blue-200 p-4 rounded-t-xl mt-12 mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Preferred Location(s)</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Preferred Locations :
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Noida", "Sonipat", "Pune", "Assam"].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            const current = formData.professional.preferredLocations || [];
                            const updated = current.includes(loc)
                              ? current.filter(l => l !== loc)
                              : [...current, loc];
                            updateFormData("professional", "preferredLocations", updated);
                          }}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            formData.professional.preferredLocations?.includes(loc)
                              ? "bg-legpro-primary border-legpro-primary text-white shadow-md"
                              : "bg-white border-gray-200 text-gray-600 hover:border-legpro-primary/30"
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                      <button className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 text-sm font-medium hover:border-legpro-primary hover:text-legpro-primary transition-all">
                        + Add More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Education - Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="bg-blue-50 border-b-4 border-blue-200 p-4 rounded-t-xl mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Qualification Details</h2>
                </div>

                <div className="space-y-12">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="relative group p-6 border-2 border-gray-100 rounded-2xl bg-gray-50/30 hover:bg-white hover:border-legpro-primary/20 transition-all">
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-legpro-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">
                        {index + 1}
                      </div>
                      
                      {formData.education.length > 1 && (
                        <button
                          onClick={() => removeArrayItem("education", index)}
                          className="absolute -top-4 -right-4 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center border border-gray-200 shadow-md hover:bg-red-50 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      <div className="space-y-8">
                        {/* Education Level Selection */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            Education : <span className="text-red-500">*</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {["Below 10 Pass", "10th Pass", "12th Pass", "ITI", "Diploma", "Graduate", "Post Graduate"].map((level) => (
                              <button
                                key={level}
                                onClick={() => {
                                  const updated = [...formData.education];
                                  updated[index].type = level;
                                  // Auto-fill degree if it's a pass level
                                  if (level.includes("Pass")) updated[index].degree = level;
                                  setFormData(prev => ({ ...prev, education: updated }));
                                }}
                                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                  edu.type === level
                                    ? "bg-legpro-primary border-legpro-primary text-white shadow-md scale-105"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-legpro-primary/30"
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                          {/* University/Institution */}
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">
                              University/Institution/College:
                            </label>
                            <div className="space-y-2">
                              {edu.universityNotInList ? (
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) => {
                                    const updated = [...formData.education];
                                    updated[index].institution = e.target.value;
                                    setFormData(prev => ({ ...prev, education: updated }));
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary"
                                  placeholder="Enter your institution name"
                                />
                              ) : (
                                <select
                                  value={edu.institution}
                                  onChange={(e) => {
                                    const updated = [...formData.education];
                                    updated[index].institution = e.target.value;
                                    setFormData(prev => ({ ...prev, education: updated }));
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary"
                                >
                                  <option value="">Select University</option>
                                  <option value="Amity University">Amity University</option>
                                  <option value="Delhi University">Delhi University</option>
                                  <option value="IGNOU">IGNOU</option>
                                  <option value="IIT">IIT</option>
                                  <option value="NIT">NIT</option>
                                </select>
                              )}
                              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={edu.universityNotInList || false}
                                  onChange={(e) => {
                                    const updated = [...formData.education];
                                    updated[index].universityNotInList = e.target.checked;
                                    setFormData(prev => ({ ...prev, education: updated }));
                                  }}
                                  className="rounded border-gray-300 text-legpro-primary focus:ring-legpro-primary"
                                />
                                check(✓) if university not in the list
                              </label>
                            </div>

                            {/* Passing Year */}
                            <div className="space-y-3 pt-4">
                              <label className="block text-sm font-semibold text-gray-700">
                                Passing Year: <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={edu.year}
                                onChange={(e) => {
                                  const updated = [...formData.education];
                                  updated[index].year = e.target.value;
                                  setFormData(prev => ({ ...prev, education: updated }));
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary"
                              >
                                <option value="">Select Year</option>
                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Specialization */}
                            <div className="space-y-3 pt-4">
                              <label className="block text-sm font-semibold text-gray-700">
                                Specialization (Field of Study) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={edu.field}
                                onChange={(e) => {
                                  const updated = [...formData.education];
                                  updated[index].field = e.target.value;
                                  setFormData(prev => ({ ...prev, education: updated }));
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g., Computer Science, Marketing"
                              />
                            </div>
                          </div>

                          {/* Course Type Selection */}
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">
                              Course Type:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {["Full Time", "Part Time", "Correspondance"].map((type) => (
                                <button
                                  key={type}
                                  onClick={() => {
                                    const updated = [...formData.education];
                                    updated[index].courseType = type;
                                    setFormData(prev => ({ ...prev, education: updated }));
                                  }}
                                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                    edu.courseType === type
                                      ? "bg-legpro-primary border-legpro-primary text-white shadow-sm"
                                      : "bg-white border-gray-200 text-gray-600 hover:border-legpro-primary/30"
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() =>
                        addArrayItem("education", {
                          degree: "",
                          field: "",
                          institution: "",
                          year: "",
                          percentage: "",
                          type: "",
                          courseType: "Full Time",
                          universityNotInList: false
                        })
                      }
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add More Qualification
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Experience - Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="bg-blue-50 border-b-4 border-blue-200 p-4 rounded-t-xl mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Experience Details</h2>
                </div>

                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => {
                      updateFormData("professional", "workExperience", "Fresher");
                      setFormData(prev => ({ ...prev, experience: [] }));
                    }}
                    className={`px-6 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.professional.workExperience === "Fresher"
                        ? "bg-legpro-primary border-legpro-primary text-white shadow-md"
                        : "bg-white border-gray-200 text-gray-600 hover:border-legpro-primary/30"
                    }`}
                  >
                    I am a fresher
                  </button>
                  <button
                    onClick={() => {
                      if (formData.professional.workExperience === "Fresher") {
                        updateFormData("professional", "workExperience", "");
                      }
                    }}
                    className={`px-6 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.professional.workExperience !== "Fresher"
                        ? "bg-legpro-primary border-legpro-primary text-white shadow-md"
                        : "bg-white border-gray-200 text-gray-600 hover:border-legpro-primary/30"
                    }`}
                  >
                    I have experience
                  </button>
                </div>

                {formData.professional.workExperience !== "Fresher" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Total Year's of Experience : <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.professional.workExperience}
                          onChange={(e) => updateFormData("professional", "workExperience", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary"
                        >
                          <option value="">Total Experience</option>
                          <option value="1-2 years">1-2 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="6-10 years">6-10 years</option>
                          <option value="10+ years">10+ years</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Company Name : <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.professional.currentCompany}
                          onChange={(e) => updateFormData("professional", "currentCompany", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary outline-none"
                          placeholder="Your current or last company"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Job Title : <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.professional.currentJobTitle}
                          onChange={(e) => updateFormData("professional", "currentJobTitle", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary outline-none"
                          placeholder="Your designation"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Working Since (Month & Year) :
                        </label>
                        <div className="flex gap-2">
                          <select className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary">
                            <option value="">Select Month</option>
                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary">
                            <option value="">Select Year</option>
                            {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Current CTC (Lakhs) :
                        </label>
                        <select
                          value={formData.professional.currentSalary}
                          onChange={(e) => updateFormData("professional", "currentSalary", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary"
                        >
                          <option value="">Select Annual CTC Lakhs</option>
                          {Array.from({ length: 100 }, (_, i) => i + 1).map(l => (
                            <option key={l} value={`${l} Lakhs`}>{l} Lakhs</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Expected CTC (Lakhs) :
                        </label>
                        <select
                          value={formData.professional.expectedSalary}
                          onChange={(e) => updateFormData("professional", "expectedSalary", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-legpro-primary"
                        >
                          <option value="">Select Annual CTC Lakhs</option>
                          {Array.from({ length: 100 }, (_, i) => i + 1).map(l => (
                            <option key={l} value={`${l} Lakhs`}>{l} Lakhs</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 max-w-xs">
                      <label className="block text-sm font-semibold text-gray-700">
                        Notice Period : <span className="text-red-500 text-xs">(In Days)</span>
                      </label>
                      <input
                        type="number"
                        value={formData.professional.noticePeriod}
                        onChange={(e) => updateFormData("professional", "noticePeriod", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legpro-primary outline-none"
                        placeholder="0"
                      />
                    </div>

                    {/* Additional Experience History List */}
                    <div className="pt-8 space-y-4">
                      {formData.experience.map((exp, index) => (
                        <div key={index} className="p-4 border-2 border-gray-100 rounded-xl bg-gray-50/50">
                           <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-700">Experience {index + 1}</h4>
                            <button onClick={() => removeArrayItem('experience', index)} className="text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...formData.experience];
                                newExp[index].company = e.target.value;
                                setFormData(prev => ({ ...prev, experience: newExp }));
                              }}
                              className="px-3 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              placeholder="Job Title"
                              value={exp.position}
                              onChange={(e) => {
                                const newExp = [...formData.experience];
                                newExp[index].position = e.target.value;
                                setFormData(prev => ({ ...prev, experience: newExp }));
                              }}
                              className="px-3 py-2 border rounded-lg"
                            />
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-end">
                        <button
                          onClick={() => addArrayItem('experience', {
                            company: '',
                            position: '',
                            startDate: '',
                            endDate: '',
                            description: '',
                            currentlyWorking: false
                          })}
                          className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                        >
                          <Plus className="w-5 h-5" />
                          Add Experience Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {formData.professional.workExperience === "Fresher" && (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center animate-fadeIn">
                    <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No experience details needed for freshers.</p>
                    <p className="text-sm text-gray-400 mt-2">You can proceed to the next step.</p>
                  </div>
                )}
              </div>
            )}

            {/* Skills - Step 4 */}
            {currentStep === 4 && (
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

            {/* Portfolio & Documents - Step 5 */}
            {currentStep === 5 && (
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

            {/* Preferences - Step 6 */}
            {currentStep === 6 && (
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
