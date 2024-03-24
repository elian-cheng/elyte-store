import { Box } from '@mui/material';
import { Blocks } from 'react-loader-spinner';
import Colors from 'theme/colors';

const Loader = () => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Blocks
        height="80"
        width="80"
        color={Colors.PRIMARY_MAIN}
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        visible={true}
      />
    </Box>
  );
};
export default Loader;
