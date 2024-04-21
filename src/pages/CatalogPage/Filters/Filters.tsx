import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import { useAppSelector } from 'hooks/redux';
import { FC, Fragment } from 'react';
import Colors from 'theme/colors';
import { IFilter } from '../CatalogPage';

interface IFiltersProps {
  filter: IFilter;
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    section: string,
    value: string
  ) => void;
}

const Filters: FC<IFiltersProps> = ({ onFilterChange, filter }) => {
  const { isLoading, isError, products, brands, categories, totalItems } =
    useAppSelector((state) => state.catalog);

  const filtersArr = [
    {
      id: 'category-filter',
      name: 'category',
      options: categories,
    },
    {
      id: 'brand-filter',
      name: 'brand',
      options: brands,
    },
  ];

  return (
    <>
      {filtersArr.map((filterObj) => (
        <Box
          key={filterObj.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingBottom: '1rem',
          }}
        >
          <Typography
            variant="h4"
            sx={{ borderLeft: `1px solid ${Colors.SECONDARY_MAIN}`, pl: 2 }}
          >
            {filterObj.name.charAt(0).toUpperCase() + filterObj.name.slice(1)}
          </Typography>
          <Grid
            container
            rowSpacing={0}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="flex-start"
          >
            {filterObj.options.map((option) => (
              <Grid item xxs={12} md={6} xl={4} key={option}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        filter[filterObj.name]
                          ? filter[filterObj.name].includes(option)
                          : false
                      }
                      onChange={(e) =>
                        onFilterChange(e, filterObj.name, option)
                      }
                    />
                  }
                  label={option}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </>
  );
};
export default Filters;
