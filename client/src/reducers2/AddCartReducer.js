const INITIAL_STATE = {
  cart: 0
}

function AddCartReducer(state = INITIAL_STATE, action){

  switch(action.type){
    case 'ADDCART': {
      return {
        ...state,
        //count: state.count + 1
      }
    }
  }

  return state;
}

export default AddCartReducer;