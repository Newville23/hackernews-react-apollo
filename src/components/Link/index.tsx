import React from 'react'
import { AUTH_TOKEN } from '../../constant'
import { timeDifferenceForDate } from '../../utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { LinkItem, Vote } from '../../types'

const VOTE_MUTATION = gql`
  mutation voteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
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

interface Props {
  link: LinkItem
  index: number
  onUpdateCacheAfterVote?: (store: any, Vote: any, linkId: string) => void
}

interface VoteMutationType {
  vote: {
    id: string
    link: {
      votes: [Vote]
    }
    user: {
      id: string
    }
  }
}

interface VoteMutationVariables {
  linkId: string
}

class VoteMutation extends Mutation<VoteMutationType, VoteMutationVariables> {}
class Link extends React.Component<Props> {
  constructor(props: Props) {
    super(props)

    this.voteForLink = this.voteForLink.bind(this)
  }

  public voteForLink() {}

  public render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const linkId = this.props.link.id
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {authToken && (
            <VoteMutation
              mutation={VOTE_MUTATION}
              update={(store, { data }) =>
                data &&
                this.props.onUpdateCacheAfterVote &&
                this.props.onUpdateCacheAfterVote(store, data.vote, linkId)
              }
            >
              {voteMutation => {
                return (
                  <div
                    className="ml1 gray f11"
                    onClick={() => voteMutation({ variables: { linkId } })}
                  >
                    {' '}
                    ▲{' '}
                  </div>
                )
              }}
            </VoteMutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {this.props.link.description} ({this.props.link.url})
          </div>
          <div className="f6 lh-copy gray">
            {this.props.link.votes && this.props.link.votes.length} votes | by{' '}
            {this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.link.createdAt)}
          </div>
        </div>
      </div>
    )
  }
}

export default Link
