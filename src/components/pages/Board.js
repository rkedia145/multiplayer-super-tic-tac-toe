import React, {useState, useEffect}  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Tile from './Tile';

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
}));

const Board = (props) => {
  const classes = useStyles();

  // extracting necessary fields from the props
  const {prevCoordinate, gameResult, isEnabled, boardIndex, board, handleOnClick} = props
  var tiles = [];
  var counter = 0;
  const boardResult = board.boardResult
  for (let i = 0; i < 9; i++){
    const value = board.board[i]
    tiles.push(
      <Tile prevCoordinate={prevCoordinate} gameResult={gameResult} boardResult={boardResult} value={value} isEnabled={isEnabled} index={i} boardIndex={boardIndex} key={counter} handleOnClick={handleOnClick}/>
    );
    counter += 1;
  }

  return (
      <Grid item xs={4} container>
        {tiles}
      </Grid>
  );
}

export default Board