// src/pages/NotFound.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black-900 overflow-hidden relative flex items-center justify-center">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] bg-golden-500/10 rounded-full blur-[120px] animate-blob-slow"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 0.3s ease-out, top 0.3s ease-out",
          }}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-golden-600/5 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-golden-400/8 rounded-full blur-[100px] animate-blob-reverse"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180, 125, 73, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(180, 125, 73, 0.3) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-2 h-2 bg-golden-400/30 rounded-full animate-float-particle"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-golden-500/20 rounded-full animate-float-particle-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-golden-300/40 rounded-full animate-float-particle-slow"></div>
          <div className="absolute bottom-32 right-1/3 w-2.5 h-2.5 bg-golden-400/25 rounded-full animate-float-particle"></div>
        </div>

        {/* 404 Number - Large and Animated */}
        <div className="relative mb-8">
          <h1 className="text-[180px] md:text-[280px] font-black text-transparent bg-clip-text bg-gradient-to-br from-golden-400 via-golden-500 to-golden-600 leading-none animate-glitch-text select-none">
            404
          </h1>

          {/* Glitch layers */}
          <h1
            className="absolute inset-0 text-[180px] md:text-[280px] font-black text-golden-500/10 leading-none select-none animate-glitch-1"
            aria-hidden="true"
          >
            404
          </h1>
          <h1
            className="absolute inset-0 text-[180px] md:text-[280px] font-black text-golden-400/10 leading-none select-none animate-glitch-2"
            aria-hidden="true"
          >
            404
          </h1>

          {/* Decorative lines */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-golden-500/30 to-transparent animate-scan-line"></div>
        </div>

        {/* Title with animation */}
        <h2 className="text-3xl md:text-5xl font-bold text-golden-100 mb-4 animate-fade-in-up">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-golden-300/70 mb-12 max-w-2xl mx-auto animate-fade-in-up-delayed">
          The page you're looking for seems to have wandered off into the
          digital void. Let's get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-more-delayed">
          {/* Primary button - Go Home */}
          <button
            onClick={() => navigate("/")}
            className="group relative px-8 py-4 bg-gradient-to-r from-golden-500 to-golden-600 text-black-900 font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-golden-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-golden-400 to-golden-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Go Home</span>
            </div>
          </button>

          {/* Secondary button - Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="group px-8 py-4 bg-black-800 border-2 border-golden-500/30 text-golden-200 font-bold text-lg rounded-xl hover:border-golden-400/50 hover:bg-black-700 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Go Back</span>
            </div>
          </button>
        </div>

        {/* Additional helpful links */}
        <div className="mt-16 animate-fade-in-up-latest">
          <p className="text-sm text-golden-400/50 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/projects")}
              className="text-golden-300/70 hover:text-golden-200 text-sm transition-colors duration-300 hover:underline underline-offset-4"
            >
              Projects
            </button>
            <span className="text-golden-500/30">•</span>
            <button
              onClick={() => navigate("/how-it-works")}
              className="text-golden-300/70 hover:text-golden-200 text-sm transition-colors duration-300 hover:underline underline-offset-4"
            >
              How It Works
            </button>
            <span className="text-golden-500/30">•</span>
            <button
              onClick={() => navigate("/reach-us")}
              className="text-golden-300/70 hover:text-golden-200 text-sm transition-colors duration-300 hover:underline underline-offset-4"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="fixed top-0 left-0 w-40 h-40 border-t-2 border-l-2 border-golden-500/10 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-40 h-40 border-t-2 border-r-2 border-golden-500/10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-40 h-40 border-b-2 border-l-2 border-golden-500/10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-40 h-40 border-b-2 border-r-2 border-golden-500/10 pointer-events-none"></div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
            opacity: 0.5;
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.4;
          }
        }

        @keyframes blob-slow {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes blob-reverse {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          33% {
            transform: translate(-30px, 50px) scale(1.1);
            opacity: 0.3;
          }
          66% {
            transform: translate(20px, -20px) scale(0.9);
            opacity: 0.5;
          }
        }

        @keyframes float-particle {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(10px, -20px);
            opacity: 0.7;
          }
        }

        @keyframes float-particle-delayed {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }
          50% {
            transform: translate(-15px, -25px);
            opacity: 0.6;
          }
        }

        @keyframes float-particle-slow {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.4;
          }
          50% {
            transform: translate(8px, -30px);
            opacity: 0.8;
          }
        }

        @keyframes glitch-text {
          0%,
          100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }

        @keyframes glitch-1 {
          0%,
          100% {
            transform: translate(0);
            opacity: 0.1;
          }
          10% {
            transform: translate(-5px, 0);
            opacity: 0.15;
          }
          20% {
            transform: translate(5px, 0);
            opacity: 0.1;
          }
        }

        @keyframes glitch-2 {
          0%,
          100% {
            transform: translate(0);
            opacity: 0.1;
          }
          15% {
            transform: translate(3px, 3px);
            opacity: 0.12;
          }
          25% {
            transform: translate(-3px, -3px);
            opacity: 0.1;
          }
        }

        @keyframes scan-line {
          0% {
            top: 0%;
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 10s infinite ease-in-out;
        }

        .animate-blob-slow {
          animation: blob-slow 3s infinite ease-in-out;
        }

        .animate-blob-reverse {
          animation: blob-reverse 12s infinite ease-in-out;
        }

        .animate-float-particle {
          animation: float-particle 4s infinite ease-in-out;
        }

        .animate-float-particle-delayed {
          animation: float-particle-delayed 5s infinite ease-in-out;
          animation-delay: 1s;
        }

        .animate-float-particle-slow {
          animation: float-particle-slow 6s infinite ease-in-out;
        }

        .animate-glitch-text {
          animation: glitch-text 5s infinite;
        }

        .animate-glitch-1 {
          animation: glitch-1 3s infinite;
        }

        .animate-glitch-2 {
          animation: glitch-2 4s infinite;
        }

        .animate-scan-line {
          animation: scan-line 4s infinite linear;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-more-delayed {
          animation: fade-in-up 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-latest {
          animation: fade-in-up 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
