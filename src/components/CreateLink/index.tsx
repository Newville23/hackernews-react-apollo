import React, { ComponentState } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router'
import { FEED_QUERY, Data } from '../LinkList'

interface State {
  description: string
  url: string
}

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

interface MutationType {
  post: {
    id: string
    createdAt: Date
    url: string
    description: string
  }
}

interface MutationVariable {
  description: string
  url: string
}

interface CreateLinkProps extends RouteComponentProps {}

class CreateLinkMutation extends Mutation<MutationType, MutationVariable> {}
class CreateLink extends React.Component<CreateLinkProps, State> {
  constructor(props: CreateLinkProps) {
    super(props)

    this.state = {
      description: '',
      url: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
  }

  public handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.currentTarget
    const name = target.name === 'description' ? 'description' : 'url'

    this.setState({
      [name]: target.value
    } as ComponentState)
  }

  public render() {
    const { description, url } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            type="text"
            className="mb2"
            name="description"
            value={description}
            onChange={e => this.handleOnChange(e)}
            placeholder="Set a description"
          />

          <input
            type="text"
            className="mb2"
            value={url}
            name="url"
            onChange={e => this.handleOnChange(e)}
            placeholder="Set a url"
          />
        </div>
        <CreateLinkMutation
          mutation={POST_MUTATION}
          onCompleted={() => this.props.history.push('/')}
          update={(store, { data }) => {
            const dataQuery: Data | null = store.readQuery({ query: FEED_QUERY })
            data && dataQuery && dataQuery.feed && dataQuery.feed.links.unshift(data.post)
            store.writeQuery({
              query: FEED_QUERY,
              data: dataQuery
            })
          }}
        >
          {postMutation => {
            return (
              <button onClick={() => postMutation({ variables: { description, url } })}>
                submit
              </button>
            )
          }}
        </CreateLinkMutation>
      </div>
    )
  }
}

export default withRouter(CreateLink)
