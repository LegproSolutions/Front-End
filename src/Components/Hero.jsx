import React, { useState, useContext } from "react";
import { Search, MapPin, Briefcase, TrendingUp, Users, Building, Star, ArrowRight, CheckCircle } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { JobLocations, assets } from "../assets/assets";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

const Hero = () => {
  const {
    setSearchFilter,
    setIsSearched,
    homeJobs = [],
  } = useContext(AppContext);

  const [titleInput, setTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  // Get job titles and locations from available jobs
  const jobTitles = [...new Set(homeJobs.map(job => job.title).filter(Boolean))];
  const jobLocations = [...new Set([...homeJobs.map(job => job.location).filter(Boolean), ...JobLocations])];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

  const handleSearch = () => {
    const searchFilters = {
      title: titleInput,
      location: locationInput,
      jobType: selectedJobType,
    };
    
    setSearchFilter(searchFilters);
    setIsSearched(true);
    
    // Scroll to job listing section
    document.querySelector('#job-listing')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Sample statistics (you can replace with real data)
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: homeJobs.length || "1000+", color: "text-legpro-primary" },
    { icon: Users, label: "Job Seekers", value: "50K+", color: "text-green-600" },
    { icon: Building, label: "Companies", value: "500+", color: "text-purple-600" },
    { icon: CheckCircle, label: "Success Rate", value: "95%", color: "text-orange-600" },
  ];

  const features = [
    "Advanced job matching algorithm",
    "Direct employer connections", 
    "24/7 application support",
    "Career guidance & tips"
  ];

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Headlines */}
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit text-legpro-primary border-legpro-primary">
                🚀 India's Leading Job Portal
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find Your
                <span className="text-legpro-primary">
                  {" "}Dream Job
                </span>
                <br />
                Today
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Connect with top employers and discover opportunities that match your skills. 
                Join thousands of professionals who found their perfect career with Job Mela.
              </p>
            </div>

            {/* Search Bar */}
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur">
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Job Title Search */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Job title or keyword"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 text-base"
                      list="job-titles"
                    />
                    <datalist id="job-titles">
                      {jobTitles.map((title, index) => (
                        <option key={index} value={title} />
                      ))}
                    </datalist>
                  </div>

                  {/* Location Search */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Location"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 text-base"
                      list="job-locations"
                    />
                    <datalist id="job-locations">
                      {jobLocations.map((location, index) => (
                        <option key={index} value={location} />
                      ))}
                    </datalist>
                  </div>

               
                </div>
                
                <Button 
                  onClick={handleSearch}
                  className="w-full h-12 text-base font-semibold bg-legpro-primary hover:bg-legpro-primary-hover text-white"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Jobs
                </Button>
              </div>
            </Card>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-legpro-accent flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-legpro-primary hover:bg-legpro-primary/90"
                onClick={() => document.querySelector('#job-listing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            {/* Main Illustration */}
            <div className="relative bg-legpro-primary/10 rounded-3xl p-8">
            <img
  src="https://img.freepik.com/premium-photo/young-happy-indian-businessman-smiling-with-arms-crossed_251136-50289.jpg"
  alt="Indian business professional smiling for job search banner"
  className="w-full h-auto max-w-md mx-auto scale-150 -translate-x-10"
/>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Job Match</p>
                    <p className="text-xs text-gray-500">95% Success</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-legpro-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Career Growth</p>
                    <p className="text-xs text-gray-500">Fast Track</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-0 bg-white/60 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <Icon className={cn("w-8 h-8 mx-auto mb-3", stat.color)} />
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Popular Job Categories */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Job Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore opportunities across different industries and find the perfect match for your skills.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Technology", count: "150+ jobs", icon: "💻" },
              { name: "Healthcare", count: "80+ jobs", icon: "🏥" },
              { name: "Finance", count: "120+ jobs", icon: "💰" },
              { name: "Marketing", count: "90+ jobs", icon: "📈" },
              { name: "Engineering", count: "200+ jobs", icon: "⚙️" },
              { name: "Education", count: "60+ jobs", icon: "📚" },
            ].map((category, index) => (
              <Card 
                key={index} 
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 bg-white/80 backdrop-blur"
                onClick={() => {
                  setTitleInput(category.name);
                  handleSearch();
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
