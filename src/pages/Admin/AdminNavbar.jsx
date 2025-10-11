import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { AppContext } from "../../context/AppContext";
const backendUrl = import.meta.env?.VITE_API_URL;

const Navbar = () => {
  const [totalUser,setTotalUser] = useState(0);
  const { isAdminSidebar, setIsAdminSidebar,setIsAdminAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsAdminSidebar((prev) => !prev);

  useEffect(()=>{
    const count = async ()=>{

      try {
        const response = await axios.get(`${backendUrl}/api/admin/all-users`)
        setTotalUser(response.data.users.length)
        
        
        
      } catch (error) {
        console.error('Failed to fetch user count:', error);
      }
      
    }
    count();
  })

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Logged out successfully");
        
        localStorage.removeItem("boolAP");
        setIsAdminAuthenticated(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-900 to-gray-900 text-white shadow-md p-4 flex items-center justify-between">
      {/* Mobile Menu Icon */}
      <button
        className="md:hidden block absolute left-4 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 active:scale-95 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Logo */}
      <div className="mx-auto md:ml-0 text-2xl font-bold tracking-wide text-center md:text-left">
        <span className="text-orange-400">Job</span> Mela{" "}
        <span className="text-sm font-light">Admin Panel</span>
      </div>

      {/* Logout Button */}
      <div className="w-56 flex  items-center">
        <h4 className="text-gray-500 mr-2">Total User : {totalUser}</h4>
      <button
        onClick={handleLogout}
        className="absolute right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
      >
        Logout
      </button>

        
      </div>
    </nav>
  );
};

export default Navbar;
