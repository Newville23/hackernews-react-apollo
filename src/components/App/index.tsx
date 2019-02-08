import React, { Component } from 'react'
import LinkList from '../LinkList'
import CreateLink from '../CreateLink'
import Header from '../Header'
import { Switch, Route } from 'react-router-dom'
import Login from '../Login'
import Search from '../Search'

class App extends Component {
  public render() {
    return (
      <div className="center w85">
        <Header />
        <div>
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/search" component={Search} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
