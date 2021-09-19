import React, { useRef, useCallback, useContext, useState } from 'react';
import { Paper, TextField, Grid, withStyles, Button } from '@material-ui/core';
import { Stack } from '@mui/material';
import SendIcon from '@material-ui/icons/Send';
import { Context } from './plugins/Store';
import ButtonCircularProgress from './plugins/ButtonCircularProgress';
import ConsecutiveSnackbarMessages from './plugins/ConsecutiveSnackbarMessages';
import Api from './Api';

const styles = theme => ({
});

function AddBeer(props) {
    const { history } = props;
    const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState();
    const beerName = useRef();
    const [state, ] = useContext(Context);

    const getPushMessageFromChild = useCallback(
        (pushMessage) => {
            setPushMessageToSnackbar(() => pushMessage);
        },
        [setPushMessageToSnackbar]
    );

    const submit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const beer = {
            name: beerName.current.value
        }

        const [status, resp] = await Api.addBeer(beer, state.token);
        console.log(status);
        console.log(resp);
        if (status) {
            history.push('show/' + resp.data.id);
        } else {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error"
            });
        }

        setIsLoading(false);
    }, [pushMessageToSnackbar, state, history]);

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
                                inputRef={beerName}
                                autoFocus
                                autoComplete="off"
                                type="text"
                                onChange={() => {
                                    if (status !== null) {
                                        setStatus(null);
                                    }
                                }}
                                FormHelperTextProps={{ error: true }}
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

export default withStyles(styles)(AddBeer);