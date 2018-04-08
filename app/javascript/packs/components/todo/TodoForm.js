import React from 'react';

export const UserForm = (props) => 
(
  <form onSubmit={props.handleSubmitUser}>
    <input type='text' 
      value={props.currentTodo} 
      onChange={props.handleOnChange}
    />
  </form>
);

