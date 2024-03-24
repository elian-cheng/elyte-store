import { Box } from '@mui/material';
import { ProgressBar } from 'react-loader-spinner';
import Colors from 'theme/colors';

const ButtonLoader = () => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <ProgressBar
        visible={true}
        height="80"
        width="80"
        barColor={Colors.PRIMARY_MAIN}
        borderColor={Colors.PRIMARY_DARK}
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </Box>
  );
};
export default ButtonLoader;
