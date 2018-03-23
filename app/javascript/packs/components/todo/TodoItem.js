import React from 'react';
import { partial } from '../../lib/utils';

export const TodoItem = (props) => {
  const handleToggle = partial(props.handleToggle, props.id, props.card_id)

  return (
    <li>
      <label>
      <input type='checkbox'
        onChange={handleToggle}
        defaultChecked={props.checked}
      />
      {props.text}
    </label>
    </li>
  )
};

