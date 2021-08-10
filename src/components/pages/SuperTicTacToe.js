import React, {useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';


import SmallGrid from './Board';


const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    width: 550,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    border: `1px solid black`,
    fontSize: '2rem',
    height: '4rem',
    // color: theme.palette.text.secondary,
  },
}));

const initializeGame = () => {
  const newGame = {
    'currSmallGrid': 4,
    'gameResult': 0,
    'currUser': 1,
    'prevCoordinate': {'prevSmallGrid': -1, 'prevRowIndex': -1, 'prevColIndex': -1},
  }
  const largeGrid = [];
  for (let i = 0; i < 9; i++){
    largeGrid.push(initializeSmallGrid(i == newGame.currSmallGrid))
  }
  newGame.largeGrid = largeGrid
  return newGame
}

const initializeSmallGrid = (isCurrSmallGrid) => {
  return {
    'isCurrSmallGrid': isCurrSmallGrid,
    'grid': [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    'gridResult': 0,
  }
}

const SuperTicTacToe = (props) => {
  const [game, setGame] = useState(initializeGame())
  // const [gameEth, getGame, saveGame, resetGame] = useEthConnector()
  // const [isLargeGridLoaded, setLargeGridLoaded] = useState(false)

  // Needed if using blockchain as backend
  // useEffect(() => {
  //   if (!isLargeGridLoaded) {
  //     console.log("Grid not loaded yet!")
  //     getGame()
  //     console.log("Grid now loaded!")
  //   }

  //   if (gameEth && !game) {
  //     setGame(gameEth)
  //     setLargeGridLoaded(true)
  //   }
  // })

  const handleOnClick = async (smallGridIndex, rowIndex, colIndex) => {
    console.log("Current Small Grid: ", game.currSmallGrid)
    if (!isFilled(smallGridIndex, rowIndex, colIndex)){
      const newSmallGrid = coordinatesToIndex(rowIndex, colIndex)
      const newGame = JSON.parse(JSON.stringify(game))
      newGame.largeGrid[smallGridIndex].grid[rowIndex][colIndex] = game.currUser
      const [isSolved, gridResult] = checkSmallGrid(smallGridIndex, newGame.largeGrid)
      newGame.largeGrid[smallGridIndex].gridResult = gridResult
      newGame.largeGrid[smallGridIndex].grid[rowIndex][colIndex] = game.currUser
      const gameResult = checkLargeGrid(newGame.largeGrid)
      const prevCoord = {'prevSmallGrid': smallGridIndex, 'prevRowIndex': rowIndex, 'prevColIndex': colIndex}
      newGame.currUser = (game.currUser == 1) ? 2 : 1
      newGame.prevCoordinate = prevCoord
      newGame.currSmallGrid = newSmallGrid
      newGame.gameResult = gameResult
      setGame(newGame)

      // Needed if using blockchain as backend
      // if (await saveGame(newSmallGrid, smallGridIndex, rowIndex, colIndex, game.currUser, gridResult, gameResult)){
      //   setGame(newGame)
      // }
    }
  }

  const isFilled = (smallGridIndex, rowIndex, colIndex) => {
    return game.largeGrid[smallGridIndex].grid[rowIndex][colIndex] > 0
  }

  const checkLargeGrid = (largeGridObj) => {
    const checkMatch = (idx1, idx2, idx3) => {
      return (largeGridObj[idx1].gridResult > 0) &&
          (largeGridObj[idx1].gridResult == largeGridObj[idx2].gridResult) &&
          (largeGridObj[idx1].gridResult == largeGridObj[idx3].gridResult)
    }

    // check horizontal match
    for (let i = 0; i < 3; i++){
      var idx1 = coordinatesToIndex(i, 0)
      var idx2 = coordinatesToIndex(i, 1)
      var idx3 = coordinatesToIndex(i, 2)
      if (checkMatch(idx1, idx2, idx3)) {
        return largeGridObj[idx1].gridResult
      }
    }

    // check vertical match
    for (let i = 0; i < 3; i++){
      var idx1 = coordinatesToIndex(0, i)
      var idx2 = coordinatesToIndex(1, i)
      var idx3 = coordinatesToIndex(2, i)
      if (checkMatch(idx1, idx2, idx3)) {
        return largeGridObj[idx1].gridResult
      }
    }

    // check diagonal match 
    var idx1 = coordinatesToIndex(0, 0)
    var idx2 = coordinatesToIndex(1, 1)
    var idx3 = coordinatesToIndex(2, 2)
    if (checkMatch(idx1, idx2, idx3)) {
      return largeGridObj[idx1].gridResult
    }
    
    // check diagonal match 
    var idx1 = coordinatesToIndex(0, 2)
    var idx2 = coordinatesToIndex(1, 1)
    var idx3 = coordinatesToIndex(2, 0)
    if (checkMatch(idx1, idx2, idx3)) {
      return largeGridObj[idx1].gridResult
    } 

    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        const idx = coordinatesToIndex(i, j)
        if (largeGridObj[idx].gridResult == 0){
          return 0
        }
      }
    }

    return 3
  }

  const checkSmallGrid = (smallGridIndex, largeGridObj) => {
    const smallGrid = largeGridObj[smallGridIndex].grid

    // check horizontal match
    for (let i = 0; i < 3; i++) {
      if (smallGrid[i].every((val, ind, arr) => val === arr[0]) && (smallGrid[i][0] != 0)){
        return [true, smallGrid[i][0]]
      }
    }

    // check vertical match
    const smallGridTranspose = smallGrid[0].map((col, i) => smallGrid.map(row => row[i]));
    for (let i = 0; i < 3; i++) {
      if (smallGridTranspose[i].every((val, ind, arr) => val === arr[0]) && (smallGridTranspose[i][0] != 0)){
        return [true, smallGridTranspose[i][0]]
      }
    }

    // check diagonal match
    if ((smallGrid[0][0] == smallGrid[1][1]) &&  (smallGrid[0][0] == smallGrid[2][2]) && (smallGrid[0][0] != 0)) {
      return [true, smallGridTranspose[0][0]]
    }

    // check diagonal match
    if ((smallGrid[0][2] == smallGrid[1][1]) &&  (smallGrid[0][2] == smallGrid[2][0]) && (smallGrid[0][2] != 0)) {
      return [true, smallGridTranspose[0][2]]
    }

    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (smallGrid[i][j] == 0){
          return [false, 0]
        }
      }
    }

    return [false, 3]
  }

  const coordinatesToIndex = (rowIndex, colIndex) => {
    const index = (3 * rowIndex) + colIndex
    return index
  }

  const reset = (event) => {
    // await resetGame()
    // setLargeGridLoaded(false)
    setGame(initializeGame())
    console.log("Just reset state! ")
  }

  // Rendering of Large Grid
  const classes = useStyles();

  var smallGrids = [];
  if (game) {
    const enableAllEiligible = game.largeGrid[game.currSmallGrid].gridResult > 0
    for (var idx = 0; idx < 9; idx++){
      const isEnabled = idx==game.currSmallGrid
      smallGrids.push(
        <SmallGrid prevCoordinate={game.prevCoordinate} gameResult={game.gameResult} isEnabled={(isEnabled || enableAllEiligible)} smallGridIndex={idx} key={idx} smallGrid={game.largeGrid[idx]} handleOnClick={handleOnClick}/>
      );
    }
  }

  const status = () => {
    if (game) {
      if (game.gameResult > 0) {
        return "Player " + String(game.gameResult) + " won !!!"
      } else {
        return "Player " + String(game.currUser) + "'s turn"
      }
    } else {
      return "Game is loading..."
    }
  }

  return (
    <div className={classes.root}>
    {
      game ? 
      <Grid container spacing={1} direction='column'>
        <Paper className={classes.paper}>{status()}</Paper>
        <Grid item xs={12} container spacing={2}>
          {smallGrids}
        </Grid>
        <Button onClick={reset}>Reset</Button>
      </Grid>
      : 'Grid is loading...'
    }
  </div>
  );
}

export default SuperTicTacToe;