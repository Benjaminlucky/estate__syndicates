import { FaCoins } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { PiShareNetworkBold } from "react-icons/pi";
import { FaTrophy } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { MdMarkEmailRead } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { FaPiggyBank } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";

import { FaXTwitter } from "react-icons/fa6";

export const mainNav = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Our Company",
    link: "/company",
  },
  {
    name: "Projects",
    link: "/projects",
  },
  {
    name: "How it Works",
    link: "/how-it-works",
  },
  {
    name: "Reach Us",
    link: "/reach-us",
  },
];

export const accountLink = [
  {
    name: "Sign up",
    link: "/signup",
  },
  {
    name: "Log In",
    link: "/login",
  },
];

export const legallink = [
  {
    name: "Privacy Policy",
    link: "#",
  },
  {
    name: "Terms and Condition",
    link: "#",
  },
];

export const social = [
  {
    social: FaFacebook,
    link: "#",
  },
  {
    social: IoLogoInstagram,
    link: "#",
  },
  {
    social: FaXTwitter,
    link: "#",
  },
];

export const perk = [
  {
    name: "Accessibility",
    text: "Affordable entry points allow investors from all backgrounds to participate in lucrative real estate opportunities.",
    icon: FaCoins,
  },
  {
    name: "Transparency",
    text: "Enjoy clear, data-driven insights and full visibility into every project, ensuring confidence in your investments.",
    icon: FiSearch,
  },
  {
    name: "Collaboration",
    text: "Affordable entry points allow investors from all backgrounds to participate in lucrative real estate opportunities.",
    icon: PiShareNetworkBold,
  },
  {
    name: "Premium Opportunities",
    text: "Enjoy clear, data-driven insights and full visibility into every project, ensuring confidence in your investments.",
    icon: FaTrophy,
  },
];

export const homeProject = [
  {
    image: "/assets/pristine.jpg",
    name: "Pristine Residences",
    Status: "Fully Syndicated",
    purpose: "Short-let Apartments",
    Return: "20% P.A",
    Duration: "Cycle 1 (2/5)",
    link: "/",
  },
  {
    image: "/assets/4bedroom.jpg",
    name: "4 Bedroom Fully Detached Duplex",
    Status: "Closed",
    purpose: "Build and Sell",
    Return: "40%",
    Duration: "Investment Season 1/1",
    link: "/",
  },
  {
    image: "/assets/blocksflat.jpg",
    name: "Blocks of Flats Badore",
    Status: "Fully Syndicated",
    purpose: "Shortlet Apartments",
    Return: "Estimated 30% P.A",
    Duration: "Investment Season 0/5",
    link: "/",
  },
];

export const homeBenefits = [
  {
    title: "Access to Exclusive Real Estate Deals",
    text: "Gain entry to premium, high-value real estate projects that are typically reserved for institutional investors or high networth individuals.",
  },
  {
    title: "Lower Entry Barriers with Fractional Ownership",
    text: "Invest without the need for large upfront capital. With our fractional ownership model, you can own a share of lucrative properties at an affordable cost.",
  },
  {
    title: "Diversify Your Investment Portfolio",
    text: "We prioritize your trust by providing clear insights, data driven projections, and a secure platform for managing your investments.",
  },
  {
    title: "Transparent and Secure Platform",
    text: "We prioritize your trust by providing clear insights, data-driven projections, and a secure platform for managing your investments.",
  },
];

export const homeReviews = [
  {
    image: "/assets/investor1.jpg",
    name: "Chimezie O.",
    location: "(Lagos Nigeria)",
    social: IoLogoInstagram,
    mail: MdMarkEmailRead,
    review:
      "Joining Estate Syndicates was a turning point for me. The fractional ownership model made real estate investment easy, and my returns have been consistent!",
  },
  {
    image: "/assets/investor2.jpg",
    name: "Chibuike O.",
    location: "(Enugu Nigeria)",
    social: IoLogoInstagram,
    mail: MdMarkEmailRead,
    review:
      "I love the transparency Estate Syndicates offers. The detailed project insights and secure platform give me confidence in every investment I make.",
  },
  {
    image: "/assets/investor3.jpg",
    name: "Victor T.",
    location: "(Mary U.S.A)",
    social: IoLogoInstagram,
    mail: MdMarkEmailRead,
    review:
      "Real estate seemed out of reach until I discovered Estate Syndicates. Now, I’m part of a thriving community and earning steady returns on my investments!",
  },
  {
    image: "/assets/investor4.jpg",
    name: "Omasiri U.",
    location: "(Tennessee U.S.A)",
    social: IoLogoInstagram,
    mail: MdMarkEmailRead,
    review:
      "Estate Syndicates is perfect for anyone new to real estate. The team’s support and the platform’s simplicity make investing enjoyable and rewarding",
  },
  {
    image: "/assets/investor5.jpg",
    name: "Udoka O.",
    location: "(Birmingham England)",
    social: IoLogoInstagram,
    mail: MdMarkEmailRead,
    review:
      "Pooling resources with like-minded investors has been empowering. Estate Syndicates opened doors to opportunities I never imagined I could access.",
  },
  {
    image: "/assets/investor6.jpg",
    name: "Emeka A.",
    location: "(Glasgow Scotland)",
    social: IoLogoInstagram,
    mail: MdMarkEmailRead,
    review:
      "Joining Estate Syndicates was a game-changer for me. The seamless process, expert guidance, and consistent returns made real estate investing both simple and rewarding.",
  },
];

export const homeprocess = [
  {
    name: "Sign Up",
    icon: FaUserCircle,
  },
  {
    name: "Choose a Project",
    icon: GiMagnifyingGlass,
  },
  {
    name: "Invest Together",
    icon: FaUsers,
  },
  {
    name: "Earn Returns",
    icon: FaPiggyBank,
  },
];
