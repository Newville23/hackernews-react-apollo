import React, { Component } from 'react'
import LinkList from '../LinkList'
import styles from './styles.module.css'

class App extends Component {
  render () {
    return (
      <div className={styles.App}>
        <LinkList />
      </div>
    )
  }
}

export default App
