import { FC } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  styled,
} from '@mui/material';

import Colors from 'theme/colors';

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  color: Colors.PRIMARY_MAIN,
  fontSize: '1.5rem',
  lineHeight: '2.5rem',
  marginBottom: '1.5rem',
  [theme.breakpoints.down('mdl')]: {
    fontSize: '1.25rem',
    lineHeight: '2rem',
    fontWeight: 700,
    textAlign: 'left',
  },
}));

interface IAdvantageCardProps {
  title: string;
  description: string;
  image: string;
}

const AdvantageCard: FC<IAdvantageCardProps> = ({
  title,
  description,
  image,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        justifyContent: 'flex-start',
        backgroundColor: Colors.WHITE,
        boxShadow: Colors.BOX_SHADOW,
        padding: '2rem',
        borderRadius: '24px',
        cursor: 'default',
        '&:hover': {
          boxShadow: Colors.BOX_SHADOW_HOVER,
        },
        [theme.breakpoints.down('md')]: {
          padding: '1.7rem',
        },
        [theme.breakpoints.down('tb')]: {
          padding: '1.7rem 1rem',
        },
      }}
    >
      <CardMedia
        sx={{
          height: 100,
          width: 100,
          borderRadius: '8px',
          marginBottom: '1.5rem',
          [theme.breakpoints.down('sm')]: {
            marginBottom: '1rem',
          },
        }}
        image={image}
        title="mini cooper center advantages"
      />
      <CardContent
        sx={{
          padding: 0,
          marginBottom: '2rem',
          '&:last-child': {
            marginBottom: 0,
            paddingBottom: 0,
          },
        }}
      >
        <StyledTitle variant="h4">{title}</StyledTitle>
        <Typography variant="body2" sx={{ color: Colors.TEXT_GREY }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AdvantageCard;
