const initState = {
 lists: {} 
}

export default (state = initState, action) => {
  switch (action.type) {
    case 'NEW_LIST':
    return {...state, lists: state.lists}

    default: 
      return state
  }
}
