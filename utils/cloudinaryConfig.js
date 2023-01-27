import cloudinary from "cloudinary";

export const cloudinaryConfig = () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const uploader = async (path, folder) => {
  return await cloudinary.v2.uploader.upload(path, {
    folder: folder,
  });
};

export const destroy = async (public_id) => {
  return await cloudinary.v2.uploader.destroy(public_id);
};
