import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Divider, Paper, TextField, Grid, withStyles, Button, IconButton, Typography } from '@material-ui/core';
import { Stack } from '@mui/material';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Context } from './plugins/Store';
import ConsecutiveSnackbarMessages from './plugins/ConsecutiveSnackbarMessages';
import ButtonCircularProgress from './plugins/ButtonCircularProgress';
import Api from './Api';
import { useParams } from "react-router-dom";
import { format } from 'date-fns';

const styles = theme => ({
});

function ShowBeer(props) {
    const { history } = props;
    const { id } = useParams();
    const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
    const [beerName, setBeerName] = useState("");
    const [beerTagline, setBeerTagline] = useState("");
    const [beerYeast, setBeerYeast] = useState("");
    const [beerBrew, setBeerBrew] = useState("");
    const [beerImage, setBeerImage] = useState("");
    const [beerFood, setBeerFood] = useState([]);
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
        if (status) {
            setBeerName(resp.data.name);
            setBeerTagline(resp.data.tagline);
            setBeerBrew(format(new Date(resp.data.first_brewed), 'MMMM yyyy'));
            setBeerYeast(resp.data.yeast);
            setBeerImage(resp.data.image_url);
        } else {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: resp ? resp.data.error.message : "Error beer"
            });
        }

        const [statusF, respF] = await Api.getBeerFood(id, state.token);
        if (statusF) {
            setBeerFood(respF.data.map((food) => food.name));
        } else {
            pushMessageToSnackbar && pushMessageToSnackbar({
                text: respF ? respF.data.error.message : "Error food"
            });
        }
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

    return (
        <div>
            <Paper style={{margin: '8em 10em 0 10em', padding: '1.5em'}}>
                <IconButton onClick={() => history.replace('/')}>
                    <ArrowBackIcon/>
                </IconButton>
                <Divider />
                <Grid container spacing={0}>
                    <Grid conteiner xs={7}>
                    <Grid item>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Name"
                            value={beerName}
                            autoComplete="off"
                            type="text"
                            disabled={true}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Tagline"
                            value={beerTagline}
                            autoComplete="off"
                            type="text"
                            disabled={true}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="First Brewed"
                            value={beerBrew}
                            autoComplete="off"
                            type="text"
                            disabled={true}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Yeast"
                            value={beerYeast}
                            autoComplete="off"
                            type="text"
                            disabled={true}
                        />
                    </Grid>

                    {beerFood.length > 0 &&
                    <Grid item>
                        <Typography variant="h6">Food Pairing:</Typography>
                        {beerFood.map((food) => (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Name"
                                value={food}
                                autoComplete="off"
                                type="text"
                                disabled={true}
                                key={food}
                            />
                        ))}
                    </Grid>
                    }
                    <Grid item xs={10}>
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
                    <Grid item xs={5} style={{alignContent: 'center', display: 'flex'}}>
                        <img src={beerImage} alt="" height='300px' style={{margin: '2em auto 2em auto'}}></img>
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