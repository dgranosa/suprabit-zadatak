import React, { useContext, useState, useCallback, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import {
  TextField,
  Button,
  withStyles,
} from "@material-ui/core";
import FormDialog from "./FormDialog";
import HighlightedInformation from "./HighlightedInformation";
import ButtonCircularProgress from "./ButtonCircularProgress";
import VisibilityPasswordTextField from "./VisibilityPasswordTextField";
import Api from '../Api';
import {Context} from '../plugins/Store';

const styles = (theme) => ({
  forgotPassword: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    cursor: "pointer",
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
  disabledText: {
    cursor: "auto",
    color: theme.palette.text.disabled,
  },
  formControlLabel: {
    marginRight: 0,
  },
});

function LoginDialog(props) {
  const {
    setStatus,
    onClose,
    status,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginEmail = useRef();
  const loginPassword = useRef();

  const [, dispatch] = useContext(Context);

  const login = useCallback(async () => {
    setIsLoading(true);
    setStatus(null);
    /*if (loginEmail.current.value !== "test@web.com") {
      setTimeout(() => {
        setStatus("invalidEmail");
        setIsLoading(false);
      }, 1500);
    } else if (loginPassword.current.value !== "HaRzwc") {
      setTimeout(() => {
        setStatus("invalidPassword");
        setIsLoading(false);
      }, 1500);
    } else {
      setTimeout(() => {
        history.push("/c/dashboard");
      }, 150);
    }*/
    const [status, resp] = await Api.login(loginEmail.current.value, loginPassword.current.value);
    if (status) {
      dispatch({type: 'SET_LOGIN', payload: {user: loginEmail.current.value, token: resp.data.token}});
      onClose();
    } else {
      setStatus(resp);
      setIsLoading(false);
    }
  }, [onClose, setIsLoading, loginEmail, loginPassword, setStatus, dispatch]);

  return (
    <Fragment>
      <FormDialog
        open
        onClose={onClose}
        loading={isLoading}
        onFormSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        hideBackdrop
        headline="Login"
        content={
          <Fragment>
            <TextField
              variant="outlined"
              margin="normal"
              error={status !== null}
              required
              fullWidth
              label="Email Address"
              inputRef={loginEmail}
              autoFocus
              autoComplete="off"
              type="email"
              onChange={() => {
                if (status !== null) {
                  setStatus(null);
                }
              }}
              FormHelperTextProps={{ error: true }}
            />
            <VisibilityPasswordTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={status !== null}
              label="Password"
              inputRef={loginPassword}
              autoComplete="off"
              onChange={() => {
                if (status !== null) {
                  setStatus(null);
                }
              }}
              helperText={
                status !== null ? (
                  <span>
                    Incorrect password. Try again.
                  </span>
                ) : (
                  ""
                )
              }
              FormHelperTextProps={{ error: true }}
              onVisibilityChange={setIsPasswordVisible}
              isVisible={isPasswordVisible}
            />
            {status && status.data ? (
              <HighlightedInformation>
                {status.data.error.message}
              </HighlightedInformation>
            ) : (
              <HighlightedInformation>
                Email is: <b>user@example.com</b>
                <br />
                Password is: <b>stringst</b>
              </HighlightedInformation>
            )}
          </Fragment>
        }
        actions={
          <Fragment>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={isLoading}
              size="large"
            >
              Login
              {isLoading && <ButtonCircularProgress />}
            </Button>
          </Fragment>
        }
      />
    </Fragment>
  );
}

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  openChangePasswordDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.string,
};

export default withRouter(withStyles(styles)(LoginDialog));
