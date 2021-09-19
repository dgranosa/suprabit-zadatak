import React, { useState, useCallback, Fragment } from "react";
import PropTypes from "prop-types";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import ModalBackdrop from './ModalBackdrop';

function DialogSelector(props) {
  const {
    dialogOpen,
    onClose,
  } = props;
  const [loginStatus, setLoginStatus] = useState(null);
  const [registerStatus, setRegisterStatus] = useState(null);

  const _onClose = useCallback(() => {
    setLoginStatus(null);
    setRegisterStatus(null);
    onClose();
  }, [onClose, setLoginStatus, setRegisterStatus]);

  const printDialog = useCallback(() => {
    switch (dialogOpen) {
      case "login":
        return (
          <LoginDialog
            onClose={_onClose}
            status={loginStatus}
            setStatus={setLoginStatus}
          />
        );
      case "register":
        return (
          <RegisterDialog
            onClose={_onClose}
            status={registerStatus}
            setStatus={setRegisterStatus}
          />
        )
      default:
    }
  }, [
    dialogOpen,
    _onClose,
    loginStatus,
    setLoginStatus,
    registerStatus,
    setRegisterStatus
  ]);

  return (
    <Fragment>
      {dialogOpen && <ModalBackdrop open />}
      {printDialog()}
    </Fragment>
  );
}

DialogSelector.propTypes = {
  dialogOpen: PropTypes.string,
  openLoginDialog: PropTypes.func.isRequired,
  openRegisterDialog: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DialogSelector;
