import React from 'react'
import { Mutation } from 'react-apollo'
import { AUTH_TOKEN } from '../../constant'
import gql from 'graphql-tag'
import { withRouter, RouteComponentProps } from 'react-router'

const SIGN_UP_MUTATION = gql`
  mutation SignUpMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

interface SignUpMutationType {
  signup: {
    token: string
  }
}

interface SignUpMutationVariable {
  email: string
  password: string
  name: string
}

interface LoginMutationType {
  login: {
    token: string
  }
}

interface LoginMutationVariable {
  email: string
  password: string
}

interface LoginState {
  login: boolean
  email: string
  password: string
  name: string
}

class LoginMutation extends Mutation<LoginMutationType, LoginMutationVariable> {}
class SignUpMutation extends Mutation<SignUpMutationType, SignUpMutationVariable> {}

interface Loginprops extends RouteComponentProps {}

class Login extends React.Component<Loginprops, LoginState> {
  constructor(props: Loginprops) {
    super(props)

    this.state = {
      login: true,
      email: '',
      password: '',
      name: ''
    }
    this.onChange = this.onChange.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  public onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target

    this.setState({
      [target.name]: target.value
    } as React.ComponentState)
  }

  public handleConfirm(data: any) {
    const { token } = this.state.login ? data.login : data.signup

    this.saveUserData(token)
    this.props.history.push('/')
  }

  private saveUserData(token: string) {
    localStorage.setItem(AUTH_TOKEN, token)
  }

  public render() {
    const { login, email, password, name } = this.state
    return (
      <div className="loginContainer">
        <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
        <div className="flex flex-column">
          {!login && (
            <input
              name="name"
              type="text"
              placeholder="Your name please"
              value={name}
              onChange={e => this.onChange(e)}
            />
          )}
          <input
            type="text"
            name="email"
            value={email}
            onChange={e => this.onChange(e)}
            placeholder="Your email adress"
          />
          <input
            type="password"
            name="password"
            onChange={e => this.onChange(e)}
            placeholder="Choose a safe password"
          />
        </div>

        <div className="flex mt3">
          {login ? (
            <LoginMutation mutation={LOGIN_MUTATION} onCompleted={data => this.handleConfirm(data)}>
              {LoginMutation => (
                <div
                  className="pointer mr2 button"
                  onClick={() => LoginMutation({ variables: { email, password } })}
                >
                  login
                </div>
              )}
            </LoginMutation>
          ) : (
            <SignUpMutation
              mutation={SIGN_UP_MUTATION}
              onCompleted={data => this.handleConfirm(data)}
            >
              {SignUpMutation => (
                <div
                  className="pointer mr2 button"
                  onClick={() => SignUpMutation({ variables: { email, name, password } })}
                >
                  create account
                </div>
              )}
            </SignUpMutation>
          )}

          <div className="pointer button" onClick={() => this.setState({ login: !login })}>
            {login ? 'need to creat an account ?' : 'already have an account?'}
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Login)
