import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Square from '../functional/Square';
import Wait from '../functional/Wait'
import Status from '../functional/Status'
import ScoreBoard from '../functional/ScoreBoard'
import PlayAgain from '../functional/PlayAgain'
import Board from './Board'

import io from 'socket.io-client'
import qs from 'qs'
// const ENDPOINT = 'https://react-ttt-app.herokuapp.com/'
// const ENDPOINT = 'http://localhost:4000'
const ENDPOINT = 'https://sleepy-taiga-16574.herokuapp.com/'

class SuperBoard extends Component {
  constructor(props){
    super(props)
    this.state = {
      game: null,
      piece: 'X',
      turn: true,
      end: false,
      room: '',
      statusMessage: '',
      currentPlayerScore: 0,
      opponentPlayer: [],
      //State to check when a new user join
      waiting: false,
      joinError: false
    }
    this.socketID = null
  }

  componentDidMount() {
    //Getting the room and the username information from the url
    //Then emit to back end to process
    this.socket = io(ENDPOINT)
    const {room, name} = qs.parse(window.location.search, {
      ignoreQueryPrefix: true
     })
    this.setState({room})
    this.socket.emit('newRoomJoin', {room, name})

    //New user join, logic decide on backend whether to display 
    //the actual game or the wait screen or redirect back to the main page
    this.socket.on('waiting', ()=> this.setState({waiting:true, currentPlayerScore:0, opponentPlayer:[]}))
    this.socket.on('starting', ({gameState, players, turn})=> {
      this.setState({waiting:false})
      this.gameStart(gameState, players, turn)
    })
    this.socket.on('joinError', () => this.setState({joinError: true}))

    //Listening to the assignment of piece store the piece along with the in state
    //socket id in local socketID variable
    this.socket.on('pieceAssignment', ({piece, id}) => {
      this.setState({piece: piece})
      this.socketID = id 
    })

    //Game play logic events
    this.socket.on('update', ({gameState}) => this.handleUpdate(gameState))
    this.socket.on('winner', ({gameState,id}) => this.handleWin(id, gameState))
    this.socket.on('draw', ({gameState}) => this.handleDraw(gameState))

    this.socket.on('restart', ({gameState}) => this.handleRestart(gameState))
  }

  //Setting the states to start a game when new user join
  gameStart(gameState, players, turn){
    const opponent = players.filter(([id, name]) => id!==this.socketID)[0][1]
    this.setState({opponentPlayer: [opponent, 0], end:false})
    this.setBoard(gameState)
    this.setTurn(turn)
    this.setMessage()
  }

  //When some one make a move, emit the event to the back end for handling
  handleClick = (boardIndex, index) => {
    const {game, piece, end, turn, room} = this.state
    if (!game[index] && !end && turn){
      this.socket.emit('move', {room, piece, boardIndex, index})
    }
  }

  //Setting the states each move when the game haven't ended (no wins or draw)
  handleUpdate(gameState){
    this.setBoard(gameState)
    this.setTurn(gameState.turn)
    this.setMessage()
  }

  //Setting the states when some one wins
  handleWin(id, gameState) {
    this.setBoard(gameState)
    if (this.socketID === id){
      const playerScore = this.state.currentPlayerScore + 1
      this.setState({currentPlayerScore:playerScore, statusMessage:'You Win'})
    }else{
      const opponentScore = this.state.opponentPlayer[1] + 1
      const opponent = this.state.opponentPlayer
      opponent[1] = opponentScore
      this.setState({opponentPlayer:opponent, statusMessage:`${this.state.opponentPlayer[0]} Wins`})
    }
    this.setState({end:true})
  }

  //Setting the states when there is a draw at the end
  handleDraw(gameState){
    this.setBoard(gameState)
    this.setState({end:true, statusMessage:'Draw'})
  }

  playAgainRequest = () => {
    this.socket.emit('playAgainRequest', this.state.room)
  }

  //Handle the restart event from the back end
  handleRestart(gameState){
    const turn = gameState.turn
    this.setBoard(gameState)
    this.setTurn(turn)
    this.setMessage()
    this.setState({end: false})
  }

  //Some utilities methods to set the states of the board

  setMessage(){
    const message = this.state.turn?'Your Turn':`${this.state.opponentPlayer[0]}'s Turn`
    this.setState({statusMessage:message})
  }

  setTurn(turn){
    if (this.state.piece === turn){
      this.setState({turn:true})
    }else{
      this.setState({turn:false})
    }
  } 

  setBoard(gameState){
    this.setState({game:gameState})
  }
  
  // renderSquare(i){
  //   return(
  //     <Square key={i} value={this.state.game[i]} 
  //                             player={this.state.piece} 
  //                             end={this.state.end} 
  //                             id={i} 
  //                             onClick={this.handleClick}
  //                             turn={this.state.turn}/> 
  //   )
  // }

  renderBoard(i){
    const isEnabled = this.state.game.enabledBoards.includes(i)
    return(
      <Board key={i} 
                 prevCoordinate={this.state.game.prevCoordinate} 
                 gameResult={this.state.game.gameResult}
                 isEnabled={isEnabled}
                 boardIndex={i}
                 board={this.state.game.game[i]}
                 handleOnClick={this.handleClick} />
    )
  }

  render(){
    // const useStyles = makeStyles((theme) => ({
    //   root: {
    //     // flexGrow: 1,
    //   },
    //   paper: {
    //     padding: theme.spacing(2),
    //     textAlign: 'center',
    //     border: `1px solid black`,
    //     fontSize: '3rem',
    //     height: '3rem',
    //     // color: theme.palette.text.secondary,
    //   },
    // }));
    // const classes = useStyles();

    if (this.state.joinError){
      return(
        <Redirect to={`/`} />
      )
    }else{
      const boardArray = []
      if (this.state.game){
        for (let i=0; i<9; i++){
          const newBoard = this.renderBoard(i)
          boardArray.push(newBoard)
        }
      }
      return(
        // <>
        //   <Wait display={this.state.waiting} room={this.state.room}/>
        //   <Status message={this.state.statusMessage}/>
        //   {/* <div className="board">
        //     {squareArray}
        //   </div> */}
        //   {/* <div style={{ height: 350, width: 550 }}> */}
        //   {/* </div> */}
        //   <Grid style={{ width: 500 }} container spacing={1} direction='column'>
        //     <Grid item xs={12} container spacing={2}>
        //       {boardArray}
        //     </Grid>
        //   </Grid>
        //   <PlayAgain end={this.state.end} onClick={this.playAgainRequest}/>
        // </>
        <div>
        <Wait display={this.state.waiting} room={this.state.room}/>
        <Grid container spacing={1} direction='column'>
          <Paper className="paper">{this.state.statusMessage}</Paper>
          <Grid item xs={12} container spacing={2}>
            {boardArray}
          </Grid>
          {/* <Button onClick={reset}>Reset</Button> */}
        </Grid>
        <PlayAgain end={this.state.end} onClick={this.playAgainRequest}/>
        </div>
      )
    }
  }
}


export default SuperBoard



