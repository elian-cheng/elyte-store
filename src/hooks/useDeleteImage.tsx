import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import toast from 'react-hot-toast';

const useDeleteImage = () => {
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

  const deleteImage = async (fileName: string) => {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: `${productsFolder}/${fileName}`,
    });

    try {
      const response = await client.send(command);
      const imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${productsFolder}/${fileName}`;
      if (response.$metadata.httpStatusCode === 200) {
        toast.success('Image was successfully deleted.');

        return imageUrl;
      } else {
        return '';
      }
    } catch (err) {
      throw err;
    }
  };

  return deleteImage;
};

export default useDeleteImage;
