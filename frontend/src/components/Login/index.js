import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../features/userSlice';
import { useNavigate } from 'react-router-dom';
import "./index.css";
import { Box, Grid, Typography, TextField, Button, Link, useMediaQuery, useTheme } from '@mui/material';
import AlertComponent from '../Alert';
import loginImage from "../../images/login.jpg";


const Login = () => {

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [loginAlert, setLoginAlert] = useState({ message: '', severity: '' });
  const stateData = useSelector((state) => state.user);
  const userStatus = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (loginData.email !== "" && loginData.password !== "") {
      dispatch(loginUser(loginData));
    } else {
      setLoginAlert({ message: 'Please fill all the blank fields!', severity: 'error' });
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (stateData?.data?.status === true) {
      localStorage.setItem('uid', stateData?.data?.userId);
      localStorage.setItem('utno', stateData?.data?.token);
      setLoginAlert({ message: 'Login Successful', severity: 'success' });
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    }
    else if (stateData?.data && userStatus !== 'loading') {
      setLoginAlert({ message: stateData?.data?.message, severity: 'error' });
    }
  }, [stateData, userStatus, navigate]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Grid container>
        <Grid item xs={12} sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Box
            component="img"
            src={loginImage}
            alt="Login"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 400, m: isMobile ? 2 : 'auto', p: 4, boxShadow: 3, borderRadius: 2 }}>
            {loginAlert.message && (
              <AlertComponent message={loginAlert.message} severity={loginAlert.severity} />
            )}
            <form onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
                Login
              </Typography>

              <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={loginData.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={loginData.password}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: '100%', py: 1.5, mb: 2 }}
              >
                Log in
              </Button>

              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                New User? <Link href="/signup" variant="body" sx={{ textDecoration: 'none', fontWeight: 'bold', color: 'primary.main' }}>
                  Sign Up
                </Link>
              </Typography>

            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
export default Login;