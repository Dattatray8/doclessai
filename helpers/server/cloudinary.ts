'use server'

import {v2 as cloudinary} from "cloudinary";

export type CloudinaryResponse =
    | { success: true; url: string }
    | { success: false; message: string };

export const cloudinaryPipeline = async (
    cloudName: string,
    apiKey: string,
    apiSecret: string,
    file: Blob
): Promise<CloudinaryResponse> => {

    if (!cloudName || !apiKey || !apiSecret) {
        return {success: false, message: "Please fill all fields"};
    }

    if (!file) {
        return {success: false, message: "File not found"};
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {resource_type: "auto"},
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (result?.secure_url) {
                        resolve(result.secure_url);
                    } else {
                        reject("Upload failed");
                    }
                }
            );

            uploadStream.end(buffer);
        });

        return {success: true, url: result};

    } catch (error) {
        console.error(error);
        return {success: false, message: "Upload failed"};
    }
};