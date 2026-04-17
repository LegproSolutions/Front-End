import React from 'react';
import { assets } from '../assets/assets';

const CompanyRibbon = () => {
  const logos = [
    { name: 'UEL', lg: assets.uel_logo },
    { name: 'Veira', lg: assets.veira_logo },
    { name: 'New Holland', lg: assets.new_holland_logo },
    { name: 'Lava', lg: assets.lava_logo },
    { name: 'ITC', lg: assets.itc_logo },
    { name: 'SMR', lg: assets.smr_logo },
    { name: 'Overdrive', lg: assets.overdrive_logo },
  ];

  return (
    <div className="w-full bg-[#0F3B7A] py-16 overflow-hidden mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <p className="text-sm font-semibold text-white/70 tracking-[0.3em] uppercase mb-2">
            Trusted by Industry Leaders
          </p>
          <div className="h-1 w-12 bg-white/20 rounded-full"></div>
        </div>

        {/* Scrolling Ribbon Wrapper */}
        <div className="relative group">
          <div className="flex animate-scroll whitespace-nowrap items-center">
            {/* First set of logos */}
            <div className="flex items-center gap-24 md:gap-40 px-20">
              {logos.map((logo, index) => (
                <div
                  key={`logo-1-${index}`}
                  className="flex-shrink-0 opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                >
                  <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors">
                    <img
                      src={logo.lg}
                      alt={logo.name}
                      className="h-10 md:h-12 w-auto object-contain filter brightness-110"
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Duplicate set for seamless looping */}
            <div className="flex items-center gap-24 md:gap-40 px-20">
              {logos.map((logo, index) => (
                <div
                  key={`logo-2-${index}`}
                  className="flex-shrink-0 opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                >
                  <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors">
                    <img
                      src={logo.lg}
                      alt={logo.name}
                      className="h-10 md:h-12 w-auto object-contain filter brightness-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default CompanyRibbon;
