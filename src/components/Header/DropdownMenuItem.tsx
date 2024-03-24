import * as React from 'react';
import { Box, Button, Menu } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Colors from 'theme/colors';
import theme from 'theme/theme';
import { StyledMenuItem, StyledLink } from './Header.styles';
import { matchPath, useLocation } from 'react-router-dom';

type LinkObject = {
  name: string;
  url: string;
};

interface IMenuProps {
  name: string;
  links: LinkObject[];
}

const DropdownMenuItem = ({ name, links }: IMenuProps) => {
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const isActive = React.useMemo(() => {
    return links.some((link) => !!matchPath(link.url, pathname));
  }, [links, pathname]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        padding: '6px 0',
      }}
    >
      <Button
        id="basic-button"
        aria-controls={isOpen ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          padding: 0,
          color: Colors.WHITE,
          lineHeight: 'normal',
          fontSize: '1rem',
          [theme.breakpoints.down('xl')]: {
            fontSize: '0.8rem',
          },
          '&::after': {
            content: '" "',
            display: isActive ? 'flex' : 'none',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: Colors.WHITE,
            marginTop: '40px',
            left: '-7px',
            [theme.breakpoints.down('xl')]: {
              marginTop: '30px',
            },
          },
        }}
      >
        {name}
        <ExpandMoreIcon
          sx={{
            marginLeft: 1,
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }}
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        slotProps={{
          paper: {
            sx: { width: 150, marginTop: '1.25rem', marginLeft: '-0.7rem' },
          },
        }}
      >
        {links.map(({ name, url }) => (
          <StyledMenuItem
            disableGutters
            onClick={handleClose}
            key={name}
            sx={{
              padding: 0,
              '&:hover': {
                background: 'rgba(89, 93, 61, 0.1)',
              },
            }}
          >
            <StyledLink
              to={url}
              sx={{
                color: Colors.BLACK,
                textTransform: 'capitalize',
                fontWeight: 500,
                '&.active': { '&::after': { display: 'none' } },
              }}
            >
              {name}
            </StyledLink>
          </StyledMenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default DropdownMenuItem;
