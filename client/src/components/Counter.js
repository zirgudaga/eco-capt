import React from 'react'
import {useSelector, useDispatch} from 'react-redux'

export default function Counter() {

  const count = useSelector(state => state.count)

  const dispatch = useDispatch();
  
  const decrFunc = () => {
    dispatch({
      type: "DECR"
    })
  }
  const incrFunc = () => {
    dispatch({
      type: "INCR"
    })
  }

  return (
    <div>
      <h1>Les données : {count}</h1>
      <button onClick={decrFunc}> -1 </button>
      <button onClick={incrFunc}> +1 </button>
    </div>
  )
}