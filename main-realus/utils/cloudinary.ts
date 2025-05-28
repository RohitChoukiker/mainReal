import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dtqz9u6wz',
  api_key: '733734289237976',
  api_secret: 'iEm8BWHpaFHo9bP4kYOxsi0xLDc'
});

/**
 * Uploads a file to Cloudinary
 * @param buffer The file buffer to upload
 * @param folder The folder to upload to
 * @param publicId The public ID to use for the file
 * @param metadata Optional metadata to attach to the upload
 * @returns The Cloudinary upload result
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
  publicId: string,
  metadata: Record<string, any> = {}
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // Automatically detect resource type
        public_id: publicId,
        context: metadata, // Add metadata as context
        tags: metadata.tags || [], // Add tags if provided
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

export default cloudinary;