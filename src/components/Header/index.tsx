import React from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'

interface HeaderProps extends RouteComponentProps {}
class Header extends React.Component<HeaderProps> {
  public render() {
    return (
      <div className="flex pa1 justify-betwen nowrap orange">
        <div className="flex flex-fixed black">
          <div className="fw7 mr1">Hacker news</div>
          <Link to="/" className="ml1 no-underline black">
            new
          </Link>
          <div className="ml1">|</div>
          <Link to="/create" className="ml1 no-underline black">
            Submit
          </Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
