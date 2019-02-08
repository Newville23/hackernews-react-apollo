import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import gql from 'graphql-tag'
import Link from '../Link'
import { LinkItem } from '../../types'

const SEARCH_QUERY = gql`
  query SearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

export interface Data {
  feed: {
    links: Array<LinkItem>
  }
}

interface SearchState {
  filter: string
  links?: Array<LinkItem>
}

interface SearchProps extends WithApolloClient<{}> {}
class SearchLink extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props)
    this.state = {
      filter: ''
    }
  }

  public executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query<Data>({
      query: SEARCH_QUERY,
      variables: { filter }
    })
    const links = result.data.feed.links
    this.setState({ links })
  }

  public render() {
    return (
      <div className="">
        <div className="">
          Search
          <input
            type="text"
            placeholder="set a filter"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this.executeSearch()}>Search</button>
        </div>
        <div>
          {this.state.links &&
            this.state.links.map((link, index) => <Link key={link.id} link={link} index={index} />)}
        </div>
      </div>
    )
  }
}

export default withApollo(SearchLink)
