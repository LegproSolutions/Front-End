import React, { useState, useContext } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Users,
  Building,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
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

  const jobTitles = [
    ...new Set(homeJobs.map((job) => job.title).filter(Boolean)),
  ];
  const jobLocations = [
    ...new Set([
      ...homeJobs.map((job) => job.location).filter(Boolean),
      ...JobLocations,
    ]),
  ];

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Remote",
    "Internship",
  ];

  const handleSearch = () => {
    const searchFilters = {
      title: titleInput,
      location: locationInput,
      jobType: selectedJobType,
    };

    setSearchFilter(searchFilters);
    setIsSearched(true);

    document.querySelector("#job-listing")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const features = [
    "Advanced job matching algorithm",
    "Direct employer connections",
    "24/7 application support",
    "Career guidance & tips",
  ];

  return (
    <div className="relative min-h-screen bg-gray-50">

      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Section */}
          <div className="space-y-8">

            <div className="space-y-4">
              <Badge
                variant="outline"
                className="w-fit text-legpro-primary border-legpro-primary"
              >
                🚀 India's Leading Job Portal
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find Your
                <span className="text-legpro-primary"> Dream Job</span>
                <br />
                Today
              </h1>

              <p className="text-xl text-gray-600 max-w-lg">
                Connect with top employers and discover opportunities that match
                your skills. Join thousands of professionals who found their
                perfect career with Job Mela.
              </p>
            </div>

            {/* Search Card */}
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur">
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-legpro-accent" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-legpro-primary hover:bg-legpro-primary/90"
              onClick={() =>
                document.querySelector("#job-listing")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Browse All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </div>

          {/* Right Section */}
          <div className="relative">
            <div className="relative bg-legpro-primary/10 rounded-3xl p-8">
              <img
                src="/professional-businesswoman.jpg"
                alt="Indian business professional smiling"
                loading="eager"
                className="w-full h-auto max-w-md mx-auto scale-150 -translate-x-10 rounded-2xl"
              />

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
      </div>
    </div>
  );
};

export default Hero;
