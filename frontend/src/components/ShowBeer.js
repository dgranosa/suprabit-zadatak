import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Paper, TextField, Grid, withStyles, Button } from '@material-ui/core';
import { Stack } from '@mui/material';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Context } from './plugins/Store';
import ConsecutiveSnackbarMessages from './plugins/ConsecutiveSnackbarMessages';
import ButtonCircularProgress from './plugins/ButtonCircularProgress';
import Api from './Api';
import { useParams } from "react-router-dom";

const styles = theme => ({
});

function ShowBeer(props) {
    const { history } = props;
    const { id } = useParams();
    const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
    const [beerName, setBeerName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [state, ] = useContext(Context);

    const getPushMessageFromChild = useCallback(
        (pushMessage) => {
            setPushMessageToSnackbar(() => pushMessage);
        },
        [setPushMessageToSnackbar]
    );

    const fetchBeer = useCallback(async () => {
        setIsLoading(true);
        const [status, resp] = await Api.getBeer(id, state.token);
        console.log(status);
        console.log(resp);
        if (status) {
            setBeerName(resp.data.name);
        } else {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error"
            });
        }
        setIsLoading(false);
    }, [id, state, pushMessageToSnackbar]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchBeer, [state]);

    const deleteBeer = useCallback(async () => {
        setIsLoading(true);
        const [status, resp] = await Api.deleteBeer(id, state.token);
        console.log(status);
        console.log(resp);  
        if (status) {
            history.push('/');
        } else {
            pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error"
            });
        }
        setIsLoading(false);
    }, [state, pushMessageToSnackbar, id, history]);

    return (
        <div>
            <Paper style={{margin: '8em 10em 0 10em', padding: '1.5em'}}>
                <Grid container spacing={5}>
                    <Grid item xs={8}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Name"
                            value={beerName}
                            autoFocus
                            autoComplete="off"
                            type="text"
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Stack direction="row" spacing={2}>
                            <Button
                                endIcon={<EditIcon />}
                                fullWidth
                                variant="contained"
                                color="secondary"
                                size="large"
                                disabled={isLoading}
                                onClick={() => {
                                    history.push('/edit/' + id);
                                }}
                            >Edit</Button>
                            <Button
                                endIcon={<DeleteIcon />}
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isLoading}
                                onClick={deleteBeer}
                            >Delete</Button>
                            {isLoading && <ButtonCircularProgress />}
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
            
            <ConsecutiveSnackbarMessages
                getPushMessageFromChild={getPushMessageFromChild}
            />
        </div>
    );
}

export default withStyles(styles)(ShowBeer);