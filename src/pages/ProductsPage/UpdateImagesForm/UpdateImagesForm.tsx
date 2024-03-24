import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  styled,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import {
  SubmitHandler,
  useForm,
  Resolver,
  useFieldArray,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Colors from 'theme/colors';
import { updateProductImagesFormSchema } from 'utils/validation/products';
import Loader from 'components/Loader/Loader';
import { IProduct, IProductImageShort } from 'interfaces/ProductInterface';
import useGetProduct from 'hooks/useGetProduct';
import DeleteIcon from '@mui/icons-material/Delete';
import useUpdateProductImages from 'hooks/useUpdateProductImages';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { cacheKeys } from 'utils/constants';
import ImageDropzoneMulti from 'components/ImageDropzone/ImageDropzoneMulti';
import useUploadImage from 'hooks/useUploadImage';
import { updateProductImages } from 'api/products';
import useDeleteImage from 'hooks/useDeleteImage';

const StyledImageBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  alignItems: 'center',
  '& img': {
    width: '120px',
    height: '100px',
    objectPosition: 'center',
    objectFit: 'contain',
  },
});

interface IUpdateImagesFormProps {
  handleModal: () => void;
  editedProductId: string;
}

interface IUpdateImagesForm {
  images: IProductImageShort[];
}

const UpdateImagesForm: FC<IUpdateImagesFormProps> = ({
  handleModal,
  editedProductId,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const updateProductImagesMutation = useUpdateProductImages();
  const uploadImageHandler = useUploadImage();
  const queryClient = useQueryClient();
  const deleteImage = useDeleteImage();

  const {
    data: product = {} as IProduct,
    isLoading,
    isError,
  } = useGetProduct(editedProductId);

  const { handleSubmit, reset, control } = useForm<IUpdateImagesForm>({
    defaultValues: {
      images: [{ url: '' }],
    },
    mode: 'onBlur',
    resolver: yupResolver(
      updateProductImagesFormSchema
    ) as Resolver<IUpdateImagesForm>,
    shouldUseNativeValidation: false,
  });

  const { fields, remove } = useFieldArray({
    control,
    name: 'images',
  });

  useEffect(() => {
    if (!isLoading && !isError && product) {
      reset({
        images: product?.images?.map((image) => ({
          url: image,
        })) || [{ url: '' }],
      });
    }
  }, [product, isLoading, isError, reset]);

  const removeExistingImageHandler = async (index: number) => {
    const existingImage = fields[index].url;
    const fileName = existingImage.substring(
      existingImage.lastIndexOf('/') + 1
    );
    const image = deleteImage(fileName);
    if (!image) {
      toast.error('Error deleting image');
      return;
    }

    const images = fields
      .map((image) => image.url)
      .filter((img) => img !== existingImage);
    const response = await updateProductImages(editedProductId, { images });

    if (!response) {
      toast.error('Error deleting image');
      return;
    }
    void queryClient.invalidateQueries({
      queryKey: cacheKeys.products(),
    });
    void queryClient.invalidateQueries({
      queryKey: cacheKeys.productById(editedProductId),
    });

    remove(index);
  };

  const removeFilesHandler = () => {
    setSelectedFiles(null);
  };

  const onSubmit: SubmitHandler<IUpdateImagesForm> = async (data) => {
    if (!editedProductId) return;
    const images = data.images.map((image) => image.url);
    const uploadedImages = [] as string[];
    if (images && selectedFiles) {
      if ([...images, ...selectedFiles].length > 4) {
        toast.error('You can upload up to 4 images.');
        return;
      }

      for (const file of selectedFiles) {
        const image = await uploadImageHandler(file);
        if (!image) {
          toast.error('Error uploading image');
          return;
        }
        uploadedImages.push(image);
      }
    }

    const postImages = [...images, ...uploadedImages];

    await updateProductImagesMutation.mutateAsync({
      id: editedProductId,
      body: { images: postImages },
    });

    void queryClient.invalidateQueries({
      queryKey: cacheKeys.products(),
    });

    handleModal();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: '2rem 2rem 3rem',
        borderRadius: '6px',
        width: '100%',
        backgroundColor: Colors.WHITE,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          mb: '1rem',
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          sx={{ marginTop: '0.5rem', marginBottom: '1rem' }}
        >
          Edit images
        </Typography>
      </Box>
      {isLoading && editedProductId ? (
        <Loader />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {fields.map((image, index) => (
              <Box
                key={image.id}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: '1 1 45%',
                  gap: '0.5rem',
                }}
              >
                <StyledImageBox>
                  <img src={image.url || ''} alt="product-picture" />
                </StyledImageBox>
                <IconButton
                  onClick={() => removeExistingImageHandler(index)}
                  edge="end"
                  sx={{ alignSelf: 'center' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Divider sx={{ width: '100%', mt: '1rem', mb: '1.5rem' }} />
          </Box>
          <ImageDropzoneMulti
            onSelectFiles={setSelectedFiles}
            selectedFiles={selectedFiles}
          />
          {selectedFiles && (
            <Button
              onClick={removeFilesHandler}
              variant="outlined"
              sx={{
                mt: 2,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
              }}
            >
              Remove
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{
              display: 'block',
              mt: '2rem',
              width: '100%',
              py: '0.8rem',
              color: 'white',
            }}
          >
            Save
          </Button>
        </form>
      )}
    </Box>
  );
};

export default UpdateImagesForm;
