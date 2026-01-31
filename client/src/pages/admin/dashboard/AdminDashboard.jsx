// src/pages/Dashboard.jsx
import DashboardLayout from "./DashboardLayout";
import ReportCard from "./ReportCard";
import StatCard from "./StatCard";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black-900">
      {/* Cleaner ambient background with better contrast */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-golden-500/5 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-golden-600/3 rounded-full blur-[120px] animate-pulse-slower"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6 md:p-8 max-w-[1600px] mx-auto">
        {/* Top Report Cards - Clean & High Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Investment Card with Mini Bar Chart */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-500/10 to-golden-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl"></div>
            <ReportCard
              title="Total Amount Invested"
              value="₦3,755,000"
              className="min-h-56 bg-black-800 border-2 border-golden-500/20 hover:border-golden-400/40 transition-all duration-500 backdrop-blur-sm relative overflow-hidden shadow-2xl"
            >
              {/* Mini bar chart visualization */}
              <div className="flex items-end gap-1 h-12 mt-4 mb-2">
                <div
                  className="w-full bg-golden-500/20 rounded-t animate-grow-bar"
                  style={{ height: "60%", animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-full bg-golden-500/30 rounded-t animate-grow-bar"
                  style={{ height: "80%", animationDelay: "100ms" }}
                ></div>
                <div
                  className="w-full bg-golden-400/40 rounded-t animate-grow-bar"
                  style={{ height: "100%", animationDelay: "200ms" }}
                ></div>
                <div
                  className="w-full bg-golden-500/30 rounded-t animate-grow-bar"
                  style={{ height: "70%", animationDelay: "300ms" }}
                ></div>
                <div
                  className="w-full bg-golden-500/20 rounded-t animate-grow-bar"
                  style={{ height: "50%", animationDelay: "400ms" }}
                ></div>
              </div>
              <div className="text-xs text-golden-200/70 font-medium">
                Sum of all investments made
              </div>

              {/* Animated decorative element */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 border-2 border-golden-500/10 rounded-full animate-ping-slow"></div>
            </ReportCard>
          </div>

          {/* Portfolio Value Card with Line Graph */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-400/15 to-golden-500/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl"></div>
            <ReportCard
              title="Current Portfolio Value"
              value="₦60,768,990"
              className="min-h-56 bg-gradient-to-br from-golden-900/20 to-black-800 border-2 border-golden-400/30 hover:border-golden-300/50 transition-all duration-500 backdrop-blur-sm shadow-2xl shadow-golden-500/10 relative overflow-hidden"
            >
              {/* Mini line graph */}
              <div className="relative h-12 mt-4 mb-2 overflow-hidden">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="rgba(180, 125, 73, 0.3)" />
                      <stop offset="50%" stopColor="rgba(180, 125, 73, 0.6)" />
                      <stop offset="100%" stopColor="rgba(180, 125, 73, 0.3)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,30 L 20,25 L 40,15 L 60,20 L 80,10 L 100,8"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    className="animate-draw-line"
                  />
                  <path
                    d="M 0,30 L 20,25 L 40,15 L 60,20 L 80,10 L 100,8 L 100,40 L 0,40 Z"
                    fill="url(#lineGradient)"
                    opacity="0.2"
                    className="animate-draw-fill"
                  />
                </svg>
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-golden-400/20 border border-golden-400/30 rounded text-xs text-golden-300 font-bold animate-fade-in-up">
                  ↑ 24.5%
                </div>
              </div>
              <div className="text-xs text-golden-100/80 font-medium">
                Realtime value of investment
              </div>
            </ReportCard>
          </div>

          {/* Pending Returns Card with Radial Progress */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-300/12 to-golden-500/6 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl"></div>
            <ReportCard
              title="Pending Returns / Payouts"
              value="₦8,129,900"
              className="min-h-56 bg-black-800 border-2 border-golden-500/20 hover:border-golden-400/40 transition-all duration-500 backdrop-blur-sm relative overflow-hidden shadow-2xl"
            >
              {/* Radial progress indicator */}
              <div className="flex items-center gap-4 mt-4 mb-2">
                <div className="relative w-16 h-16">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(180, 125, 73, 0.1)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(180, 125, 73, 0.8)"
                      strokeWidth="3"
                      strokeDasharray="12, 100"
                      className="animate-draw-circle"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-golden-300">
                    12%
                  </div>
                </div>
                <div>
                  <div className="inline-block px-3 py-1 bg-golden-500/20 border border-golden-400/40 rounded-full animate-fade-in-up">
                    <span className="text-xs font-bold text-golden-200">
                      ROI
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-golden-200/70 font-medium">
                Upcoming ROI
              </div>
            </ReportCard>
          </div>
        </div>

        {/* Stat Cards Row - Cleaner with Better Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Projects Count Card */}
          <div className="group relative overflow-hidden rounded-2xl">
            <StatCard
              title="Projects & Investment"
              value="8"
              className="min-h-56 bg-black-800 border-2 border-golden-500/20 hover:border-golden-400/40 hover:shadow-2xl hover:shadow-golden-500/10 transition-all duration-500"
            />
            {/* Animated corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-golden-500/20 group-hover:border-golden-400/40 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-golden-500/10 group-hover:border-golden-400/30 transition-all duration-500"></div>
          </div>

          {/* Updates Card - Brightest Golden */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-400 via-golden-500 to-golden-600 animate-gradient-shift"></div>
            <StatCard
              title="Projects Updates & Reports"
              value="—"
              className="min-h-56 shadow-2xl shadow-golden-500/20 hover:shadow-golden-400/30 transition-all duration-500 relative bg-transparent"
            />
            {/* Floating particles effect */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-float"></div>
            <div
              className="absolute top-12 right-8 w-1.5 h-1.5 bg-white/30 rounded-full animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-8 right-16 w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          {/* Financial Statements Card - Mid Golden */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-600 via-golden-700 to-golden-600 animate-gradient-shift-slow"></div>
            <StatCard
              title="Monthly/Quarterly Financial Statements"
              value="—"
              className="min-h-56 shadow-2xl shadow-golden-600/25 hover:shadow-golden-500/35 transition-all duration-500 relative bg-transparent"
            />
            {/* Pulse rings */}
            <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white/20 rounded-full animate-ping-slow"></div>
          </div>

          {/* Milestones Card - Darkest Golden */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-800 via-golden-900 to-black-700 animate-gradient-shift"></div>
            <StatCard
              title="Constructions / Development Milestones"
              value="—"
              className="min-h-56 border-2 border-golden-700/40 shadow-2xl shadow-golden-800/20 hover:shadow-golden-700/30 transition-all duration-500 relative bg-transparent"
            />
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(180, 125, 73, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(180, 125, 73, 0.3) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
        </div>

        {/* Bottom Cards - Clean with Icons and Progress Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Operational Expense */}
          <div className="group rounded-2xl bg-black-800 border-2 border-golden-700/30 p-6 min-h-56 hover:border-golden-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-golden-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-800/0 via-transparent to-golden-900/10 group-hover:from-golden-800/5 group-hover:to-golden-900/15 transition-all duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-golden-600/20 border-2 border-golden-500/30 flex items-center justify-center mb-4 group-hover:bg-golden-500/30 group-hover:border-golden-400/50 transition-all duration-500 group-hover:scale-110">
                <svg
                  className="w-7 h-7 text-golden-300 group-hover:text-golden-200 transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-golden-100 font-bold text-lg mb-2 group-hover:text-golden-50 transition-colors duration-500">
                Operational Expense
              </h3>
              <p className="text-golden-300/60 text-sm mb-4">
                Track daily operations
              </p>

              {/* Mini progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-golden-300/50 mb-1">
                  <span>Monthly Budget</span>
                  <span>68%</span>
                </div>
                <div className="h-1.5 bg-golden-900/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-golden-600 to-golden-400 rounded-full animate-progress-bar"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Cost */}
          <div className="group rounded-2xl bg-black-800 border-2 border-golden-700/30 p-6 min-h-56 hover:border-golden-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-golden-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-800/0 via-transparent to-golden-900/10 group-hover:from-golden-800/5 group-hover:to-golden-900/15 transition-all duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-golden-600/20 border-2 border-golden-500/30 flex items-center justify-center mb-4 group-hover:bg-golden-500/30 group-hover:border-golden-400/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <svg
                  className="w-7 h-7 text-golden-300 group-hover:text-golden-200 transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-golden-100 font-bold text-lg mb-2 group-hover:text-golden-50 transition-colors duration-500">
                Maintenance Cost
              </h3>
              <p className="text-golden-300/60 text-sm mb-4">
                Asset upkeep monitoring
              </p>

              {/* Status indicators */}
              <div className="flex gap-2">
                <div className="flex-1 h-12 bg-golden-700/20 rounded-lg flex items-center justify-center border border-golden-600/20">
                  <div className="text-center">
                    <div className="text-xs text-golden-400/60">Active</div>
                    <div className="text-sm font-bold text-golden-200">3</div>
                  </div>
                </div>
                <div className="flex-1 h-12 bg-golden-700/10 rounded-lg flex items-center justify-center border border-golden-600/10">
                  <div className="text-center">
                    <div className="text-xs text-golden-400/50">Pending</div>
                    <div className="text-sm font-bold text-golden-300/70">
                      1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Taxes / Legal Fees */}
          <div className="group rounded-2xl bg-black-800 border-2 border-golden-700/30 p-6 min-h-56 hover:border-golden-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-golden-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-800/0 via-transparent to-golden-900/10 group-hover:from-golden-800/5 group-hover:to-golden-900/15 transition-all duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-golden-600/20 border-2 border-golden-500/30 flex items-center justify-center mb-4 group-hover:bg-golden-500/30 group-hover:border-golden-400/50 transition-all duration-500 group-hover:scale-110">
                <svg
                  className="w-7 h-7 text-golden-300 group-hover:text-golden-200 transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-golden-100 font-bold text-lg mb-2 group-hover:text-golden-50 transition-colors duration-500">
                Taxes / Legal Fees
              </h3>
              <p className="text-golden-300/60 text-sm mb-4">
                Compliance & obligations
              </p>

              {/* Compliance status */}
              <div className="flex items-center gap-2 px-3 py-2 bg-golden-700/20 border border-golden-600/30 rounded-lg">
                <div className="w-2 h-2 bg-golden-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-golden-200 font-medium">
                  All filings up to date
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Details */}
          <div className="group rounded-2xl bg-black-800 border-2 border-golden-700/30 p-6 min-h-56 hover:border-golden-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-golden-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-800/0 via-transparent to-golden-900/10 group-hover:from-golden-800/5 group-hover:to-golden-900/15 transition-all duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-golden-600/20 border-2 border-golden-500/30 flex items-center justify-center mb-4 group-hover:bg-golden-500/30 group-hover:border-golden-400/50 transition-all duration-500 group-hover:scale-110">
                <svg
                  className="w-7 h-7 text-golden-300 group-hover:text-golden-200 transition-colors duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-golden-100 font-bold text-lg mb-2 group-hover:text-golden-50 transition-colors duration-500">
                Revenue Details
              </h3>
              <p className="text-golden-300/60 text-sm mb-4">
                Income streams analysis
              </p>

              {/* Mini donut chart representation */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="rgba(180, 125, 73, 0.1)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="rgba(180, 125, 73, 0.6)"
                      strokeWidth="4"
                      strokeDasharray="75 25"
                      className="animate-draw-circle"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-golden-200">
                    75%
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-golden-300/60">
                    Active streams
                  </div>
                  <div className="text-sm font-bold text-golden-200">
                    3 of 4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes grow-bar {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes draw-line {
          from {
            stroke-dasharray: 0 200;
          }
          to {
            stroke-dasharray: 200 0;
          }
        }

        @keyframes draw-fill {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.2;
          }
        }

        @keyframes draw-circle {
          from {
            stroke-dasharray: 0 100;
          }
          to {
            stroke-dasharray: 75 25;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.8;
          }
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-shift-slow {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes progress-bar {
          from {
            width: 0%;
          }
          to {
            width: 68%;
          }
        }

        .animate-grow-bar {
          animation: grow-bar 1s ease-out forwards;
          transform-origin: bottom;
        }

        .animate-draw-line {
          animation: draw-line 2s ease-out forwards;
        }

        .animate-draw-fill {
          animation: draw-fill 2s ease-out forwards;
        }

        .animate-draw-circle {
          animation: draw-circle 1.5s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .animate-gradient-shift-slow {
          background-size: 200% 200%;
          animation: gradient-shift-slow 12s ease infinite;
        }

        .animate-progress-bar {
          animation: progress-bar 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
