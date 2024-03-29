import React, { Component } from 'react'
import LinkList from '../LinkList'
import CreateLink from '../CreateLink'
import Header from '../Header'
import { Switch, Route, Redirect } from 'react-router-dom'
import Login from '../Login'
import Search from '../Search'

//TODO: move this to ...
class App extends Component {
  public render() {
    return (
      <div className="center w85">
        <Header />
        <div>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/new/1" />} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/top" component={LinkList} />
            <Route
              exact
              path="/new/:page"
              render={({ match }) => <LinkList param={match.params.page} />}
            />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
