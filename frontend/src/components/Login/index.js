import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../features/userSlice';
import { useNavigate } from 'react-router-dom';
import "./index.css";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

const Login = () => {

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
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
    dispatch(loginUser(loginData));
  };

  useEffect(() => {
    if (stateData?.error?.status === true) {
      navigate('/home');
    } else if (stateData?.error?.status === false) {
      alert(stateData?.error?.message)
    } else {

    }
  }, [userStatus, navigate]);

  return (
    <div className="App">
      <form className="form" onSubmit={handleSubmit}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Email"
          name="email"
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={loginData.email}
          onChange={handleInputChange}
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
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="form__custom-button"
        >
          Log in
        </Button>

        <Typography variant="h6"
          sx={{
            padding: '20px',
          }}
        >
          New User? <Link href="/signup" variant="body">
            Sign Up
          </Link>
        </Typography>

      </form>
    </div>
  );
}
export default Login;