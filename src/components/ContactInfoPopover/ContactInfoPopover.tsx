import * as React from 'react';
import { Popover, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ContactInfoList, { IContactInfoProps } from './ContactInfoList';

const ContactInfoPopover: React.FC<IContactInfoProps> = ({ phone, email }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        aria-label="View Components"
        color="primary"
        onClick={handleClick}
      >
        <InfoIcon />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <ContactInfoList phone={phone} email={email} />
      </Popover>
    </div>
  );
};
export default ContactInfoPopover;
