import React from 'react';
import { UserItem } from './UserItem';

export const UserList = (props) => {
  return (
    <ul>
      { props.users.map(user => <UserItem key={user.id} {...user} /> ) }
    </ul>
  )
};
