import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { borderRadius, colors, grid } from './constants';
import Modal from 'react-modal';
import { Progress } from 'react-sweet-progress';
import { Line, Circle } from 'rc-progress';

import { TodoForm, TodoList } from '../components/todo/';
import { addTodo, generateId , findById, toggleTodo, updateTodo} from '../lib/todoHelpers.js';

export default class QuoteItem extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      todos: []
      ,
    currentTodo: ''
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    if (!this.props.autoFocus) {
      return;
    }
    // eslint-disable-next-line react/no-find-dom-node
    const node: HTMLElement = (ReactDOM.findDOMNode(this) : any);
    node.focus();
  }

  openModal(storyId) {
    fetch(`/cards/${storyId}.json`)
    .then(res => res.json())
    .then(res => this.setState({ todos: res , modalIsOpen: true }))
  }

  afterOpenModal() {
    this.subtitle.style.color = '#000';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleToggle = (id) => {
    const todo = findById(id, this.state.todos)
    const toggled = toggleTodo(todo)
    const updatedTodos = updateTodo(this.state.todos, toggled)

    this.setState({ todos: updatedTodos })
  }

  handleOnChange = (e) => {
    this.setState({ currentTodo: e.target.value });
  }

  handleSubmit = (storyId, e) => {
    e.preventDefault();

    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');
    const data = { card_id: storyId, text: this.state.currentTodo, checked: false }

    fetch(`/todos` , {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })
    .then(() => {
      fetch(`/cards/${storyId}.json`)
      .then(res => res.json())
      .then(res => this.setState({ todos: res, errorMessage: '', currentTodo: '' }))
    })
  }

  handleEmptySubmit = (storyId, e) => {
    e.preventDefault();
    this.setState({ errorMessage: 'Please suply a new todo name' });
  }

  render() {
    const { quote, isDragging, provided } = this.props;
    const submitHandler = this.state.currentTodo ? this.handleSubmit.bind(this, quote.id) : this.handleEmptySubmit.bind(this, quote.id);
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
          <h2 ref={subtitle => this.subtitle = subtitle}>{quote.name}</h2>
          <button onClick={this.closeModal}>close</button>

          <p>{quote.description}</p>

          <div className='progress-bar'>
            <Line percent="88" strokeWidth="2" strokeColor="#ff0000" />
          </div>

          <div className='todo-app'>
            { this.state.errorMessage && <span className='error'> {this.state.errorMessage}</span> }
            <TodoForm currentTodo={this.state.currentTodo}
              handleOnChange={this.handleOnChange}
              handleSubmit={submitHandler}
            />
            <div className='todo-list'>
              <TodoList todos={this.state.todos} handleToggle={this.handleToggle} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '780px',
    minHeight            : '500px'

  }
};

const Container = styled.div`
border-radius: ${borderRadius}px;
border: 1px solid grey;
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

//        href={quote.name}
//<Avatar src={quote.name} alt={quote.name} />
//<Footer>
//  <Attribution>{quote.name}</Attribution>
//</Footer>
