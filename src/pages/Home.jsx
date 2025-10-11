import React from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import JobListing from "../Components/Jobs/JobListing";
import AppDownload from "../Components/AppDownload";
import Footer from "../Components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <div id="job-listing">
        <JobListing />
      </div>
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;
