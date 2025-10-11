import React, { useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { Cookie, Settings, Eye, Target } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white">
      <div className="">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
              <Cookie className="w-6 h-6 text-amber-800" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Cookie Policy
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Understanding how we use cookies to enhance your experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-12">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100 mb-6">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            This Cookie Policy explains how <strong className="text-amber-800">Job Mela</strong> uses cookies
            and similar technologies to recognize you when you visit our website. It explains what these
            technologies are and why we use them, as well as your rights to control our use of them.
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <Cookie className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  What Are Cookies?
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Cookies are small data files that are placed on your computer or mobile device when you
                  visit a website. Cookies are widely used by website owners to make their websites work,
                  or to work more efficiently, as well as to provide reporting information and enhance your
                  overall browsing experience.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-4 h-4 text-amber-800" />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  How We Use Cookies
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  We use cookies for several important reasons:
                </p>
                <div className="grid gap-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Improving Website Functionality</h3>
                      <p className="text-gray-600 text-sm">
                        Essential cookies help our website work properly and enable basic functions like page navigation and access to secure areas.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Remembering Your Preferences</h3>
                      <p className="text-gray-600 text-sm">
                        Preference cookies allow our website to remember information that changes the way the site behaves or looks, such as your preferred language or region.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Understanding User Behavior</h3>
                      <p className="text-gray-600 text-sm">
                        Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Serving Relevant Content</h3>
                      <p className="text-gray-600 text-sm">
                        Marketing cookies are used to track visitors across websites and serve relevant job listings and advertisements tailored to your interests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <Settings className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Your Choices
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  You have the right to decide whether to accept or reject cookies. You can exercise your
                  cookie preferences by clicking on the appropriate opt-out links provided in the cookie
                  banner or by adjusting your browser settings.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  Most web browsers allow you to control cookies through their settings preferences. However,
                  if you limit the ability of websites to set cookies, you may worsen your overall user
                  experience, as some features may not function properly.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-gray-700">
                    <strong className="text-amber-800">Please note:</strong> Disabling cookies may affect
                    your user experience and limit access to certain features on our website.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <Eye className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  If you have any questions about our use of cookies or other technologies, please contact
                  us at <a href="mailto:support@jobmela.com" className="text-amber-800 font-medium hover:underline">support@jobmela.com</a>
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* <div className="mt-8 text-center text-xs text-gray-500">
          Last updated: October 3, 2025
        </div> */}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default CookiePolicy;