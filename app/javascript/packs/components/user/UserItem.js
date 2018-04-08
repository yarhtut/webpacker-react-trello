import React from 'react';
//import { partial } from '../../lib/utils';

export const UserItem = (props) => {
  // const handleToggle = partial(props.handleToggle, props.id, props.card_id)

  return (
    <li>
      <img src={`/assets/${props.name.toLowerCase()}.png`} />
      <span>
      {props.name}
    </span>
    </li>
  )
};

