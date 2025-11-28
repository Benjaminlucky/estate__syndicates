import axios from "axios";

const origin = window.location.origin;
let BASE_URL = "";

/* ---------------------------------------------
   LOCAL DEVELOPMENT (Vite on port 5173)
---------------------------------------------- */
if (origin.includes("localhost:5173") || origin.includes("127.0.0.1:5173")) {
  BASE_URL = "http://localhost:5000"; // local backend
} else if (
  /* ---------------------------------------------
   PRODUCTION LIVE WEBSITE
---------------------------------------------- */
  origin.includes("estatesindicates.com") || // main domain
  origin.includes("www.estatesindicates.com") || // www version
  origin.includes("estatesyndicates.netlify.app") // Netlify (if used)
) {
  BASE_URL = "https://estate-syndicates.onrender.com"; // backend on Render
} else {
  /* ---------------------------------------------
   FALLBACK
---------------------------------------------- */
  BASE_URL = "https://estate-syndicates.onrender.com";
}

export const api = axios.create({
  baseURL: BASE_URL,
});

console.log("API USING:", BASE_URL);
