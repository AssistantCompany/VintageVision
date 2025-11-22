import { S3Client } from '@aws-sdk/client-s3';
export declare const s3Client: S3Client;
export declare function initializeBucket(): Promise<void>;
export interface UploadImageOptions {
    buffer: Buffer;
    contentType: string;
    userId?: string;
    originalName?: string;
}
export declare function uploadImage(options: UploadImageOptions): Promise<string>;
export declare function getImageUrl(key: string, expiresIn?: number): Promise<string>;
export declare function getImage(key: string): Promise<{
    body: any;
    contentType: string;
}>;
export declare function deleteImage(key: string): Promise<void>;
export declare function imageExists(key: string): Promise<boolean>;
export declare function checkStorageHealth(): Promise<boolean>;
//# sourceMappingURL=client.d.ts.map