import React from 'react';
import { partial } from '../../lib/utils';

export const TodoItem = (props) => {
  const handleToggle = partial(props.handleToggle, props.id)

  return (
    <li>
      <input type='checkbox'
        onChange={handleToggle}
        defaultChecked={props.checked}
      />
      {props.text}
    </li>
  )
};

