import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Linki from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import api from "../../service/api";

import { Link } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Linki color="inherit" href="#">
        Desenvolvido por WhateverTech
      </Linki>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Login() {
  const classes = useStyles();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [status, setStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [openResetPassword, setOpenResetPassword] = useState(false);

  async function login() {
    const obj = { username: user, password };
    const response = await api.post("/login", obj);
    setStatus(response.status);
    setOpen(true);
  }

  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenModal(false);
    setOpenResetPassword(false);
  };

  async function getRecoverPassword() {
    if (confirmPass !== "" && password !== "") {
      if (confirmPass === password) {
        const response = await api.put(`/recover?resetToken=${resetToken}`, {
          password,
        });
        setStatus(response.status);
        setOpenResetPassword(false);
        setOpenModal(false);
      }
    } else {
      const response = await api.post("/recover", { email: user });
      if (response.status === 200) {
        setResetToken(response.data.resetTokenString);
        setOpenResetPassword(true);
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Status da requisição: {status}
          </Alert>
        </Snackbar>
        <Typography variant="h5" gutterBottom>
          Projeto Integrador III-B
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="user"
            label="Usuário"
            name="user"
            autoComplete="user"
            autoFocus
            onChange={(e) => setUser(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => login()}
          >
            Logar
          </Button>
          <Grid container>
            <Grid item xs>
              <Linki onClick={handleClickOpen} variant="body2">
                Esqueceu a senha?
              </Linki>
            </Grid>
            <Grid item>
              <Link to="/signUp" variant="body2">
                {"Ainda não tem uma conta? Inscreva-se"}
              </Link>
            </Grid>
          </Grid>
        </form>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={openModal}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Recuperar senha"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Para recuperar sua senha, digite seu email
            </DialogContentText>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setUser(e.target.value)}
            />
            {openResetPassword && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="user"
                  label="Senha"
                  name="user"
                  autoComplete="user"
                  autoFocus
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Confirmar senha"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => getRecoverPassword()}
              color="primary"
              autoFocus
            >
              Enviar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
