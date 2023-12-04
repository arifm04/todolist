// AlertComponent.jsx
import React from 'react';
import Alert from '@mui/material/Alert';

const AlertComponent = ({ message, severity }) => {
  return (
    <Alert  variant="filled" severity={severity}>
      {message}
    </Alert>
  );
};

export default AlertComponent;
