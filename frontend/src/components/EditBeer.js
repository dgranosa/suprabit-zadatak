import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Box, Divider, Paper, TextField, Grid, withStyles, Button, IconButton, Typography } from '@material-ui/core';
import { Stack } from '@mui/material';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import { Context } from './plugins/Store';
import ButtonCircularProgress from './plugins/ButtonCircularProgress';
import ConsecutiveSnackbarMessages from './plugins/ConsecutiveSnackbarMessages';
import Api from './Api';
import { useParams } from "react-router-dom";
import DatePicker from '@mui/lab/DatePicker';

const styles = theme => ({
});

function EditBeer(props) {
    const { history } = props;
    const { id } = useParams();
    const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState();
    const [beerName, setBeerName] = useState("");
    const [beerTagline, setBeerTagline] = useState("");
    const [beerYeast, setBeerYeast] = useState("");
    const [beerBrew, setBeerBrew] = useState(null);
    const [beerImage, setBeerImage] = useState("");
    const [beerFood, setBeerFood] = useState([]);
    const [beerFoodIds, setBeerFoodIds] = useState([]);
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
        if (!status) {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error"
            });
            setIsLoading(false);
            return;
        }

        const [statusF, respF] = await Api.getBeerFood(id, state.token);
        if (!statusF) {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: respF ? respF.data.error.message : "Error food"
            });
            setIsLoading(false);
            return;
        }

        setBeerName(resp.data.name);
        setBeerTagline(resp.data.tagline);
        setBeerBrew(new Date(resp.data.first_brewed));
        setBeerYeast(resp.data.yeast);
        setBeerImage(resp.data.image_url);
        setBeerFood(respF.data.map((food) => food.name));
        setBeerFoodIds(respF.data.map((food) => food.id));
        setIsLoading(false);
    }, [id, state, pushMessageToSnackbar]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchBeer, [state]);

    const deleteBeer = useCallback(async () => {
        setIsLoading(true);
        const [status, resp] = await Api.deleteBeer(id, state.token);
        if (status) {
            history.replace('/');
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
            name: beerName,
            tagline: beerTagline,
            first_brewed: beerBrew,
            yeast: beerYeast,
            image_url: beerImage
        }

        const [status, resp] = await Api.editBeer(id, beer, state.token);
        if (!status) {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error"
            });
            setStatus('invalid')
            setIsLoading(false);
            return;
        }

        await Api.editBeerFood(id, beerFoodIds, beerFood.filter((e) => e), state.token);

        history.replace('/show/' + id);
        setIsLoading(false);
    }, [pushMessageToSnackbar, state, history, beerName, id, beerFoodIds, beerFood, beerTagline, beerBrew, beerYeast, beerImage]);

    return (
        <div>
            <Paper style={{margin: '8em 10em 0 10em', padding: '1.5em'}}>
                <form onSubmit={submit}>
                    <IconButton onClick={() => history.length > 0 ? history.goBack() : history.push('/')}>
                        <ArrowBackIcon/>
                    </IconButton>
                    <Divider />
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
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    error={status !== null}
                                    required
                                    fullWidth
                                    label="Tagline"
                                    value={beerTagline}
                                    autoComplete="off"
                                    type="text"
                                    FormHelperTextProps={{ error: true }}
                                    onChange={(e) => {
                                        setBeerTagline(e.target.value);
                                    }}
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
                                    value={beerYeast}
                                    autoComplete="off"
                                    type="text"
                                    FormHelperTextProps={{ error: true }}
                                    onChange={(e) => {
                                        setBeerYeast(e.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    label="Image Url"
                                    value={beerImage}
                                    autoComplete="off"
                                    type="text"
                                    onChange={(e) => {
                                        setBeerImage(e.target.value);
                                    }}
                                />
                            </Grid>

                            <Grid item>
                                <Typography variant="h6">Food Pairing:</Typography>
                                {beerFood.map((food, i) => (
                                    <div key={food}>
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

export default withStyles(styles)(EditBeer);