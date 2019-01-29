import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Link from "../Link";

const FEED_QUERY = gql`
  query linkFeed {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

interface LinkElement {
  id: string;
  description: string;
  url: string;
}

interface Data {
  feed: {
    links: Array<LinkElement>;
  };
}

class LinkFeedQuery extends Query<Data> {}
class LinkList extends React.Component {
  public render() {
    return (
      <LinkFeedQuery query={FEED_QUERY}>
        {({ loading, data, error }) => {
          if (loading) return <div>is loading </div>;
          if (error) return <div> error </div>;

          const linksToRender = data && data.feed && data.feed.links;
          return (
            <div>
              {linksToRender &&
                linksToRender.map(link => <Link key={link.id} link={link} />)}
            </div>
          );
        }}
      </LinkFeedQuery>
    );
  }
}

export default LinkList;
