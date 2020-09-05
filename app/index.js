import './index.css'

import * as React from 'react'
import ReactDOM from 'react-dom'

import HomeScene from './scenes/home'
import { BrowserRouter as Router, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Route path="/" exact>
        <HomeScene />
      </Route>
      <Route path="/notes/:slug">
        <HomeScene />
      </Route>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
