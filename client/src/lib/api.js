// lib/api.js - FIXED VERSION
import axios from "axios";

const origin = window.location.origin;
let BASE_URL = "";

/* ---------------------------------------------
   LOCAL DEVELOPMENT (Vite on port 5173)
---------------------------------------------- */
if (origin.includes("localhost:5173") || origin.includes("127.0.0.1:5173")) {
  BASE_URL = "http://localhost:5000"; // REMOVED trailing slash and /api
} else if (
  /* ---------------------------------------------
   PRODUCTION LIVE WEBSITE
---------------------------------------------- */
  origin.includes("estatesindicates.com") ||
  origin.includes("www.estatesindicates.com") ||
  origin.includes("estatesyndicates.netlify.app")
) {
  BASE_URL = "https://estate-syndicates.onrender.com"; // REMOVED /api
} else {
  /* ---------------------------------------------
   FALLBACK
---------------------------------------------- */
  BASE_URL = "https://estate-syndicates.onrender.com"; // REMOVED /api
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("API USING:", BASE_URL);
