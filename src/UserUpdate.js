import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function UserUpdate() {  
  const { id } = useParams();
  
  const [result, setUsers] = useState([])

  const UsersGet = () => {
    fetch("http://localhost:3334/getuserupdate/"+id,{
    method: 'POST',
    })
      .then(res => res.json())
      .then(
        (result) => {
          setUsers(result)
        }
      )
  }
  useEffect(() => {
    UsersGet()
  }, [])

  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updatedata = {
      firstname: data.get("firstname"),
      lastname: data.get("lastname"),
      email: data.get("email"),
      password: data.get("password"),
      id: id,
    }
    fetch('http://localhost:3334/updateusers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedata),
    })
      .then(res => res.json())
      .then(data => {
        console.log('success', data);
        alert("success")
        window.location ='/users'
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }


  return (
    <Container sx={{ p:2 }} maxWidth="sm">    
      <div>
        <Typography component="h1" variant="h5">
          User
        </Typography>
        {result.map((user) => (
        <form onSubmit={handleSubmit}>
          <Grid container sx={{ pt:2 }} spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="firstname"
                name="firstname"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                defaultValue={user.firstname}

                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="lastname"
                label="Last Name"
                defaultValue={user.lastname}
           
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="email"
                label="email"
                defaultValue={user.email}
          
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="password"
                defaultValue={user.password}
          
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Submit
            </Button>
            </Grid>
          </Grid>
        </form>
     ))}
      </div>
    </Container>
  );
}