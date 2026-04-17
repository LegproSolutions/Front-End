import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/axiosConfig";
import { AppContext } from "../context/AppContext";
import { Users, Building2, Briefcase } from "lucide-react";

const AnimatedCounter = ({ value, formatNumber, loading }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (loading || !value) return;

        let startTime = null;
        const duration = 2000; // 2 seconds animation
        const startValue = 0;
        const endValue = value;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Easing function: easeOutExpo (makes it feel more "premium")
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            setDisplayValue(Math.floor(easeOutExpo * (endValue - startValue) + startValue));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, loading]);

    if (loading) return "0";
    return formatNumber(displayValue);
};

const PlatformStats = () => {
    const { backendUrl } = useContext(AppContext);
    const [stats, setStats] = useState({
        jobseekers: 0,
        companies: 0,
        jobs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/stats`);
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Error fetching platform stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [backendUrl]);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    const statItems = [
        {
            label: "Registered Jobseekers",
            value: stats.jobseekers,
            icon: <Users className="w-8 h-8 text-white" />,
            color: "bg-blue-900"
        },
        {
            label: "Employers With Us",
            value: stats.companies,
            icon: <Building2 className="w-8 h-8 text-white" />,
            color: "bg-blue-900"
        },
        {
            label: "Job Opportunities",
            value: stats.jobs,
            icon: <Briefcase className="w-8 h-8 text-white" />,
            color: "bg-blue-900"
        }
    ];

    return (
        <section className="pb-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statItems.map((item, index) => (
                        <div 
                            key={index}
                            className="flex items-center justify-between p-6 bg-blue-50/50 border border-blue-100 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex flex-col ml-6">
                                <span className="text-3xl font-bold text-gray-900">
                                    <AnimatedCounter 
                                        value={item.value} 
                                        loading={loading} 
                                        formatNumber={formatNumber} 
                                    />
                                </span>
                                <span className="text-sm font-medium text-blue-800">
                                    {item.label}
                                </span>
                            </div>
                            <div className={`p-4 rounded-2xl ${item.color} mr-2 shadow-lg`}>
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlatformStats;
