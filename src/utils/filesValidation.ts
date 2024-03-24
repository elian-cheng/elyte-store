import { toast } from 'react-hot-toast';

export const filesValidation = (selectedFile: File) => {
  const allowedFileTypes = ['image/jpeg', 'image/png'];
  if (!allowedFileTypes.includes(selectedFile.type)) {
    toast('Invalid file type');
    return false;
  }
  const maxSizeInBytes = 3 * 1024 * 1024;
  if (selectedFile.size > maxSizeInBytes) {
    toast('File size exceeds the limit');
    return false;
  }
};
