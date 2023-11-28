import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useSelector, useDispatch } from 'react-redux';

import { signupUser } from '../../features/userSlice';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signupUser(formData));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Signup
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 16 }}
        >
          Sign Up
        </Button>
        <Typography variant="h6" sx={{
          padding: '20px'
        }}>
          Already have an account?  <Link href="/login" variant="body">
            Sign in
          </Link>
        </Typography>
      </form>



    </Box>
  );
}

export default SignupPage;
