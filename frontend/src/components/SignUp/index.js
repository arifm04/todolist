import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Button, Link, useMediaQuery, useTheme } from '@mui/material';
import AlertComponent from '../Alert';
import { useSelector, useDispatch } from 'react-redux';
import { signupUser } from '../../features/userSlice';
import signupImage from "../../images/signup.jpg";

function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [signupAlert, setSignupAlert] = useState({ message: '', severity: '' });

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.username !== "" && formData.email !== "" && formData.password !== "") {
      dispatch(signupUser(formData));
    } else {
      console.log(formData)
      setSignupAlert({ message: 'Please fill all the blank fields!', severity: 'error' });
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (user?.data?.status !== 'loading') {
      setSignupAlert({ message: user?.data?.message, severity: 'success' });
    }
    else {
      setSignupAlert({ message: user?.data?.message, severity: 'error' });
    }
  }, [user]);
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <Grid container>
        <Grid item xs={12} sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Box
            component="img"
            src={signupImage}
            alt="signup"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <Box sx={{
            width: '100%',
            maxWidth: 400,
            m: isMobile ? 2 : 'auto',
            p: isMobile ? 2 : 4,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            '& .MuiTextField-root': { my: 1 },
            '& .MuiButton-root': { mt: 2 }
          }}>
            {signupAlert.message && (
              <AlertComponent message={signupAlert.message} severity={signupAlert.severity} />
            )}
            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
              Signup
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                sx={{ width: '100%', py: 1.5, mb: 2 }}

              >
                Sign Up
              </Button>
              <Typography variant="h6" sx={{
                textAlign: 'center'

              }}>
                Already have an account? <Link href="/login" underline="hover" variant="body" sx={{ textDecoration: 'none', fontWeight: 'bold', color: 'primary.main' }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignupPage;
