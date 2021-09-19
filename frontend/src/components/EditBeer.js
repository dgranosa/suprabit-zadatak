import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Paper, TextField, Grid, withStyles, Button } from '@material-ui/core';
import { Stack } from '@mui/material';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import { Context } from './plugins/Store';
import ButtonCircularProgress from './plugins/ButtonCircularProgress';
import ConsecutiveSnackbarMessages from './plugins/ConsecutiveSnackbarMessages';
import Api from './Api';
import { useParams } from "react-router-dom";

const styles = theme => ({
});

function EditBeer(props) {
    const { history } = props;
    const { id } = useParams();
    const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState();
    const [beerName, setBeerName] = useState("");
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

    const submit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const beer = {
            name: beerName
        }

        const [status, resp] = await Api.editBeer(id, beer, state.token);
        console.log(status);
        console.log(resp);
        if (status) {
            history.push('/show/' + id);
        } else {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error"
            });
            setStatus('invalid')
        }

        setIsLoading(false);
    }, [pushMessageToSnackbar, state, history, beerName, id]);

    return (
        <div>
            <Paper style={{margin: '8em 10em 0 10em', padding: '1.5em'}}>
                <form onSubmit={submit}>
                    <Grid container spacing={5}>
                        <Grid item xs={8}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                error={status !== null}
                                required
                                fullWidth
                                label="Name"
                                value={beerName}
                                autoFocus
                                autoComplete="off"
                                type="text"
                                FormHelperTextProps={{ error: true }}
                                onChange={(e) => {
                                    setBeerName(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    endIcon={<SendIcon />}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    disabled={isLoading}
                                    size="large"
                                >Submit</Button>
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
                </form>
            </Paper>
            
            <ConsecutiveSnackbarMessages
                getPushMessageFromChild={getPushMessageFromChild}
            />
        </div>
    );
}

export default withStyles(styles)(EditBeer);