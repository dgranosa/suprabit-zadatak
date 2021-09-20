import React, { memo, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Hidden,
  IconButton,
  withStyles,
  Chip
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import UserIcon from "@material-ui/icons/Person";
import NavigationDrawer from "./plugins/NavigationDrawer";
import { Context } from './plugins/Store';

const styles = theme => ({
  appBar: {
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.common.white
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  },
  menuButtonText: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.h6.fontWeight
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400
  },
  noDecoration: {
    textDecoration: "none !important"
  }
});

function NavBar(props) {
  const {
    classes,
    openLoginDialog,
    openRegisterDialog,
    handleMobileDrawerOpen,
    handleMobileDrawerClose,
    mobileDrawerOpen,
    selectedTab
  } = props;
  const [state, dispatch] = useContext(Context);

  const menuItems = [
    {
      name: "Home",
      link: "/",
      hidden: false,
      icon: <HomeIcon className="text-white" />
    },
    {
      name: "Register",
      onClick: openRegisterDialog,
      hidden: state.user ? true : false,
      icon: <HowToRegIcon className="text-white" />
    },
    {
      name: "Login",
      onClick: openLoginDialog,
      hidden: state.user ? true : false,
      icon: <LockOpenIcon className="text-white" />
    },
    {
      name: "Logout",
      onClick: () => dispatch({type: 'CLEAR_LOGIN'}),
      hidden: state.user ? false : true,
      icon: <LogoutIcon className="text-white" />
    }
  ];
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div>
            <Typography
              variant="h4"
              className={classes.brandText}
              display="inline"
              color="primary"
            >
              Be
            </Typography>
            <Typography
              variant="h4"
              className={classes.brandText}
              display="inline"
              color="secondary"
            >
              er
            </Typography>
          </div>
          <div>
            <Hidden mdUp>
              <IconButton
                className={classes.menuButton}
                onClick={handleMobileDrawerOpen}
                aria-label="Open Navigation"
              >
                <MenuIcon color="primary" />
              </IconButton>
            </Hidden>
            <Hidden smDown>
              {menuItems.map(element => {
                if (element.link) {
                  return (
                    <Link
                      key={element.name}
                      to={element.link}
                      className={classes.noDecoration}
                      onClick={handleMobileDrawerClose}
                      hidden={element.hidden}
                    >
                      <Button
                        color="secondary"
                        size="large"
                        classes={{ text: classes.menuButtonText }}
                      >
                        {element.name}
                      </Button>
                    </Link>
                  );
                }
                return (
                  <Link to='#' hidden={element.hidden} key={element.name}>
                  <Button
                    color="secondary"
                    size="large"
                    onClick={element.onClick}
                    classes={{ text: classes.menuButtonText }}
                    key={element.name}
                  >
                    {element.name}
                  </Button>
                  </Link>
                );
              })}
            </Hidden>
            {state.user ? <Chip avatar={<Avatar><UserIcon /></Avatar>} label={state.user} color="secondary" variant="outlined" /> : ''}
          </div>
        </Toolbar>
      </AppBar>
      <NavigationDrawer
        menuItems={menuItems}
        anchor="right"
        open={mobileDrawerOpen}
        selectedItem={selectedTab}
        onClose={handleMobileDrawerClose}
      />
    </div>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleMobileDrawerOpen: PropTypes.func,
  handleMobileDrawerClose: PropTypes.func,
  mobileDrawerOpen: PropTypes.bool,
  selectedTab: PropTypes.string,
  openLoginDialog: PropTypes.func.isRequired,
  openRegisterDialog: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(NavBar));
