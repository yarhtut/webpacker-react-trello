import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { borderRadius, colors, grid } from './constants';
import Modal from 'react-modal';
import { Progress } from 'react-sweet-progress';
import { Line, Circle } from 'rc-progress';

import { TodoForm, TodoList } from '../components/todo/';
import { UserList } from '../components/user/';
import { addTodo, generateId , findById, toggleTodo, updateTodo} from '../lib/todoHelpers.js';

const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');

export default class QuoteItem extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      todos: [],
      users: [],
      allUser: [],
      currentTodo: '',
      addedUser: '',
      progressTodo: 0,
      toggleTodoTextBox: false,
      openUserSelect: false
    }

    this.openModal = this.openModal.bind(this);
    this.openTodoTextBox = this.openTodoTextBox.bind(this);
    this.toggleUserSelect = this.toggleUserSelect.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleEmptySubmit = this.handleEmptySubmit.bind(this);

    // User
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleSubmitUser = this.handleSubmitUser.bind(this);
  }

  componentDidMount() {
    if (!this.props.autoFocus) {
      return;
    }
    // eslint-disable-next-line react/no-find-dom-node
    const node: HTMLElement = (ReactDOM.findDOMNode(this) : any);
    node.focus();
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  openTodoTextBox(e) {
    e.preventDefault();
    this.setState({ toggleTodoTextBox: true })
  }

  toggleUserSelect(e) {
    e.preventDefault();

    fetch(`/users.json`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        allUser: res,
        openUserSelect: true
      })
    })
    this.setState({ openUserSelect: true })
  }

  openModal(storyId) {
    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');

    fetch(`/cards/${storyId}.json`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(res => {
      let totalChecked = res.todos.filter((c) => c.checked == true).length;
      this.setState({
        todos: res.todos,
        users: res.users,
        modalIsOpen: true,
        progressTodo: (Math.round(totalChecked / res.todos.length * 100))
      })
    })
  }

  afterOpenModal() {
    // this.subtitle.style.color = '#000000';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleToggle(todoId, storyId) {
    const todo = findById(todoId, this.state.todos)
    const toggled = toggleTodo(todo)
    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');
    const data = { checked: toggled.checked }

    fetch(`/todos/${todoId}` , {
      body: JSON.stringify(data),
      method: 'PATCH',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })
    .then(() => {
      fetch(`/cards/${storyId}.json`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then(res => {
        let totalChecked = res.todos.filter((c) => c.checked == true).length;
        this.setState({ todos: res.todos , users: res.users, errorMessage: '', currentTodo: '', progressTodo: (Math.round(totalChecked / res.todos.length * 100)) })
      })
    })
  }

  handleOnChange(e) {
    this.setState({ currentTodo: e.target.value });
  }

  handleSubmit(storyId, e) {
    e.preventDefault();

    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');
    const data = { card_id: storyId, text: this.state.currentTodo, checked: false }

    fetch(`/todos` , {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })
    .then(() => {
      fetch(`/cards/${storyId}.json`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then(res => {
        let totalChecked = res.todos.filter((c) => c.checked == true).length;
        this.setState({
          todos: res.todos ,
          errorMessage: '',
          currentTodo: '',
          progressTodo: (Math.round(totalChecked / res.todos.length * 100)),
          toggleTodoTextBox: false
        })
      })
    })
  }

  handleEmptySubmit(storyId, e) {
    e.preventDefault();
    this.setState({ errorMessage: 'Please suply a new todo name' });
  }

  handleChangeUser(e) {
    e.preventDefault();
    this.setState({ addedUser: e.target.value });
  }

  handleSubmitUser(cardId, e) {
    e.preventDefault();
    console.log(cardId)

    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');
    const data = { card_id: cardId, user_id: this.state.addedUser }

    fetch(`/cards/${cardId}.json`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })
    .then(() => {
      fetch(`/cards/${cardId}.json`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          openUserSelect: false,
          users: res.users
        })
      })
    })

  }

  render() {
    const { quote, isDragging, provided } = this.props;
    const submitHandler = this.state.currentTodo ? this.handleSubmit.bind(this, quote.id) : this.handleEmptySubmit.bind(this, quote.id);

    const userOption = this.state.allUser.map((u) => <option key={u.id} value={u.id}> {u.name}</option>)

    const progressBar = (isNaN(this.state.progressTodo)) ? 0 : this.state.progressTodo;

    const todoForm = this.state.toggleTodoTextBox ? (
      <TodoForm currentTodo={this.state.currentTodo}
        handleOnChange={this.handleOnChange}
        handleSubmit={submitHandler}
      />
      ) : <a onClick={this.openTodoTextBox}>Add checklist...</a>

      const userForm = this.state.openUserSelect ? (
        <form onSubmit={this.handleSubmitUser.bind(this, quote.id)}>
          <label>
            Add user:
            <select value={this.state.addedUser} onChange={this.handleChangeUser}>
              { userOption }
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
      ) : <a onClick={this.toggleUserSelect}>Add users ...</a>

      return (
        <div>
          <Container
            isDragging={isDragging}
            innerRef={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={this.openModal.bind(this, quote.id)}
          >
            <Content>
              <BlockQuote>{quote.name}</BlockQuote>
              <QuoteId>(id: {quote.id})</QuoteId>
            </Content>
          </Container>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel={quote.name}
          >
            <h2>{quote.name}</h2>
            <button className='close' onClick={this.closeModal}>X</button>
            <p>{quote.description}</p>

            <div className='card-user'>
              <h3>Users</h3>
              <UserList userId={quote.id} users={this.state.users} />
              { userForm }
            </div>
            <div className='progress-bar'>
              <h3>CheckList</h3>
              <span>{progressBar} <small> % </small></span>
              <Line percent={progressBar} strokeWidth="1" strokeColor="DodgerBlue" />
            </div>
            <div className='todo-app'>
              { this.state.errorMessage && <span className='error'> {this.state.errorMessage}</span> }
              <div className='todo-list'>
                <TodoList storyId={quote.id} todos={this.state.todos} handleToggle={this.handleToggle} />
              </div>
              { todoForm }
            </div>
          </Modal>
        </div>
      );
  }
}

const customStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '780px',
    minHeight             : '600px',
    background            : '#e2e4e6'
  }
};

const Container = styled.div`
border-radius: 3px;
border-bottom: 1px solid #cccccc;
background-color: ${({ isDragging }) => (isDragging ? colors.green : colors.white)};
box-shadow: ${({ isDragging }) => (isDragging ? `2px 2px 1px ${colors.shadow}` : 'none')};
padding: ${grid}px;
min-height: 40px;
margin-bottom: ${grid}px;
user-select: none;
transition: background-color 0.1s ease;

color: ${colors.black};

&:hover {
  background-color: ${colors.blue.lighter};
  text-decoration: none;
}
&:focus {
  outline: 2px solid ${colors.purple};
  box-shadow: none;
}

display: flex;
align-items: center;
`;

const Avatar = styled.img`
width: 40px;
height: 40px;
border-radius: 50%;
margin-right: ${grid}px;
flex-shrink: 0;
flex-grow: 0;
`;

const Content = styled.div`
flex-grow: 1;
flex-basis: 100%
display: flex;
flex-direction: column;
`;

const BlockQuote = styled.div`
`;

const Footer = styled.div`
display: flex;
margin-top: ${grid}px;
`;

const QuoteId = styled.span`
width: 40px;
height: 40px;
border-radius: 50%;
margin-right: ${grid}px;
flex-shrink: 0;
flex-grow: 0;
`;

const Attribution = styled.small`
margin: 0;
margin-left: ${grid}px;
text-align: right;
flex-grow: 1;
`;

