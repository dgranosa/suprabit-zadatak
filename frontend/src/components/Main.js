import { Switch, Route } from "react-router-dom";
import Home from './Home';
import AddBeer from './AddBeer';
import EditBeer from './EditBeer';
import ShowBeer from './ShowBeer';
import { withStyles } from "@material-ui/core";
import React, { memo } from "react";

const styles = (theme) => ({
    main: {
        marginLeft: theme.spacing(9),
        
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

        [theme.breakpoints.down("xs")]: {
            marginLeft: 0,
        },
    },
});

function Main(props) {

    return (
        <main>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/add" component={AddBeer}/>
                <Route exact path="/edit/:id" component={EditBeer}/>
                <Route exact path="/show/:id" component={ShowBeer}/>
            </Switch>
        </main>
    )
}

export default withStyles(styles, { withTheme: true })(memo(Main));