// UserProfileForm.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import UserProfilePagination from "./UserProfilePagination";
import toast from "react-hot-toast";
import computeProfileCompletion from "../../utils/profileCompletion";

const UserProfileForm = () => {
  const navigate = useNavigate();
  const {
    isUserAuthenticated,
    userData,
    setUserData,
    profileCompletion,
    setProfileCompletion,
  } = useContext(AppContext);
  const formRef = useRef();
  const backendUrl = import.meta.env?.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    aadharNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    education: {
      "10th": {
        instituteType: "10th",
        instituteFields: {
          instituteName: "",
          certificationBody: "",
          passingYear: "",
          percentage: "",
          courseType: "",
        },
      },
    },
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    skills: [],
    languages: [
      {
        name: "",
        proficiency: "",
      },
    ],
    resume: "",
    profilePicture: "",
  });

  // Update global profileCompletion in context whenever formData or userData change
  useEffect(() => {
    // Merge userData and formData so edited values reflect immediately
    const merged = {
      ...(userData || {}),
      ...(formData || {}),
      address: { ...(userData?.address || {}), ...(formData?.address || {}) },
      education: {
        ...(userData?.education || {}),
        ...(formData?.education || {}),
      },
      experience:
        formData?.experience && formData.experience.length
          ? formData.experience
          : userData?.experience,
      skills:
        formData?.skills && formData.skills.length
          ? formData.skills
          : userData?.skills,
    };

    const computed = computeProfileCompletion(merged);
    setProfileCompletion?.(computed);
  }, [formData, userData, setProfileCompletion]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isUserAuthenticated) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/profile/get-user`);

        if (response.data.success) {
          // If the fetched profile has no education data, preserve your default education state.
          setFormData((prev) => ({
            ...response.data.profile,
            education: response.data.profile.education || prev.education,
          }));
          setUserData(response.data.profile);
        } else {
          console.error("Failed to fetch profile:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchProfile();
  }, [navigate, isUserAuthenticated, setUserData, backendUrl]);

  const updateEducationData = (newEducationData) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        education: newEducationData,
      };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    // Step 0: Field Validations
    const onlyLettersRegex = /^[A-Za-z ]+$/;

    // First Name
    if (formData.firstName.length < 2) {
      toast.error("First name must be at least 2 characters long.");
      return;
    }
    if (!onlyLettersRegex.test(formData.firstName)) {
      toast.error("First name must contain only alphabets (A-Z, a-z).");
      return;
    }

    // Last Name
    if (formData.lastName.length < 2) {
      toast.error("Last name must be at least 2 characters long.");
      return;
    }
    if (!onlyLettersRegex.test(formData.lastName)) {
      toast.error("Last name must contain only alphabets (A-Z, a-z).");
      return;
    }

    // Father Name
    if (formData.fatherName.length < 2) {
      toast.error("Father's name must be at least 2 characters long.");
      return;
    }
    if (!onlyLettersRegex.test(formData.fatherName)) {
      toast.error("Father's name must contain only alphabets (A-Z, a-z).");
      return;
    }

    // Phone
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    // Aadhar Number
    if (!/^\d{12}$/.test(formData.aadharNumber)) {
      toast.error("Aadhar number must be exactly 12 digits.");
      return;
    }

    try {
      setLoading(true);

      // Send the profile data to the API endpoint
      const response = await axios.post(
        `${backendUrl}/api/profile/create`,
        formData
      );

      if (response.data.success) {
        setUserData(response.data.profile);
        toast.success("Profile updated successfully!");
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        console.warn("Failed to update profile:", response.data.message);
        toast.error("Failed to update profile: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Standard handleChange for non-nested fields
  const handleChange = (e, section = null, index = null) => {
    const { name, value } = e.target;
    if (section) {
      if (index !== null) {
        setFormData((prev) => ({
          ...prev,
          [section]: prev[section].map((item, i) =>
            i === index
              ? {
                  ...item,
                  [name]:
                    name === "startDate" ||
                    name === "endDate" ||
                    name === "dateOfBirth"
                      ? new Date(value).toISOString().split("T")[0]
                      : value,
                }
              : item
          ),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]:
              name === "startDate" ||
              name === "endDate" ||
              name === "dateOfBirth"
                ? new Date(value).toISOString().split("T")[0]
                : value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "startDate" || name === "endDate" || name === "dateOfBirth"
            ? new Date(value).toISOString().split("T")[0]
            : value,
      }));
    }
  };

  // Experience handling functions
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((item, i) =>
        i === index
          ? {
              ...item,
              [name]:
                name === "startDate" || name === "endDate"
                  ? new Date(value).toISOString().split("T")[0]
                  : value,
            }
          : item
      ),
    }));
  };

  // Skills handling functions
  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const addSkill = () => {
    const newSkill = prompt("Enter a new skill:");
    if (newSkill && newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pb-16">
      {/* Progress Indicator */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Complete Your Profile
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-40 bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-400 h-2 rounded-full"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {profileCompletion}%
            </span>
          </div>
        </div>
        <p className="text-gray-600">
          Fill out all sections to maximize your job matching potential and
          showcase your professional profile.
        </p>
      </div>

      <UserProfilePagination 
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        updateEducationData={updateEducationData}
        handleExperienceChange={handleExperienceChange}
        addExperience={addExperience}
        removeExperience={removeExperience}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default UserProfileForm;