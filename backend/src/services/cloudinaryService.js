import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'nepal-bhumi/properties',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

export const uploadImages = async (files) => {
  if (!files || files.length === 0) {
    console.warn('No files provided for upload');
    return [];
  }

  try {
    console.log('🔍 uploadImages called with', files.length, 'files');
    console.log('Environment check:', {
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME ? '✓ SET' : '✗ MISSING',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '✓ SET' : '✗ MISSING',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✓ SET' : '✗ MISSING',
    });

    const uploadPromises = files.map((file, index) =>
      new Promise((resolve, reject) => {
        console.log(`📤 [${index + 1}/${files.length}] Uploading: ${file.originalname}`);
        
        try {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'nepal-bhumi/properties',
              resource_type: 'auto',
              timeout: 60000,
            },
            (error, result) => {
              if (error) {
                console.error(`❌ [${index + 1}/${files.length}] Upload failed:`, error.message);
                reject(new Error(`Upload failed: ${error.message}`));
              } else {
                console.log(`✅ [${index + 1}/${files.length}] Success: ${result.public_id}`);
                resolve(result);
              }
            }
          );

          stream.on('error', (err) => {
            console.error(`❌ [${index + 1}/${files.length}] Stream error:`, err.message);
            reject(new Error(`Stream error: ${err.message}`));
          });

          stream.end(file.buffer);
        } catch (err) {
          console.error(`❌ [${index + 1}/${files.length}] Exception:`, err.message);
          reject(err);
        }
      })
    );

    const results = await Promise.all(uploadPromises);
    console.log(`✅ All ${results.length} images uploaded successfully`);
    return results;
  } catch (error) {
    console.error('❌ Cloudinary batch upload error:', error.message);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};
