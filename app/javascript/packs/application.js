/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

console.log('hello react')

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'


class Lists extends React.Component {
  constructor() {
    super()
    this.state = { 
      lists: [],
      cards: []
    }
  }

  componentDidMount() {
    fetch('/lists.json')
      .then(res => res.json())
      .then(res => this.setState({ lists: res }))
    fetch('/cards.json')
      .then(res => res.json())
      .then(res => this.setState({ cards: res }))
  }

  render() {

    const allLists = this.state.lists.map((list) => {
        this.state.cards.map((card) => {
     console.log(card.list_id == list.id)     
          if (card.list_id == list.id) {
            debugger
            console.log(card.name)
            console.log('card.name')
          }
        })
      return (
        <div className='col-3 card'>
          <h4 key={ list.id }> {list.name}</h4>
        </div>
      )
    })
    return <div className='row'>
        { allLists }
        <a href='/lists/new' className='btn col-3 card'> Add List</a> 
      </div>
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Lists name="Yar" />,
    document.body.appendChild(document.getElementById('board')),
  )
})

