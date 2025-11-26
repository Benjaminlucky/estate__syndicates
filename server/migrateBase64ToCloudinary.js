import mongoose from "mongoose";
import Project from "./models/Project.js";
import cloudinary from "./config/cloudinary.js";
import dotenv from "dotenv";
dotenv.config();

const migrateImages = async () => {
  await mongoose.connect(process.env.MONGO);
  console.log("Connected to MongoDB...");

  const projects = await Project.find({});
  let updatedCount = 0;

  for (const project of projects) {
    if (project.image && project.image.startsWith("data:image")) {
      try {
        console.log(`Uploading project: ${project.title}`);

        // Upload base64 to Cloudinary
        const uploadRes = await cloudinary.uploader.upload(project.image, {
          folder: "projects",
        });

        // Replace base64 with secure Cloudinary URL
        project.image = uploadRes.secure_url;
        await project.save();
        updatedCount++;

        console.log(`Migrated: ${project.title}`);
      } catch (err) {
        console.error(`Error for ${project.title}:`, err.message);
      }
    }
  }

  console.log(`Migration complete! Updated ${updatedCount} projects.`);
  process.exit();
};

migrateImages();
