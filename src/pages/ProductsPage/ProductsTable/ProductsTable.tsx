import { useCallback, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Modal,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  BlockRounded,
  Delete,
  Edit,
  RestoreFromTrashRounded,
} from '@mui/icons-material';
import { getProductsAdmin } from 'api/products';
import { useQuery } from '@tanstack/react-query';
import Loader from 'components/Loader/Loader';
import Colors from '../../../theme/colors';
import { IProduct, IProductShort } from 'interfaces/ProductInterface';
import { cacheKeys } from 'utils/constants';
import UpdateProductForm from '../UpdateProductForm/UpdateProductForm';
import useDeleteProduct from 'hooks/useDeleteProduct';
import useDeactivateProduct from 'hooks/useDeactivateProduct';
import { ModalContentWrapper, StyledCloseIcon } from 'theme/common';
import toast from 'react-hot-toast';
import missingImage from 'assets/images/error/missing-image.jpg';
import UpdateImagesForm from '../UpdateImagesForm/UpdateImagesForm';

const ProductsTable = () => {
  const [modalIsShown, setModalIsShown] = useState(false);
  const [editedId, setEditedId] = useState<string | number>('');
  const [modalType, setModalType] = useState<'product' | 'images'>('product');
  const [dialogIsShown, setDialogIsShown] = useState(false);
  const [removedId, setRemovedId] = useState<string | number>('');
  const [productTitle, setProductTitle] = useState('');
  const [dialogType, setDialogType] = useState<
    'delete' | 'deactivate' | 'restore'
  >('delete');
  const theme = useTheme();

  const deleteProductMutation = useDeleteProduct();
  const deactivateProductMutation = useDeactivateProduct();

  const handleDialog = () => {
    setDialogIsShown((open) => !open);
  };

  const closeDialog = () => {
    setDialogIsShown(false);
  };

  const handleRemoveProduct = useCallback(
    (
      productId: string | number,
      productTitle: string,
      dialogType: 'delete' | 'deactivate' | 'restore'
    ) => {
      setRemovedId(productId);
      setProductTitle(productTitle);
      setDialogType(dialogType);
      handleDialog();
    },
    []
  );
  const handleDeleteOrDeactivate = async () => {
    if (dialogType === 'delete') {
      await deleteProductMutation.mutateAsync(removedId as string);
    } else {
      await deactivateProductMutation.mutateAsync(removedId as string);
      if (dialogType === 'restore') {
        toast.success('Product was successfully restored.');
      } else {
        toast.success('Product was successfully deactivated.');
      }
    }
    closeDialog();
  };

  const handleModal = () => {
    setModalIsShown((open) => !open);
  };

  const closeModal = () => {
    setModalIsShown(false);
  };

  const handleEditProduct = useCallback(
    (id: string | number, modalType: 'product' | 'images') => {
      setEditedId(id);
      setModalType(modalType);
      handleModal();
    },
    []
  );

  const getProductsData = useCallback(async () => {
    const productsDataRes = await getProductsAdmin();
    const productsData = productsDataRes.map((product: IProduct) => {
      return {
        ...product,
        id: product._id,
      };
    });

    return productsData;
  }, []);

  const {
    data: tableData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: cacheKeys.products(),
    queryFn: async () => {
      return await getProductsData();
    },
  });

  const productColumns = useMemo<MRT_ColumnDef<IProductShort>[]>(
    () => [
      // {
      //   accessorKey: 'id',
      //   header: 'ID',
      //   sortable: true,
      //   muiTableHeadCellProps: () => ({
      //     sx: {
      //       padding: '1rem 0.5rem 1rem 0.3rem',
      //       backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
      //       minWidth: '1rem',
      //       width: '2rem',
      //     },
      //   }),
      //   muiTableBodyCellProps: () => ({
      //     sx: {
      //       minWidth: '1rem',
      //       width: '2rem',
      //       padding: '1rem 0.3rem',
      //     },
      //   }),
      // },
      {
        accessorKey: 'images',
        header: 'Images',
        sortable: false,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.8rem 1rem 0.8rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '5rem',
            width: '5rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            padding: '0.1rem 0.1rem 0.1rem 0.8rem',
            minWidth: '5rem',
            width: '5rem',
          },
        }),
        Cell: ({ row }) => {
          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              {row.original.images.length === 0 ? (
                <img src={missingImage} width="50" height="50" />
              ) : (
                <img src={row.original.images[0]} width="50" height="50" />
              )}
              <Tooltip
                arrow
                placement="left"
                title={'Edit images'.toLowerCase()}
              >
                <IconButton
                  onClick={() => handleEditProduct(row.original.id, 'images')}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        accessorKey: 'title',
        header: 'Title',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 1rem 1rem 0.6rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '3rem',
            width: '3rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            padding: '1rem 0.5rem 1rem 0.2rem',
            minWidth: '3rem',
            width: '3rem',
          },
        }),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.6rem 1rem 1rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '5rem',
            width: '5rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            padding: '1rem 1rem 1rem 0.5rem',
            minWidth: '5rem',
            width: '5rem',
          },
        }),
        Cell: ({ row }) => {
          return <>{row.original.description.slice(0, 30) + '...'}</>;
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.1rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '3rem',
            width: '3rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            padding: '1rem 0.3rem',
            minWidth: '2rem',
            width: '2rem',
          },
        }),
      },
      {
        accessorKey: 'brand',
        header: 'Brand',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.1rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '3rem',
            width: '3rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            padding: '1rem 0.4rem',
            minWidth: '3rem',
            width: '3rem',
          },
        }),
      },
      {
        accessorKey: 'colors',
        header: 'Colors',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.2rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '3rem',
            width: '3rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            padding: '1rem 0.5rem',
            minWidth: '3rem',
            width: '3rem',
          },
        }),
        Cell: ({ row }) => {
          return (
            <>
              {row.original.colors.map((color) => (
                <p key={color}>{color}</p>
              ))}
            </>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.3rem 1rem 0.3rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '2rem',
            width: '2rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            minWidth: '2rem',
            width: '2rem',
            padding: '1rem 0.5rem',
          },
        }),
      },
      {
        accessorKey: 'discountPercentage',
        header: 'Discount %',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.1rem 1rem 0.1rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '2rem',
            width: '2rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            minWidth: '2rem',
            width: '2rem',
            padding: '1rem 0.9rem',
          },
        }),
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.1rem 1rem 0.1rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '2rem',
            width: '2rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            padding: '1rem 1rem',
            minWidth: '2rem',
            width: '2rem',
          },
        }),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.1rem 1rem 0.1rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '2rem',
            width: '2rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            minWidth: '2rem',
            width: '2rem',
            padding: '1rem 0.8rem',
          },
        }),
      },
      {
        accessorKey: 'isActive',
        header: 'Active',
        sortable: true,
        muiTableHeadCellProps: () => ({
          sx: {
            padding: '1rem 0.1rem',
            backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            minWidth: '2rem',
            width: '2rem',
          },
        }),
        muiTableBodyCellProps: () => ({
          sx: {
            minWidth: '2rem',
            width: '2rem',
            padding: '1rem 0.8rem',
          },
        }),
        Cell: ({ row }) => {
          return row.original.isActive ? (
            <Chip label={'YES'} color={'success'} variant="outlined" />
          ) : (
            <Chip label={'NO'} color={'warning'} variant="outlined" />
          );
        },
      },
    ],
    [handleEditProduct]
  );

  if (!tableData || isError) {
    return <Typography>Something went wrong...</Typography>;
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <MaterialReactTable
          columns={productColumns}
          data={tableData}
          enableColumnOrdering
          enableEditing
          muiTablePaperProps={{
            elevation: 0,
          }}
          muiTableContainerProps={{
            sx: {
              boxShadow: Colors.TABLE_BORDER_SHADOW,
              borderRadius: '0.5rem',
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              '&:first-of-type': {
                paddingLeft: '2.8rem',
                paddingRight: '2.5rem',
              },
              backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            },
          }}
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '0.2rem' }}>
              <Tooltip arrow placement="left" title={'Edit'.toLowerCase()}>
                <IconButton
                  onClick={() => handleEditProduct(row.original.id, 'product')}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title={'Delete'.toLowerCase()}>
                <IconButton
                  color="error"
                  onClick={() =>
                    handleRemoveProduct(
                      row.original.id,
                      row.original.title,
                      'delete'
                    )
                  }
                >
                  <Delete />
                </IconButton>
              </Tooltip>
              <Tooltip
                arrow
                placement="right"
                title={
                  row.original.isActive
                    ? 'Deactivate'.toLowerCase()
                    : 'Restore'.toLowerCase()
                }
              >
                <IconButton
                  color="error"
                  onClick={() =>
                    handleRemoveProduct(
                      row.original.id,
                      row.original.title,
                      row.original.isActive ? 'deactivate' : 'restore'
                    )
                  }
                >
                  {row.original.isActive ? (
                    <BlockRounded color="error" />
                  ) : (
                    <RestoreFromTrashRounded color="success" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      )}
      {modalIsShown && (
        <Modal open={modalIsShown} onClose={closeModal}>
          <ModalContentWrapper
            sx={{
              [theme.breakpoints.down('sm')]: {
                padding: '2rem 0rem',
                width: '100vw',
              },
            }}
          >
            <StyledCloseIcon onClick={closeModal} />
            {modalType === 'product' && (
              <UpdateProductForm
                handleModal={closeModal}
                editedProductId={editedId as string}
              />
            )}
            {modalType === 'images' && (
              <UpdateImagesForm
                handleModal={closeModal}
                editedProductId={editedId as string}
              />
            )}
          </ModalContentWrapper>
        </Modal>
      )}
      {dialogIsShown && (
        <Dialog
          open={dialogIsShown}
          onClose={closeDialog}
          aria-labelledby="alert-dialog"
          aria-describedby="alert-dialog"
        >
          <DialogTitle id="alert-dialog">
            {`${'Are you sure you want to'} ${
              dialogType === 'delete'
                ? 'Delete'.toLowerCase()
                : dialogType === 'restore'
                  ? 'Restore'.toLowerCase()
                  : 'Deactivate'.toLowerCase()
            } ${productTitle}? ${
              dialogType === 'delete' ? 'This action cannot be undone.' : ''
            }`}
          </DialogTitle>

          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleDeleteOrDeactivate}>
              {dialogType === 'delete'
                ? 'Delete'
                : dialogType === 'restore'
                  ? 'Restore'
                  : 'Deactivate'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ProductsTable;
