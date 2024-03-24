import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const useUploadImage = () => {
  const region = import.meta.env.VITE_S3_REGION;
  const bucket = import.meta.env.VITE_S3_BUCKET_NAME;
  const accessKeyId = import.meta.env.VITE_S3_ACCESS_KEY;
  const secretAccessKey = import.meta.env.VITE_S3_SECRET_KEY;
  const productsFolder = import.meta.env.VITE_S3_PRODUCTS_FOLDER;

  const client = new S3Client({
    region,
    credentials: {
      secretAccessKey,
      accessKeyId,
    },
  });

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.')[1];
    const fileName = file.name.split('.')[0];
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const newFilename = fileName + '-' + Date.now() + '.' + ext;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: `${productsFolder}/${newFilename}`,
      ACL: 'public-read',
      ContentType: contentType || 'application/octet-stream',
      Body: file,
    });

    try {
      const response = await client.send(command);
      const imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${productsFolder}/${newFilename}`;
      if (response.$metadata.httpStatusCode === 200) {
        return imageUrl;
      } else {
        return '';
      }
    } catch (err) {
      throw err;
    }
  };

  return uploadImage;
};

export default useUploadImage;
