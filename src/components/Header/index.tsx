import React from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { AUTH_TOKEN } from '../../constant'

interface HeaderProps extends RouteComponentProps {}
class Header extends React.Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props)

    this.handleLogout = this.handleLogout.bind(this)
  }

  public handleLogout() {
    localStorage.removeItem(AUTH_TOKEN)
    this.props.history.push('/')
  }

  public render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="flex pa1 justify-betwen nowrap orange">
        <div className="flex flex-fixed black">
          <div className="fw7 mr1">Hacker news</div>
          <Link to="/" className="ml1 no-underline black">
            new
          </Link>
          <div className="ml1">|</div>
          <Link to="/search" className="ml1 no-underline black">
            search
          </Link>
          {authToken && (
            <>
              <div className="ml1">|</div>
              <Link to="/create" className="ml1 no-underline black">
                Submit
              </Link>
            </>
          )}
        </div>
        <div>
          {authToken ? (
            <div className="ml1 pointer black" onClick={this.handleLogout}>
              logout
            </div>
          ) : (
            <Link className="ml1 no-underline black" to="/login">
              login
            </Link>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
