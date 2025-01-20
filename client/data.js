import { FaCoins } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { PiShareNetworkBold } from "react-icons/pi";
import { FaTrophy } from "react-icons/fa6";

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
