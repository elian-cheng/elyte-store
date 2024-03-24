import { Box, Typography, styled } from '@mui/material';
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

const StyledImageBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  alignItems: 'center',
  '& img': {
    width: '70px',
    height: '50px',
    objectPosition: 'center',
    objectFit: 'contain',
  },
});

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
  selectedFiles: File[] | null;
  onSelectFiles: (file: File[] | null) => void;
}

const ImageDropzoneMulti: FC<ImageDropzoneProps> = ({
  onSelectFiles,
  selectedFiles,
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
    maxFiles: 4,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });
  const [previews, setPreviews] = useState<Array<string | ArrayBuffer>>([]);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      onSelectFiles(acceptedFiles);

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews((prevPreviews) => [
            ...prevPreviews,
            reader.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  }, [acceptedFiles, onSelectFiles]);

  useEffect(() => {
    if (selectedFiles === null) {
      setPreviews([]);
    }
  }, [selectedFiles]);

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
        ) : selectedFiles && selectedFiles?.length > 0 ? (
          <StyledImageBox>
            {(previews || []).map((preview, index) => (
              <img
                key={index}
                src={(preview as string) || ''}
                width={70}
                height={50}
                alt={`component-picture-${index}`}
              />
            ))}
          </StyledImageBox>
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

export default ImageDropzoneMulti;
