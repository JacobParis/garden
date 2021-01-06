import './index.css'

import * as React from 'react'
import ReactDOM from 'react-dom'

import HomeScene from './scenes/home'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" exact>
          <HomeScene />
        </Route>
        <Route path="/notes/:slug">
          <HomeScene />
        </Route>
      </Router>
    </QueryClientProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
