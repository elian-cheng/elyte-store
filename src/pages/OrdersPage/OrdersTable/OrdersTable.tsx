import { useCallback, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Modal,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Visibility, Delete, Edit } from '@mui/icons-material';
import { getOrdersAdmin } from 'api/orders';
import { useQuery } from '@tanstack/react-query';
import Loader from 'components/Loader/Loader';
import Colors from '../../../theme/colors';
import { IOrderItem, IOrderShort } from 'interfaces/OrderInterface';
import { cacheKeys } from 'utils/constants';
import ViewOrderDetails from '../ViewOrderDetails/ViewOrderDetails';
import UpdateOrderStatusForm from '../UpdateOrderStatusForm/UpdateOrderStatusForm';
import { ModalContentWrapper, StyledCloseIcon } from 'theme/common';
import useDeleteOrder from 'hooks/useDeleteOrder';

const OrdersTable = () => {
  const [modalIsShown, setModalIsShown] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | number>('');
  const [modalType, setModalType] = useState<'view' | 'update'>('view');
  const [dialogIsShown, setDialogIsShown] = useState(false);
  const [removedOrderId, setRemovedOrderId] = useState<string | number>('');
  const theme = useTheme();
  const deleteOrderMutation = useDeleteOrder();

  const handleDialog = () => {
    setDialogIsShown((open) => !open);
  };

  const closeDialog = () => {
    setDialogIsShown(false);
  };

  const handleRemoveOrder = useCallback((orderId: string | number) => {
    setRemovedOrderId(orderId);
    handleDialog();
  }, []);

  const handleDeleteOrder = async () => {
    await deleteOrderMutation.mutateAsync(removedOrderId as string);
    closeDialog();
  };

  const handleModal = () => {
    setModalIsShown((open) => !open);
  };

  const closeModal = () => {
    setModalIsShown(false);
  };

  const handleViewOrderDetails = useCallback((id: string | number) => {
    setSelectedOrderId(id);
    setModalType('view');
    handleModal();
  }, []);

  const handleUpdateOrderStatus = useCallback((id: string | number) => {
    setSelectedOrderId(id);
    setModalType('update');
    handleModal();
  }, []);

  const {
    data: tableData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: cacheKeys.orders(),
    queryFn: async () => {
      return await getOrdersAdmin();
    },
  });

  const orderColumns = useMemo<MRT_ColumnDef<IOrderShort>[]>(
    () => [
      {
        accessorKey: 'userData.name',
        header: 'Customer',
        sortable: true,
      },
      {
        accessorKey: 'orderItems',
        header: 'Items',
        sortable: false,
        Cell: ({ row }) => (
          <>
            {row.original.orderItems.map((item: IOrderItem) => (
              <div key={item.id}>
                {item.title} (x{item.quantity})
              </div>
            ))}
          </>
        ),
      },
      {
        accessorKey: 'totalPrice',
        header: 'Total Price',
        sortable: true,
        Cell: ({ row }) => `$${row.original.totalPrice.toFixed(2)}`,
      },
      {
        accessorKey: 'orderStatus',
        header: 'Status',
        sortable: true,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        sortable: true,
        Cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        sortable: true,
        Cell: ({ row }) =>
          new Date(row.original.updatedAt).toLocaleDateString(),
      },
    ],
    []
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
          columns={orderColumns}
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
              <Tooltip arrow placement="left" title={'View Details'}>
                <IconButton
                  color="success"
                  onClick={() => handleViewOrderDetails(row.original.id)}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="left" title={'Edit'.toLowerCase()}>
                <IconButton
                  onClick={() => handleUpdateOrderStatus(row.original.id)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title={'Delete'}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveOrder(row.original.id)}
                >
                  <Delete />
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
            {modalType === 'view' && (
              <ViewOrderDetails orderId={selectedOrderId as string} />
            )}
            {modalType === 'update' && (
              <UpdateOrderStatusForm
                handleModal={closeModal}
                orderId={selectedOrderId as string}
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
            {`Are you sure you want to delete this order? This action cannot be undone.`}
          </DialogTitle>

          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleDeleteOrder}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default OrdersTable;
