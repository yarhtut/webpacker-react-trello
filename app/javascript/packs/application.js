import React from 'react'
import ReactDOM from 'react-dom'
import Board from './board/board'
import store from './store'

const newListValueChangeHandler = (val) => store.dispatch({ type: 'UPDATE_NEW_LIST_VALUE', payload: val })

const render = () => {
  const state = store.getState()

  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
      <Board 
        lists={state.lists}
      />,
      document.body.appendChild(document.getElementById('board'))
    )
  })
}
render()

store.subscribe(render)

