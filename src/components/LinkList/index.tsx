import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Link from '../Link'

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
`
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
        {({ loading, data, error, subscribeToMore }) => {
          if (loading) {
            return <div>is loading </div>
          }
          if (error) {
            return <div> error </div>
          } else if (data && data.feed) {
            subscribeToMore({
              document: NEW_LINKS_SUBSCRIPTION,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                //@ts-ignore
                const newLink = subscriptionData.data.newLink
                const exists = prev.feed.links.find(({ id }) => id === newLink.id)
                console.log('mm')
                if (exists) return prev

                return Object.assign({}, prev, {
                  feed: {
                    links: [newLink, ...prev.feed.links],
                    count: prev.feed.links.length + 1,
                    //@ts-ignore
                    __typename: prev.feed.__typename
                  }
                })
              }
            })

            const linksToRender = data.feed.links
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
          }
        }}
      </LinkFeedQuery>
    )
  }
}

export default LinkList
