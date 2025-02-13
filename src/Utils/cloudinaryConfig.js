import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

export const uploadResult = async (url) =>
  await cloudinary.uploader.upload(url).catch((error) => {
    console.log(error);
  });

// export const optimizeUrl = (id) => {
//   cloudinary.url(id, {
//     fetch_format: "auto",
//     quality: "auto",
//   });
// };

export default cloudinary;
