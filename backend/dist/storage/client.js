// MinIO Storage Client (S3-Compatible)
// October 2025 - AWS SDK v3
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, CreateBucketCommand, HeadBucketCommand, } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
// S3 Client Configuration
export const s3Client = new S3Client({
    endpoint: env.MINIO_ENDPOINT,
    region: 'us-east-1', // MinIO doesn't use regions but SDK requires it
    credentials: {
        accessKeyId: env.MINIO_ACCESS_KEY,
        secretAccessKey: env.MINIO_SECRET_KEY,
    },
    forcePathStyle: true, // Required for MinIO
});
const BUCKET_NAME = env.MINIO_BUCKET_NAME;
// Ensure bucket exists on startup
export async function initializeBucket() {
    try {
        // Check if bucket exists
        await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`✅ MinIO bucket "${BUCKET_NAME}" exists`);
    }
    catch (error) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            // Create bucket if it doesn't exist
            await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
            console.log(`✅ Created MinIO bucket "${BUCKET_NAME}"`);
        }
        else {
            console.error('❌ Error checking/creating bucket:', error);
            throw error;
        }
    }
}
export async function uploadImage(options) {
    const { buffer, contentType, userId, originalName } = options;
    // Generate unique filename
    const ext = originalName?.split('.').pop() || 'jpg';
    const key = `images/${userId || 'anonymous'}/${uuidv4()}.${ext}`;
    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            Metadata: {
                uploadedAt: new Date().toISOString(),
                userId: userId || 'anonymous',
                originalName: originalName || 'unknown',
            },
        }));
        console.log(`✅ Image uploaded: ${key}`);
        return key;
    }
    catch (error) {
        console.error('❌ Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
}
// Get presigned URL for image (valid for 1 hour)
export async function getImageUrl(key, expiresIn = 3600) {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        return url;
    }
    catch (error) {
        console.error('❌ Error generating presigned URL:', error);
        throw new Error('Failed to generate image URL');
    }
}
// Get image directly (for serving)
export async function getImage(key) {
    try {
        const response = await s3Client.send(new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        }));
        return {
            body: response.Body,
            contentType: response.ContentType || 'image/jpeg',
        };
    }
    catch (error) {
        console.error('❌ Error fetching image:', error);
        throw new Error('Failed to fetch image');
    }
}
// Delete image
export async function deleteImage(key) {
    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        }));
        console.log(`✅ Image deleted: ${key}`);
    }
    catch (error) {
        console.error('❌ Error deleting image:', error);
        throw new Error('Failed to delete image');
    }
}
// Check if image exists
export async function imageExists(key) {
    try {
        await s3Client.send(new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        }));
        return true;
    }
    catch (error) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            return false;
        }
        throw error;
    }
}
// Health check
export async function checkStorageHealth() {
    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        return true;
    }
    catch (error) {
        console.error('❌ Storage health check failed:', error);
        return false;
    }
}
console.log('✅ MinIO storage client initialized');
//# sourceMappingURL=client.js.map