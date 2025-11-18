import axios from "axios";

const origin = window.location.origin;
let BASE_URL = "";

/* ---------------------------------------------
   LOCAL DEVELOPMENT (Vite on port 5173)
---------------------------------------------- */
if (origin.includes("localhost:5173")) {
  BASE_URL = "http://localhost:5000"; // backend
} else if (
  /* ---------------------------------------------
   PRODUCTION LIVE WEBSITES (frontend)
---------------------------------------------- */
  origin.includes("estatesindicates.com") ||
  origin.includes("estatesyndicates.netlify.app")
) {
  BASE_URL = "https://estate-syndicates.onrender.com"; // backend
} else {
  /* ---------------------------------------------
   FALLBACK (safe)
---------------------------------------------- */
  BASE_URL = "https://estate-syndicates.onrender.com";
}

export const api = axios.create({
  baseURL: BASE_URL,
});

console.log("API USING:", BASE_URL);
