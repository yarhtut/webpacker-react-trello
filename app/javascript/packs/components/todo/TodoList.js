import React from 'react';
import { TodoItem } from './TodoItem';

export const TodoList = (props) => {
  console.log(props)
  return (
    <ul>
      { props.todos.map(todo => <TodoItem key={todo.id} {...todo} handleToggle={props.handleToggle}/> ) }
    </ul>
  )
};
