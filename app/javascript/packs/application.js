import React from 'react'
import ReactDOM from 'react-dom'
import Board from './board/board'

import store from './store'

const state = store.getState()

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Board {...state} />,
    document.body.appendChild(document.getElementById('board'))
  )
})
