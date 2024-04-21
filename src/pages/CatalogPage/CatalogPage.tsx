import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Divider,
} from '@mui/material';
import Loader from 'components/Loader/Loader';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useCallback, useEffect, useState } from 'react';
import { getCatalogProducts } from 'store/redux/catalogSlice';
import { ITEMS_PER_PAGE } from 'utils/constants';
import Filters from './Filters/Filters';
import ProductCard from './ProductCard/ProductCard';
import { Pagination } from './Pagination/Pagination';
import { FilterList, Search } from '@mui/icons-material';

interface ISortOption {
  name: string;
  value: string;
}

const sortOptions: ISortOption[] = [
  { name: 'Best Rating', value: 'rating-desc' },
  {
    name: 'Price: Low to High',
    value: 'price-asc',
  },
  {
    name: 'Price: High to Low',
    value: 'price-desc',
  },
  // {
  //   name: 'Alphabetically, A-Z',
  //   value: 'title-asc',
  // },
  // {
  //   name: 'Alphabetically, Z-A',
  //   value: 'title-desc',
  // },
];

export interface IFilter {
  [key: string]: string[]; // For generic filters with string values
}

interface ISort {
  [key: string]: string;
}

const CatalogPage = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<IFilter>({});
  const [sort, setSort] = useState<ISort>({});
  const [searchQuery, setSearchQuery] = useState('');
  // const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const dispatch = useAppDispatch();
  const { isLoading, isError, products, totalItems } = useAppSelector(
    (state) => state.catalog
  );
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('mdl'));

  // const handleViewModeChange = (mode: 'grid' | 'list') => {
  //   setViewMode(mode);
  // };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: string,
    value: string
  ) => {
    const checked = e.target.checked;
    const newFilter = { ...filter };

    if (checked) {
      if (newFilter[section]) {
        newFilter[section].push(value);
      } else {
        newFilter[section] = [value];
      }
    } else {
      if (newFilter[section]) {
        newFilter[section] = newFilter[section].filter((v) => v !== value);
        if (newFilter[section].length === 0) {
          delete newFilter[section]; // Remove the key if empty
        }
      }
    }

    setFilter(newFilter);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const renderCatalog = useCallback(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(getCatalogProducts({ filter, sort, pagination }));
  }, [dispatch, filter, page, sort]);

  useEffect(() => {
    renderCatalog();
  }, [renderCatalog, dispatch]);

  const handleSort = (option: string) => {
    const [sort, order] = option.split('-');
    const sorting = { _sort: sort, _order: order };
    console.log({ sort });
    setSort(sorting);
  };

  return (
    <Container>
      {isError ? (
        <Typography variant="body1">
          Something went wrong... Check your internet connection.
        </Typography>
      ) : isLoading ? (
        <Loader />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ gap: '1.5rem' }}
          >
            {!isDesktop && (
              <Box display="flex" alignItems="center">
                <Button
                  variant="outlined"
                  // onClick={onFilterClick}
                  startIcon={<FilterList />}
                >
                  Filter
                </Button>
              </Box>
            )}
            <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
              <TextField
                label="Search..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(e.target.value)
                }
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                color={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => handleViewModeChange('grid')}
              >
                <GridOn />
              </IconButton>
              <IconButton
                color={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => handleViewModeChange('list')}
              >
                <FormatListBulleted />
              </IconButton>
            </Box> */}

            <Box display="flex" alignItems="center" gap={1} minWidth={200}>
              {/* <Typography variant="body1">
                Found: <span>{totalItems}</span>
              </Typography> */}
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel htmlFor="sort-select">Sort by</InputLabel>
                <Select
                  id="sort-select"
                  onChange={(e: SelectChangeEvent) =>
                    handleSort(e.target.value)
                  }
                  defaultValue=""
                  label="Sort by"
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Divider sx={{ my: '1.5rem' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              columnGap: '1rem',
              rowGap: '1rem',
              my: '2rem',
            }}
          >
            {isDesktop && (
              <Box sx={{ flex: '1 1 30%' }}>
                <Filters onFilterChange={handleFilterChange} filter={filter} />
              </Box>
            )}
            <Grid
              container
              spacing={{ xxs: 2 }}
              sx={{
                justifyContent: 'center',
                flex: '0 1 75%',
              }}
            >
              {products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </Grid>
          </Box>
          {products.length && (
            <Pagination page={page} setPage={setPage} totalItems={totalItems} />
          )}
        </>
      )}
    </Container>
  );
};
export default CatalogPage;
