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
