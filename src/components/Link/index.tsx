import React from 'react'

interface Props {
  link: LinkItem
}

interface LinkItem {
  id: string
  description: string
  url: string
}

class Link extends React.Component<Props> {
  public render() {
    return (
      <div>
        {this.props.link.description} ({this.props.link.url})
      </div>
    )
  }
}

export default Link
