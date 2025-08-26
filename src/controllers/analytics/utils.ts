import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.BUCKET_NAME || "";
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "", // Replace with your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function appendStringToFileInS3(fileName, stringToAppend) {
  try {
    // 1. Get the existing object
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });
    const { Body } = await s3Client.send(getObjectCommand);

    let existingContent = "";
    if (Body) {
      existingContent = await Body.transformToString(); // Convert stream to string
    }

    // 2. Append the new string
    const newContent = existingContent + "\n" + stringToAppend;

    // 3. Upload the modified content back to S3
    const putObjectCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: newContent,
      ContentType: "text/plain", // Adjust ContentType as needed
    });
    const result = await s3Client.send(putObjectCommand);
  } catch (error) {
    console.error("Error appending string to S3 file:", error);
    throw error;
  }
}

export async function fetchFileInS3(fileName): Promise<string | null> {
  try {
    // 1. Get the existing object
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });
    const { Body } = await s3Client.send(getObjectCommand);

    let existingContent = "";
    if (Body) {
      existingContent = await Body.transformToString(); // Convert stream to string
      return existingContent;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error appending string to S3 file:", error);
    throw error;
  }
}
