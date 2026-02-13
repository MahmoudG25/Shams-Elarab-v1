import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn("Cloudinary keys are missing! Check .env file.");
}

/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback for upload progress
 * @returns {Promise<Object>} The Cloudinary response data
 */
export const uploadDetails = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  // Detect resource type
  const resourceType = file.type.startsWith('video') ? 'video' : 'image';

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) onProgress(percentCompleted);
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Cloudinary Upload Error Details:', error.response.data);
    } else {
      console.error('Cloudinary Upload Error:', error);
    }
    throw new Error(error.response?.data?.error?.message || error.message);
  }
};
