import { Box, LinearProgress, Typography } from '@mui/material';
import { Status, useLiveness } from './api/Liveness';

export function App() {
  const [status] = useLiveness();

  return (
    <Box width='100vw' height='100vh' display='flex' justifyContent='center' alignItems='center'>
      <Box width='60%' height='40%' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        {status === Status.DOWN && (
          <>
            <Typography>システムの準備中です…</Typography>
            <Typography>しばらくお待ち下さい</Typography>
            <Box width='100%' height='10%' margin='20px 0px'>
              <LinearProgress />
            </Box>
          </>
        )}
        {status === Status.ERROR && <Typography>システムエラーが発生しました</Typography>}
        {status === Status.UP && <Typography>OK</Typography>}
      </Box>
    </Box>
  );
}
