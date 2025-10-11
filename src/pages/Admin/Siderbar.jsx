import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { UserCheck, Briefcase, User } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { isAdminSidebar } = useContext(AppContext);

  const tabs = [
    {
      name: "Verify Recruiter",
      icon: <UserCheck className="w-5 h-5" />,
      value: "recruiters",
    },
    {
      name: "Verify Job Posts",
      icon: <Briefcase className="w-5 h-5" />,
      value: "jobs",
    },
    {
      name: "All Users",
      icon: <User className="w-5 h-5" />,
      value: "all_user",
    },
    {
      name: "All Recruiter",
      icon: <User className="w-5 h-5" />,
      value: "all_recruiter",
    },
    // Credit system removed
  ];

  return (
    <div
      className={`
        w-64  bg-blue-950 text-white p-4  min-h-[100vh] z-40 fixed top-14 md:relative transition-transform duration-300
        ${isAdminSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >
      <div className="text-2xl font-bold mb-6 tracking-wide">
        Job Mela Admin
      </div>
      <div className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
              activeTab === tab.value
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-800 hover:text-white text-gray-300"
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
