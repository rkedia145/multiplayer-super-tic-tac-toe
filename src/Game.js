import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Start from './components/pages/Start';
import SuperBoard from './components/pages/SuperBoard'


const Game = () => (
    <Router>
        <Route path='/multiplayer-super-tic-tac-toe' exact component={Start} />
        <Route path='/game' component={SuperBoard} />
    </Router>
)
 
export default Game