import { Typography } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Colors from 'theme/colors';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: Colors.LIGHT_GREY,
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

interface ImageDropzoneProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
}

const ImageDropzone: FC<ImageDropzoneProps> = ({
  onSelectFile,
  selectedFile,
}) => {
  const {
    acceptedFiles,
    isDragActive,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      onSelectFile(acceptedFiles[0]);
      const file = new FileReader();
      file.onload = () => {
        setPreview(file.result as string);
      };
      file.readAsDataURL(acceptedFiles[0]);
    }
  }, [acceptedFiles, onSelectFile]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', color: Colors.PRIMARY_MAIN }}
          >
            Drop the files here...
          </Typography>
        ) : selectedFile ? (
          // <Typography
          //   variant="body1"
          //   sx={{
          //     textAlign: 'center',
          //     fontWeight: 'bold',
          //     color: Colors.PRIMARY_MAIN,
          //   }}
          // >
          //   {selectedFile.name}
          // </Typography>
          <img
            src={(preview as string) || ''}
            width={100}
            height={100}
            alt="component-picture"
          />
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: Colors.PRIMARY_MAIN }}
            >
              Drag & drop an image here, or click to select image
            </Typography>
            <Typography variant="caption" sx={{ color: Colors.DARK_GREY }}>
              Only *.png and *.jpeg/jpg files are accepted
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
