import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import "./App.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .required("Age is required"),
});

function App() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [result, setResult] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/api/user`)
      .then((res) => {
        setResult(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = (data) => {
    axios
      .post(`${process.env.REACT_APP_BASEURL}/api/createUser`,
         { name: data.name, age: data.age })
      .then((res) => {
        setResult([...result, data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          px: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box
          sx={{
            maxWidth: "400px",
            width: "100%",
            bgcolor: "white",
            boxShadow: 0,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Add User Details
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth error={Boolean(errors.name)}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      label="Name"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <FormHelperText>{errors.name?.message}</FormHelperText>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth error={Boolean(errors.age)}>
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Age"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <FormHelperText>{errors.age?.message}</FormHelperText>
              </FormControl>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontWeight: "bold" }}
            >
              Submit
            </Button>
          </form>
        </Box>

        <Typography variant="h4" sx={{ mt: 4 }}>
          List of Users
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {result.length === 0 ? (
            <Typography
              align="center"
              sx={{ textAlign: "center", marginTop: "50px" }}
            >
              No users currently.
            </Typography>
          ) : (
            result.map((data, index) => (
              <Grid item xs={12} sm={4}>
                <Card key={index} sx={{p:4,marginTop:"20px"}}>
                  <Typography>{data.name}</Typography>
                  <Typography>{data.age}</Typography>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </div>
  );
}

export default App;
