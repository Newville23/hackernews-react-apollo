import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Link from '../Link'

export const FEED_QUERY = gql`
  query linkFeed {
    feed {
      links {
        id
        createdAt
        url
        description
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

interface LinkElement {
  id: string
  description: string
  url: string
  votes?: [Vote]
  postedBy?: User
  createdAt: Date
}

interface Vote {
  id: string
  user: User
}

interface User {
  id: string
  name: string
}

export interface Data {
  feed: {
    links: Array<LinkElement>
  }
}

class LinkFeedQuery extends Query<Data> {}
class LinkList extends React.Component<{}> {
  constructor(props: {}) {
    super(props)

    this.updateCacheAfterVote = this.updateCacheAfterVote.bind(this)
  }
  public updateCacheAfterVote(store: any, createVote: any, linkId: string) {
    const data = store.readQuery({ query: FEED_QUERY })

    //@ts-ignore
    const votedLink = data.feed.links.find(linkItem => linkItem.id === linkId)
    votedLink.votes = createVote.link.votes

    store.writeQuery({ query: FEED_QUERY, data })
  }

  public render() {
    return (
      <LinkFeedQuery query={FEED_QUERY}>
        {({ loading, data, error }) => {
          if (loading) return <div>is loading </div>
          if (error) return <div> error </div>

          const linksToRender = data && data.feed && data.feed.links
          return (
            <div>
              {linksToRender &&
                linksToRender.map((link, idx) => (
                  <Link
                    key={link.id}
                    link={link}
                    index={idx}
                    onUpdateCacheAfterVote={this.updateCacheAfterVote}
                  />
                ))}
            </div>
          )
        }}
      </LinkFeedQuery>
    )
  }
}

export default LinkList
