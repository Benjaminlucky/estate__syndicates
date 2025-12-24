// middleware/uploadInvoice.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const invoiceStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "expenses/invoices",
    resource_type: "auto", // IMPORTANT: allows pdf + images
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
  },
});

const uploadInvoice = multer({ storage: invoiceStorage });

export default uploadInvoice;
