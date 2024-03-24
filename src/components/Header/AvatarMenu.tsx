import { Avatar, Box, Menu } from '@mui/material';
import { useState } from 'react';
import useLogout from 'hooks/useLogout';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { MenuItem, styled } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Colors from 'theme/colors';

export const NavLinkStyled = styled(NavLink)`
  font-size: 14px;
  color: ${(props) => props.theme.palette.text.primary};

  &.active {
    color: ${Colors.PRIMARY_DARK};
  }
`;

export const MenuItemStyled = styled(MenuItem)`
  color: ${Colors.BLACK};
  text-transform: 'capitalize';
  font-weight: 500;
  padding: 10px 20px;
`;

const AvatarMenu = () => {
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = !!anchorEl;

  return (
    <Box>
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar src={''} sx={{ width: 30, height: 30 }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { width: 200, marginTop: '5px' } } }}
      >
        <NavLinkStyled to="/profile">
          <MenuItemStyled>
            <SettingsIcon
              sx={{
                color: Colors.PRIMARY_DARK,
                marginRight: '10px',
              }}
            />
            My Profile
          </MenuItemStyled>
        </NavLinkStyled>

        <MenuItemStyled onClick={() => logout()}>
          <LogoutIcon
            sx={{
              color: Colors.PRIMARY_DARK,
              marginRight: '10px',
            }}
          />
          Logout
        </MenuItemStyled>
      </Menu>
    </Box>
  );
};

export default AvatarMenu;
