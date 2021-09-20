import React, { useRef, useCallback, useContext, useState } from 'react';
import { Box, Paper, TextField, Grid, withStyles, Button, IconButton, Typography } from '@material-ui/core';
import { Stack } from '@mui/material';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { Context } from './plugins/Store';
import ButtonCircularProgress from './plugins/ButtonCircularProgress';
import ConsecutiveSnackbarMessages from './plugins/ConsecutiveSnackbarMessages';
import Api from './Api';
import DatePicker from '@mui/lab/DatePicker';

const styles = theme => ({
});

function AddBeer(props) {
    const { history } = props;
    const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState();
    const beerName = useRef();
    const beerTagline = useRef();
    const [beerBrew, setBeerBrew] = useState(null);
    const beerYeast = useRef();
    const [beerImage, setBeerImage] = useState("");
    const [beerFood, setBeerFood] = useState([]);
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
            name: beerName.current.value,
            tagline: beerTagline.current.value,
            first_brewed: beerBrew,
            yeast: beerYeast.current.value,
            image_url: beerImage,
        }

        const [status, resp] = await Api.addBeer(beer, state.token);
        if (!status) {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error"
            });
            setIsLoading(false);
            return;
        }

        await Api.editBeerFood(resp.data.id, [], beerFood, state.token);

        setIsLoading(false);
        history.push('show/' + resp.data.id);
    }, [pushMessageToSnackbar, state, history, beerFood, beerBrew, beerImage]);

    return (
        <div>
            <Paper style={{margin: '8em 10em 0 10em', padding: '1.5em'}}>
                <form onSubmit={submit}>
                    <Grid container>
                        <Grid conteiner xs={7}>
                            <Grid item>
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
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    error={status !== null}
                                    required
                                    fullWidth
                                    label="Tagline"
                                    inputRef={beerTagline}
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
                            <Grid item>
                                <DatePicker
                                    views={['year', 'month']}
                                    label="Year and Month"
                                    maxDate={Date.now()}
                                    value={beerBrew}
                                    onChange={(v) => setBeerBrew(v)}
                                    renderInput={(params) => <TextField variant="outlined" margin="normal" required fullWidth {...params} helperText={null} />}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    error={status !== null}
                                    required
                                    fullWidth
                                    label="Yeast"
                                    inputRef={beerYeast}
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
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    error={status !== null}
                                    fullWidth
                                    label="Image URL"
                                    value={beerImage}
                                    autoComplete="off"
                                    type="text"
                                    FormHelperTextProps={{ error: true }}
                                    onChange={(e) => {
                                        setBeerImage(e.target.value);
                                    }}
                                />
                            </Grid>

                            <Grid item>
                                <Typography variant="h6">Food Pairing:</Typography>
                                {beerFood.map((food, i) => (
                                    <div>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        label="Name"
                                        value={beerFood[i]}
                                        autoComplete="off"
                                        type="text"
                                        style={{width: '96%'}}
                                        onChange={(e) => {
                                            const a = [...beerFood];
                                            a[i] = e.target.value;
                                            setBeerFood(a);
                                        }}
                                    />
                                    <IconButton onClick={() => {const a = [...beerFood]; a.splice(i, 1); setBeerFood(a);}}><CloseIcon/></IconButton>
                                    </div>
                                ))}
                                <Box component="span" sx={{ p: 2, border: '1px dashed grey', display: 'block' }}>
                                <Button fullWidth onClick={() => setBeerFood(beerFood.concat(['']))}>Add Food +</Button>
                                </Box>
                            </Grid>
                            <Grid item xs={10} style={{marginTop: '1em'}}>
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
                        <Grid item xs={5} style={{alignContent: 'center', display: 'flex'}}>
                            <img src={beerImage} alt="" height='300px' style={{margin: '2em auto 2em auto'}}></img>
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