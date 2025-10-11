import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Shield, Database, Lock, RefreshCw, Mail, FileText } from 'lucide-react';

const PrivacyInfo = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
                <Shield className="w-6 h-6 text-amber-800" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Privacy Policy
              </h1>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Your privacy is important to us. Learn how we protect your data
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-12">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100 mb-6">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              At <strong className="text-amber-800">Job Mela</strong>, we are committed to protecting your
              personal information and your right to privacy. This Privacy Policy describes how we collect,
              use, and protect your information when you use our platform.
            </p>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <Database className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Information We Collect
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    We may collect personal information such as your name, email address, phone number,
                    resume, and job preferences when you register or apply for jobs on our platform.
                    This information helps us provide you with the best job matching experience.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-amber-800" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    How We Use Your Information
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                    We use your information for the following purposes:
                  </p>
                  <div className="grid gap-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Job Matching</h3>
                        <p className="text-gray-600 text-sm">
                          To match you with relevant job opportunities that align with your skills, experience, and preferences.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Communication</h3>
                        <p className="text-gray-600 text-sm">
                          To communicate with you about job opportunities, application status, and platform updates.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Service Improvement</h3>
                        <p className="text-gray-600 text-sm">
                          To improve our services, enhance user experience, and develop new features for the platform.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Legal Compliance</h3>
                        <p className="text-gray-600 text-sm">
                          To comply with legal obligations and protect against fraudulent or illegal activities.
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
                  <Lock className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Data Protection
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                    Your data is securely stored, and we do not sell your information to third parties.
                    We implement appropriate technical and organizational measures to safeguard your
                    personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                    <p className="text-xs text-gray-700">
                      <strong className="text-amber-800">Security Commitment:</strong> We use industry-standard
                      encryption and security protocols to protect your data at all times.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <RefreshCw className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Changes to This Policy
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    We may update our Privacy Policy from time to time to reflect changes in our practices
                    or for legal and regulatory reasons. All changes will be posted on this page, and we
                    encourage you to review this policy periodically.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-amber-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Contact Us
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    If you have any questions about our Privacy Policy or how we handle your data, please
                    contact us at <a href="mailto:support@jobmela.com" className="text-amber-800 font-medium hover:underline">support@jobmela.com</a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyInfo;