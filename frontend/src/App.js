import './App.css';
import NavBar from './components/Navbar'
import React, { useState, useCallback } from "react";
import DialogSelector from './components/plugins/DialogSelector'
import Main from './components/Main';
import theme from './theme'
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import GlobalStyles from "./GlobalStyles";
import Store from './components/plugins/Store';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

function App(props) {
  const [selectedTab, setSelectedTab] = useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(null);

  const openLoginDialog = useCallback(() => {
    setDialogOpen("login");
    setIsMobileDrawerOpen(false);
  }, [setDialogOpen, setIsMobileDrawerOpen]);

  const openRegisterDialog = useCallback(() => {
    setDialogOpen("register");
    setIsMobileDrawerOpen(false);
  }, [setDialogOpen, setIsMobileDrawerOpen]);

  const closeDialog = useCallback(() => {
    setDialogOpen(null);
  }, [setDialogOpen]);

  const handleMobileDrawerOpen = useCallback(() => {
    setIsMobileDrawerOpen(true);
  }, [setIsMobileDrawerOpen]);

  const handleMobileDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, [setIsMobileDrawerOpen]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles />
    <Store>
      <DialogSelector
        openLoginDialog={openLoginDialog}
        openRegisterDialog={openRegisterDialog}
        dialogOpen={dialogOpen}
        onClose={closeDialog}
      />
      <NavBar
        selectedTab={selectedTab}
        selectTab={setSelectedTab}
        openLoginDialog={openLoginDialog}
        openRegisterDialog={openRegisterDialog}
        mobileDrawerOpen={isMobileDrawerOpen}
        handleMobileDrawerOpen={handleMobileDrawerOpen}
        handleMobileDrawerClose={handleMobileDrawerClose}
      />
      <Main />
    </Store>
    </MuiThemeProvider>
    </LocalizationProvider>
  );
}

export default App;