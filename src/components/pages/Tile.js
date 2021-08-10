import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
// import black from "@material-ui/core/colors/black";


function useStyles(isEnabled, boardResult, isPrevClick) {
    var bgdColor = 'white';
    if (boardResult == 'X'){
        bgdColor = 'lightblue';
    } 
    else if (boardResult == 'O'){
        bgdColor = 'darkseagreen';
    } else if (boardResult == 'D'){
        bgdColor = 'sandybrown';
    }
    else if (isEnabled){
        bgdColor = 'gray'
    }

    var border = `1px solid black`
    if (isPrevClick) {
        border = `1.5px solid red`
    }

    const classes = makeStyles((theme) => ({
        root: {
        flexGrow: 1,
        },
        paper: {
        padding: theme.spacing(3),
        textAlign: 'center',
        //   color: theme.palette.text.secondary,
        color: 'black',
        backgroundColor: bgdColor,
        border: border,
        fontSize: '1rem',
        height: '1rem',
        },
    }));
    return classes();
}

const Tile = (props) => {

    const isPrevClick = (prevCoordinate, boardIndex, index) => {
        if (!prevCoordinate){
            return false
        }
        if (
            (prevCoordinate.prevBoard == boardIndex) &&
            (prevCoordinate.prevIndex == index)
        ) {
            return true
        } else {
            return false
        }
    }
    
    // extracting necessary fields from the props
    const {prevCoordinate, gameResult, boardResult, value, isEnabled, index, boardIndex, handleOnClick} = props
    const classes = useStyles(isEnabled, boardResult, isPrevClick(prevCoordinate, boardIndex, index));

    const childToParentOnClick = (event) => {
        console.log("here!")
        if (isEnabled && (boardResult == 'U') && (value == null) && (gameResult == 'U')) {
            handleOnClick(boardIndex, index)
        }
    }

    return (
        <Grid item xs={4}>
          <Paper className={classes.paper} onClick={childToParentOnClick}>{value}</Paper>
        </Grid>
    )
}

export default Tile;