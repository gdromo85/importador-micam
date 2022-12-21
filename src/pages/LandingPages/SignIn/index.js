
import { useState } from "react";

// react-router-dom components
//import { Link, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import axios from "axios";

import { useUsuarioStore } from "../../../tienda";
import { useForm } from "react-hook-form";

const CssTextField = styled(TextField)({
  
  backgroundColor: '#3A4149',
  '& label': {
    color: '#999999',
  },
  '& Input': {
    color: '#999999',
    
  },
  '& label.Mui-focused': {
    color: '#999999',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#999999',
    
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#999999',
    },
    '&:hover fieldset': {
      borderColor: '#999999',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#999999',
    },
  },
});

const ColorButton = styled(LoadingButton)(({ theme }) => ({
  backgroundColor: '#E5E8E8',
  '&:hover': {
    backgroundColor: '#808B96',
    color: 'white',
  },
}));

function SignIn(props) {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  

  const [loading, setLoading] = useState(false);
  const login = useUsuarioStore((state) => state.loginUsuario);
  //const usuario = useUsuarioStore((state) => state.usuario);
  
  

  const onSubmit = async (data) => {
    //console.log('onSubmit');
    //console.log(data);
    setLoading(true);
    axios
      .post(`http://localhost:3500/login/`, {
        usuario: data.usuario,
        contraseña: data.password
      })
      .then(function (response) {
        //console.log('response');
        //console.log(response.data.data);
        
        login({
          id: response.data.data.Codigo, 
          nombre: response.data.data.NombreCompleto, 
          nombreUsuario: response.data.data.NombreUsuario,
          rol:response.data.data.Rol,
          habilitado:response.data.data.Habilitado,
          contrasena:response.data.data.Contrasena,
          token: response.data.data.token,
          logueado: true,
        });

      })
      .catch(function (error) {
        console.log("error",error );
        ///Quitar en produccion
        alert('Usuario y/o contraseña equivocado')
        setLoading(false);
      });
  };
  

  return (
    <>
      <Box
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="150vh"
        sx={{
          
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Box
        px={1}
        width="100%"
        height="100vh"
        mx="auto"
        position="relative"
        zIndex={2}
      >
        <Box minHeight="100px" width="100%" />
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            <Card sx={{
              background: 'linear-gradient(to right bottom, #017EAA, #97B9E2)',
              paddingTop: '20px',
              }}
            >
              <Box
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
              >
                <Typography
                  variant="h2"
                  fontWeight="medium"
                  color="white"
                  mt={1}
                >
                  m
                </Typography>
                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  sx={{ mt: 1 }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="medium"
                    color="white"
                    mt={1}
                    pl={4}
                  >
                    {`ITCEM`}
                  </Typography>
                </Grid>
              </Box>
              
              <Box pb={3} px={3}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box mb={2}>
                    
                    <CssTextField 
                       
                      label="Usuario" 
                      variant="filled"
                      color="success"
                      inputProps={{
                        autocomplete: 'new-password',
                        form: {
                          autocomplete: 'off',
                        },
                      }}
                      error = {errors?.mail}
                      
                      {...register('usuario', {
                        required: 'El usuario es necesario',
                        
                      })}
                      fullWidth />
                      {errors?.usuario && 
                      (<Typography 
                        color="error" 
                        variant="caption" 
                        display="block" >{errors.usuario.message}</Typography>)}
                  </Box>
                  <Box mb={2}>
                    <CssTextField 
                      type="password" 
                      label="Contraseña" 
                      variant="filled"
                      autoComplete='off'
                      error = {errors?.password}
                      {...register('password', {
                        required: 'La Contraseña es necesaria',
                        
                      })}
                      fullWidth />
                      {errors?.password && 
                      (<Typography 
                        color="error" 
                        variant="caption" 
                        display="block" >{errors.password.message}</Typography>)}
                  </Box>
                  
                  <Box mt={4} mb={1}>
                    <ColorButton
                      type="submit"
                      loading={loading}
                      loadingPosition="end"
                      variant="contained"
                      fullWidth
                    >
                      <Typography
                        variant="button"
                        fontWeight="medium"
                        color="black"
                      >
                        Ingresar
                      </Typography>
                    </ColorButton>
                  </Box>

                  
                </form>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default SignIn;

//onChange={e => setEmail(e.target.value)}
//onChange={e => setContraseña(e.target.value)}
//onChange={handleSetRememberMe}
