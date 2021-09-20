import React, { useCallback, useContext, useState, useEffect, useRef } from "react";
import ConsecutiveSnackbarMessages from './plugins/ConsecutiveSnackbarMessages';
import classNames from "classnames";
import { Link } from "react-router-dom";
import { List, Divider, Grid, Paper, ListItemText, Button, Toolbar, withStyles, Accordion, AccordionSummary, AccordionDetails, TextField, Typography } from "@material-ui/core";
import BeerTable from './BeerTable';
import Api from './Api';
import IconButton from '@mui/material/IconButton';
import LoopIcon from "@material-ui/icons/Loop";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import { Context } from './plugins/Store';
import DatePicker from '@mui/lab/DatePicker';
import { format } from 'date-fns';

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
    const filterNameRef = useRef();
    const filterYeastRef = useRef();
    const [filterBrew, setFilterBrew] = useState([null, null]);
    const [filter, setFilter] = useState(null);
    const [filterStatus, setFilterStatus] = useState('No filters');

    const getPushMessageFromChild = useCallback(
        (pushMessage) => {
            setPushMessageToSnackbar(() => pushMessage);
        },
        [setPushMessageToSnackbar]
    );

    const fetchTable = useCallback(async () => {
        setIsDataBeingFetched(true);
        const [status, resp] = await Api.getBeers(filter, state.token);
        if (status) {
            setTransactions(resp.data);
        } else {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: resp ? resp.statusText : "Error"
            });
        }
        setIsDataBeingFetched(false);
    }, [pushMessageToSnackbar, setIsDataBeingFetched, state, filter]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchTable, [state]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchTable, [filter]);

    const deleteBeer = useCallback(async (id) => {
        setIsDataBeingFetched(true);
        const [status, resp] = await Api.deleteBeer(id, state.token);
        if (status) {
            fetchTable();
        } else {
            pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error"
            });
            setIsDataBeingFetched(false);
        }
    }, [state, pushMessageToSnackbar, fetchTable]);

    const updateFilters = useCallback(() => {
        var cFilter = {};
        const cFilterStatus = [];
        if (filterNameRef.current.value.length !== 0) {
            cFilter = {
                ...cFilter,
                name: { ilike: '%' + filterNameRef.current.value + '%' }
            }
            cFilterStatus.push('Name = ' + filterNameRef.current.value);
        }

        if (filterYeastRef.current.value.length !== 0) {
            cFilter = {
                ...cFilter,
                yeast: { ilike: '%' + filterYeastRef.current.value + '%' }
            }
            cFilterStatus.push('Yeast = ' + filterYeastRef.current.value);
        }

        if (filterBrew[0] !== null && filterBrew[1] !== null) {
            console.log(filterBrew);
            cFilter = {
                ...cFilter,
                first_brewed: { between: filterBrew }
            }
            cFilterStatus.push('First Brewed = ' + format(filterBrew[0], 'MMMM yyyy') + ' - ' + format(filterBrew[1], 'MMMM yyyy'));
        }

        if (cFilterStatus.length === 0) {
            setFilter(null);
            setFilterStatus('No filters')
            return;
        }

        setFilter({ where: cFilter });
        setFilterStatus(cFilterStatus.join(', '));
    }, [filterBrew]);

    const clearFilters = useCallback(() => {
        filterNameRef.current.value = "";
        filterYeastRef.current.value = "";
        setFilterBrew([null, null]);
        updateFilters();
    }, [updateFilters]);

    return (
        <div>
            <Accordion style={{margin: '8em 10em 0 10em'}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Filters</AccordionSummary>
                <Divider />
                <AccordionDetails>
                <Grid container>
                    <IconButton onClick={clearFilters} style={{'margin-left': 'auto'}}><CloseIcon/></IconButton>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Name"
                        autoFocus
                        autoComplete="off"
                        type="text"
                        inputRef={filterNameRef}
                        onChange={updateFilters}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Yeast"
                        autoFocus
                        autoComplete="off"
                        type="text"
                        inputRef={filterYeastRef}
                        onChange={updateFilters}
                    />
                    <Grid container>
                    <Grid item xs={5}>
                    <DatePicker
                        views={['year', 'month']}
                        label="First Brewed Start"
                        maxDate={Date.now()}
                        value={filterBrew[0]}
                        onChange={(v) => {const t = [...filterBrew]; t[0] = v; setFilterBrew(t); updateFilters();}}
                        renderInput={(params) => <TextField fullWidth margin="normal" variant="outlined" {...params} helperText={null} />}
                    />
                    </Grid>
                    <Grid item xs={2}><Typography align='center' variant="h2" style={{'margin-top': '16px'}}>-</Typography></Grid>
                    <Grid item xs={5}>
                    <DatePicker
                        views={['year', 'month']}
                        label="First Brewed End"
                        maxDate={Date.now()}
                        value={filterBrew[1]}
                        onChange={(v) => {const t = [...filterBrew]; t[1] = v; setFilterBrew(t); updateFilters();}}
                        renderInput={(params) => <TextField fullWidth margin="normal" variant="outlined" {...params} helperText={null} />}
                    />
                    </Grid>
                    </Grid>
                </Grid>
                </AccordionDetails>
            </Accordion>
            <Paper style={{margin: '1em 10em 0 10em'}}>
                <List disablePadding>
                    <Toolbar>
                    <ListItemText primary="Beers" secondary={filterStatus} />
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