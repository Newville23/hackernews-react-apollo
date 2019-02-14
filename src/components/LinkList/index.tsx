import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Link from '../Link'
import { withRouter, RouteComponentProps } from 'react-router'
import { LINKS_PER_PAGE } from '../../constant'

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

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }
`
export const FEED_QUERY = gql`
  query linkFeed($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
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
      count
    }
  }
`

interface LinkElement {
  id: string
  description: string
  url: string
  votes: [Vote]
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
    count: number
  }
}

interface Props extends RouteComponentProps {
  param: string
}

class LinkFeedQuery extends Query<Data> {}
class LinkList extends React.Component<Props> {
  constructor(props: Props) {
    super(props)

    this.updateCacheAfterVote = this.updateCacheAfterVote.bind(this)
    this.getQueryVariables = this.getQueryVariables.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.getLinksToRender = this.getLinksToRender.bind(this)
  }

  public getLinksToRender(data: Data) {
    const isNewPage = this.props.location.pathname.includes('new')
    if (isNewPage) {
      return data.feed.links
    }
    const rankedLinks = data.feed.links.slice()
    //@ts-ignore
    rankedLinks.sort((l1, l2) => {
      if (l1.votes && l2.votes) {
        return l2.votes.length - l1.votes.length
      }
    })
  }

  public previousPage() {}

  public nextPage(data: Data) {}

  public updateCacheAfterVote(store: any, createVote: any, linkId: string) {
    const data = store.readQuery({ query: FEED_QUERY })

    //@ts-ignore
    const votedLink = data.feed.links.find(linkItem => linkItem.id === linkId)
    votedLink.votes = createVote.link.votes

    store.writeQuery({ query: FEED_QUERY, data })
  }

  public getQueryVariables() {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.param, 10)
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return { first, skip, orderBy }
  }

  public render() {
    return (
      <LinkFeedQuery query={FEED_QUERY} variables={this.getQueryVariables()}>
        {({ loading, data, error, subscribeToMore }) => {
          if (loading) {
            return <div>is loading </div>
          }
          if (error) {
            return <div> error </div>
          } else if (data && data.feed) {
            // Add a subscibe When a user create new links
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

            //Add a subscribe when a user add votes to alink
            subscribeToMore({
              document: NEW_VOTES_SUBSCRIPTION
            })

            const linksToRender = this.getLinksToRender(data)
            const isNewPage = this.props.location.pathname.includes('new')
            const pageIndex = this.props.param
              ? (parseInt(this.props.param) - 1) * LINKS_PER_PAGE
              : 0
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
                {isNewPage && (
                  <div className="flex ml4 mv4 mv3 gray">
                    <div className="pointer mr2" onClick={this.previousPage}>
                      previous
                    </div>
                    <div className="pointer" onClick={() => this.nextPage(data)}>
                      Next
                    </div>
                  </div>
                )}
              </div>
            )
          }
        }}
      </LinkFeedQuery>
    )
  }
}

export default withRouter(LinkList)
