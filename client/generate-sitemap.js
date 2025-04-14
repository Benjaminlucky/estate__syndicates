// generate-sitemap.js
import sitemap from "sitemap";
import { createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

const { SitemapStream } = sitemap;
const pipelineAsync = promisify(pipeline);

const hostname = "https://yourdomain.com"; // 🔁 Change this to your domain

const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/company", changefreq: "monthly", priority: 0.8 },
  { url: "/projects", changefreq: "monthly", priority: 0.8 },
  { url: "/how-it-works", changefreq: "monthly", priority: 0.7 },
  { url: "/reach-us", changefreq: "monthly", priority: 0.7 },
  { url: "/signup", changefreq: "yearly", priority: 0.5 },
  { url: "/login", changefreq: "yearly", priority: 0.5 },
  { url: "/admin", changefreq: "yearly", priority: 0.3 },
];

const sitemapStream = new SitemapStream({ hostname });
const writeStream = createWriteStream("./public/sitemap.xml");

(async () => {
  // Add links to the sitemap stream
  links.forEach((link) => sitemapStream.write(link));

  // Finish writing and close the stream
  sitemapStream.end();

  // Pipe the sitemap into the output file
  await pipelineAsync(sitemapStream, writeStream);

  console.log("✅ Sitemap successfully generated at public/sitemap.xml");
})();
