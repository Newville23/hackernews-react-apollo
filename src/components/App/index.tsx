import React, { Component } from 'react'
import LinkList from '../LinkList'
import styles from './styles.module.css'
import CreateLink from '../CreateLink'

class App extends Component {
  public render() {
    return (
      <div className={styles.App}>
        <LinkList />
        <CreateLink />
      </div>
    )
  }
}

export default App
