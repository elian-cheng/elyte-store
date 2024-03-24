import * as React from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Box,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { BlockRounded, RestoreFromTrashRounded } from '@mui/icons-material';
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { getAllUsers, banUser, deleteUser, updateRole } from 'api/users';
import { formatDate } from 'utils/formatDateFromServer';
import Colors from 'theme/colors';
import { Role, cacheKeys } from 'utils/constants';
import { useAuth } from 'store/context/authContext';
import { IUser } from 'interfaces/UserInterface';
import ContactInfoPopover from 'components/ContactInfoPopover/ContactInfoPopover';
import Loader from 'components/Loader/Loader';

const UsersTable = () => {
  const client = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user && user === Role.ADMIN;
  const [rows, setRows] = React.useState<GridRowModel[]>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [userName, setUserName] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);
  const [isRestore, setIsRestore] = React.useState(false);
  const navigate = useNavigate();

  const {
    data = [] as IUser[],
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: cacheKeys.users(),
    queryFn: () => getAllUsers(),
    enabled: user ? true : false,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    navigate(`/users/${id}`);
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleDeleteOrBan = async () => {
    try {
      if (isDelete) {
        await deleteUser(userId);
        setRows((prevRows) => prevRows.filter((row) => row.id !== userId));
        toast.success('User was successfully deleted.');
      } else {
        await banUser(userId);
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === userId
              ? { ...row, isBanned: isRestore ? false : true }
              : row
          )
        );
        if (isRestore) {
          toast.success('User was successfully restored.');
        } else {
          toast.success('User was successfully banned.');
        }
      }
      void client.invalidateQueries({ queryKey: cacheKeys.users() });
      handleClose();
    } catch (error) {
      toast.error('Something went wrong...');
    }
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    const row = rows.find((row) => row.id === id);
    setUserName(row?.name);
    setUserId(row?.id);
    handleClickOpen();
    setIsDelete(true);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleBanClick = (id: GridRowId) => async () => {
    const row = rows.find((row) => row.id === id);
    setUserName(row?.name);
    setUserId(row?.id);
    setIsDelete(false);
    setIsRestore(row?.isBanned);
    handleClickOpen();
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    try {
      await updateRole(newRow.id, newRow.role);
      toast.success('User was successfully updated.');
    } catch (error) {
      toast.error('Something went wrong...');
    }
    return updatedRow;
  };

  React.useEffect(() => {
    if (isSuccess && data) {
      setRows(data);
    }
  }, [data, isSuccess]);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Full Name',
      headerAlign: 'center',
      sortable: true,
      align: 'center',
      width: 250,
      renderCell: (params) => (
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            color: Colors.PRIMARY_MAIN,
          }}
        >
          <Typography variant="body1">{params.value}</Typography>
          <ContactInfoPopover
            phone={params.row.phone}
            email={params.row.email}
          />
        </div>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      description: 'This column is not sortable.',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      type: 'singleSelect',
      sortable: true,
      valueOptions: [Role.USER, Role.ADMIN],
    },
    // {
    //   field: 'country',
    //   headerName: 'Country',
    //   headerAlign: 'center',
    //   align: 'center',
    //   width: 130,
    // },
    {
      field: 'isBanned',
      headerName: 'Is Banned',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return params.row.isBanned ? (
          <Chip label={'YES'} color={'warning'} variant="outlined" />
        ) : (
          <Chip label={'NO'} color={'success'} variant="outlined" />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 160,
      renderCell: (params) => {
        return <span>{formatDate(params.value)}</span>;
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 160,
      renderCell: (params) => {
        return <span>{formatDate(params.value)}</span>;
      },
    },
  ];
  if (isAdmin) {
    columns.unshift({
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 140,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        const currentRow = rows.find((row) => row.id === id);

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label={'Save'}
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,

            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label={'Cancel'}
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon sx={{ color: Colors.GREY }} />}
            label={'Edit'}
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="secondary"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon color="error" />}
            label={'Delete'}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            label={currentRow?.isBanned ? 'Restore' : 'Ban'}
            onClick={handleBanClick(id)}
            color="inherit"
            key={'ban'}
            icon={
              !currentRow?.isBanned ? (
                <BlockRounded color="error" />
              ) : (
                <RestoreFromTrashRounded color="success" />
              )
            }
          />,
        ];
      },
    });
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog"
        aria-describedby="alert-dialog"
      >
        <DialogTitle id="alert-dialog">
          {`${'Are you sure you want to'} ${
            isDelete
              ? 'Delete'.toLowerCase()
              : isRestore
                ? 'Restore'.toLowerCase()
                : 'Ban'.toLowerCase()
          } ${userName}? ${isDelete ? 'This action cannot be undone.' : ''}`}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>{'Cancel'}</Button>
          <Button onClick={handleDeleteOrBan}>
            {isDelete ? 'Delete' : isRestore ? 'Restore' : 'Ban'}
          </Button>
        </DialogActions>
      </Dialog>
      {isLoading ? (
        <Loader />
      ) : data?.length > 0 ? (
        <Box
          sx={{
            boxShadow: Colors.TABLE_BORDER_SHADOW,
            height: 'auto',
            maxWidth: 1800,
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
            '& .css-1iyq7zh-MuiDataGrid-columnHeaders': {
              backgroundColor: Colors.TABLE_BACKGROUND_HEADER,
            },
          }}
        >
          <DataGrid
            getRowHeight={() => 'auto'}
            rows={rows}
            {...data}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            loading={isLoading}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 15, 25]}
            disableRowSelectionOnClick
          />
        </Box>
      ) : (
        <Typography variant="h5">{'No records to display'}</Typography>
      )}
    </>
  );
};

export default UsersTable;
