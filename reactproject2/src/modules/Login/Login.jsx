import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Email from '@material-ui/icons/Email';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import * as yup from 'yup';
import { CircularProgress } from '@material-ui/core';
import callApi from '../../libs/api';


const schema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string()
    .required('No password provided.'),
});


const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  error: {
    color: 'red',
  },
  spinner: {
    color: 'darkGrey',
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      loading: false,
      credential: {
        email: '',
        password: '',
      },
      error: {
        email: '',
        password: '',
      },
      touched: {
        email: false,
        password: false,
      },
      hasError: {
        email: false,
        password: false,
      },
    };
  }

  validate = (value) => {
    const {
      credential,
      error,
      hasError,
    } = this.state;
    const { email, password } = credential;
    schema.validate({
      email,
      password,
    }, { abortEarly: false })
      .then(() => {
        this.setState({
          error: { ...error, [value]: '' },
          hasError: { ...hasError, [value]: false },
        });
      })
      .catch((err) => {
        err.inner.forEach((errors) => {
          if (errors.path === value) {
            this.setState({
              error: { ...error, [value]: errors.message },
              hasError: { ...hasError, [value]: true },
            });
          }
        });
        if (!err.inner.some(errors => errors.path === value) && hasError[value]) {
          this.setState({
            error: { ...error, [value]: '' },
            hasError: { ...hasError, [value]: false },
          });
        }
      });
  }

  hasError = () => {
    const { hasError, touched } = this.state;
    let ifError = false;
    Object.keys(hasError).forEach((element) => {
      if ((hasError[element] === false) && (touched[element] === true)) {
        ifError = true;
      } else {
        ifError = false;
      }
    });
    return ifError;
  }

  forBlur =(value) => {
    this.validate(value);
  }

  handleChange = prop => (event) => {
    const { touched, credential } = this.state;
    this.setState({
      credential: { ...credential, [prop]: event.target.value },
      touched: { ...touched, [prop]: true },
    }, () => this.validate(prop));
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  callApiHandler = async (E) => {
    const { credential } = this.state;
    const { history } = this.props;
    E.preventDefault();
    this.setState({ loading: true });
    const response = await callApi(credential, 'login', 'post');
    if (response.status) {
      this.setState({
        loading: false,
      });
      localStorage.setItem('loginToken', response.data);
      history.push('/list');
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      showPassword,
      credential,
      error,
      loading,
    } = this.state;
    const { classes } = this.props;
    return (
        
          <main className={classes.main}>
            <Paper className={classes.paper}>
            <>
            <CssBaseline />
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
            Login
              </Typography>
              <form className={classes.form}>
                <TextField
                  id="outlined-email-input"
                  label="Username:"
                  fullWidth
                  error={Boolean(error.email || '')}
                  onChange={this.handleChange('email')}
                  onBlur={() => this.forBlur('email')}
                  value={credential.email}
                  type="email"
                  name="email"
                  autoComplete="email"
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText className={classes.error}>{error.email}</FormHelperText>
                <TextField
                  id="outlined-password-input"
                  label="Password:"
                  fullWidth
                  error={Boolean(error.password || '')}
                  type={showPassword ? 'text' : 'password'}
                  value={credential.password}
                  onChange={this.handleChange('password')}
                  onBlur={() => this.forBlur('password')}
                  autoComplete="current-password"
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText className={classes.error}>{error.password}</FormHelperText>
                {this.hasError() ? (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    color="primary"
                    className={classes.submit}
                    onClick={E => this.callApiHandler(E, undefined)}
                  >
                    {!loading
                      ? <b>Sign in</b>
                      : <CircularProgress size={25} />}
                  </Button>
                )
                  : (
                    <Button
                      disabled
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                     Sign in
                    </Button>
                  )
                }
              </form>
              </>
         </Paper>
       </main>
    );
  }
}
Login.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  history: PropTypes.shape({action: PropTypes.string.isRequired, length: PropTypes.number.isRequired}).isRequired,
};
export { Login };
export default withStyles(styles)(Login);
