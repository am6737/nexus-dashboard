import React, { useState } from 'react';
import { Box, IconButton, Snackbar, Stack, Tooltip, Typography } from '@mui/material';
import { CopySimple } from '@phosphor-icons/react/dist/ssr/CopySimple';

interface CopyableCodeSnippetProps {
  code: string;
  icon?: React.ElementType;
}

const CopyableCodeSnippet: React.FC<CopyableCodeSnippetProps> = ({ code, icon: IconComponent = CopySimple }) => {
  // const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [tooltip, setTooltip] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    // setSnackbarOpen(true);
    setTooltip('Copied!');
    setTimeout(() => {
      setTooltip('Copy');
    }, 1000);
  };

  // const handleCloseSnackbar = () => {
  //   setSnackbarOpen(false);
  // };

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: 2,
        boxShadow: 6,
        borderRadius: 1,
        border: ' 1px solid',
        borderColor: 'primary.main',
        height: '50px',
      }}
    >
      <Box sx={{ flex: '1 1 auto' }}>
        <Typography variant="subtitle2">{code}</Typography>
      </Box>
      <Tooltip title={tooltip}>
        <IconButton onClick={handleCopy}>
          <IconComponent />
        </IconButton>
      </Tooltip>

      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="Copied to clipboard"
      /> */}
    </Stack>
  );
};

export default CopyableCodeSnippet;
