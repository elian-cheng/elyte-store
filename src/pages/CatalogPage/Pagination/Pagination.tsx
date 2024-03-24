import React, { FC } from 'react';
import {
  Box,
  Typography,
  Pagination as MuiPagination,
  Stack,
} from '@mui/material';
import { ITEMS_PER_PAGE } from 'utils/constants';

interface IPaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalItems: number;
}

export const Pagination: FC<IPaginationProps> = ({
  page,
  setPage,
  totalItems,
}) => {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      border="1px solid #e5e5e5"
      bgcolor="white"
      p={3}
    >
      <Stack direction={{ xxs: 'column', sm: 'row' }} spacing={2}>
        <Box display={{ xxs: 'none', sm: 'flex' }}>
          <Typography variant="body2" color="textSecondary">
            Showing <strong>{(page - 1) * ITEMS_PER_PAGE + 1}</strong> to{' '}
            <strong>
              {page * ITEMS_PER_PAGE > totalItems
                ? totalItems
                : page * ITEMS_PER_PAGE}
            </strong>{' '}
            of <strong>{totalItems}</strong> results
          </Typography>
        </Box>
      </Stack>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_e, value) => setPage(value)}
        variant="outlined"
        shape="rounded"
        sx={{ ml: 'auto' }}
      />
    </Box>
  );
};
