const initState = {
  lists: {},
  listValue: ''
}

export default (state = initState, action) => {
  switch (action.type) {
    case 'NEW_LIST':
    return {...state, lists: state.lists}

    case 'UPDATE_NEW_LIST_VALUE':
    return {...state, listValue: action.payload}

    default: 
      return state
  }
}
