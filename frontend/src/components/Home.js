import React, { useCallback, useContext, useState, useEffect } from "react";
import ConsecutiveSnackbarMessages from './plugins/ConsecutiveSnackbarMessages';
import classNames from "classnames";
import { Link } from "react-router-dom";
import { List, Divider, Paper, ListItemText, Button, Toolbar, withStyles } from "@material-ui/core";
import BeerTable from './BeerTable';
import Api from './Api';
import IconButton from '@mui/material/IconButton';
import LoopIcon from "@material-ui/icons/Loop";
import { Context } from './plugins/Store';

const styles = theme => ({
    toolbar: {
        justifyContent: "space-between"
    },
    divider: {
        backgroundColor: "rgba(0, 0, 0, 0.26)"
    },
    scaleMinus: {
        transform: "scaleX(-1)"
    },
    "@keyframes spin": {
        from: { transform: "rotate(359deg)" },
        to: { transform: "rotate(0deg)" }
    },
    spin: { animation: "$spin 2s infinite linear" },
    listItemSecondaryAction: { paddingRight: theme.spacing(1) }
});

function Home(props) {
    const { history, classes } = props;
    const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isDataBeingFetched, setIsDataBeingFetched] = useState(false);
    const [state, ] = useContext(Context);

    const getPushMessageFromChild = useCallback(
        (pushMessage) => {
            setPushMessageToSnackbar(() => pushMessage);
        },
        [setPushMessageToSnackbar]
    );

    const fetchTable = useCallback(async () => {
        setIsDataBeingFetched(true);
        const [status, resp] = await Api.getBeers(state.token);
        if (status) {
            setTransactions(resp.data);
        } else {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: resp ? resp.statusText : "Error"
            });
        }
        setIsDataBeingFetched(false);
    }, [pushMessageToSnackbar, setIsDataBeingFetched, state]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchTable, [state]);

    const deleteBeer = useCallback(async (id) => {
        setIsDataBeingFetched(true);
        const [status, resp] = await Api.deleteBeer(id, state.token);
        console.log(status);
        console.log(resp);  
        if (status) {
            fetchTable();
        } else {
            pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error"
            });
            setIsDataBeingFetched(false);
        }
    }, [state, pushMessageToSnackbar, fetchTable]);

    return (
        <div>
            <Paper style={{margin: '8em 10em 0 10em'}}>
                <List disablePadding>
                    <Toolbar>
                    <ListItemText primary="Beers" secondary="No filters" />
                    <Link
                      key="AddBeer"
                      to="/add"
                      className={classes.noDecoration}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            disableElevation
                        >
                            Add Beer
                        </Button>
                    </Link>
                    <IconButton color="primary" onClick={fetchTable}>
                    <LoopIcon
                        color="primary"
                        className={classNames(
                            isDataBeingFetched ? classes.spin : null,
                            classes.scaleMinus
                        )}
                    />
                    </IconButton>
                    </Toolbar>
                    <Divider />
                    <BeerTable transactions={transactions} deleteBeer={deleteBeer} history={history} />
                </List>
            </Paper>

            <ConsecutiveSnackbarMessages
                getPushMessageFromChild={getPushMessageFromChild}
            />
        </div>
    )
}

export default withStyles(styles)(Home);