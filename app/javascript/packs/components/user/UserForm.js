import React from 'react';

export const UserForm = (props) =>
(
  <form onSubmit={props.handleSubmitUser}>
    <label>
      Add user:
      <select value={props.addedUser} onChange={props.handleChangeUser}>
        { userOption }
      </select>
    </label>
    <input type="submit" value="Submit" />
  </form>
);

