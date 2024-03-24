import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Link,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Colors from 'theme/colors';

export interface IContactInfoProps {
  phone?: number;
  email?: string;
}

const ContactInfoList = ({ phone, email }: IContactInfoProps) => {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <EmailIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={'Email'}
          secondary={
            email && (
              <Link href={`mailto:${email}`} color={Colors.PRIMARY_DARK}>
                {email}
              </Link>
            )
          }
        />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <PhoneIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={'Phone'}
          secondary={
            phone && (
              <Link href={`tel:+${phone}`} color={Colors.PRIMARY_DARK}>
                {phone}
              </Link>
            )
          }
        />
      </ListItem>
    </List>
  );
};

export default ContactInfoList;
