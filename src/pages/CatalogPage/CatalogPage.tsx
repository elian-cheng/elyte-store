import {
  Box,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Loader from 'components/Loader/Loader';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useCallback, useEffect, useState } from 'react';
import { getCatalogProducts } from 'store/redux/catalogSlice';
import { ITEMS_PER_PAGE } from 'utils/constants';
import Filters from './Filters/Filters';
import ProductCard from './ProductCard/ProductCard';
import { Pagination } from './Pagination/Pagination';

const CatalogPage = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const dispatch = useAppDispatch();
  const { isLoading, isError, products, brands, categories, totalItems } =
    useAppSelector((state) => state.catalog);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const renderCatalog = useCallback(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(getCatalogProducts({ filter, sort, pagination }));
  }, [dispatch, filter, page, sort]);

  useEffect(() => {
    renderCatalog();
  }, [renderCatalog, dispatch]);

  return (
    <Container>
      {isError ? (
        <Typography variant="body1">
          Something went wrong... Check your internet connection.
        </Typography>
      ) : isLoading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            rowGap: '1rem',
            my: '2rem',
          }}
        >
          {isDesktop && <Filters />}
          <Grid
            container
            spacing={{ xxs: 2 }}
            sx={{ justifyContent: 'center', flex: '1 1 75%' }}
          >
            {products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </Grid>
        </Box>
      )}
      {products.length && (
        <Pagination page={page} setPage={setPage} totalItems={totalItems} />
      )}
    </Container>
  );
};
export default CatalogPage;
