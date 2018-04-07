import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Column from './column';
import reorder, { reorderQuoteMap } from './reorder';
import QuoteList from './quote-list';

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: this.props.lists,
      order: Object.keys(this.props.lists),
      autoFocusQuoteId: null,
      cardText: '',
      listValue: '',
      toggleForm: '',
      toogleListForm: false
    }

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.newList = this.newList.bind(this);
    this.addCard = this.addCard.bind(this);
    this.handleCardText = this.handleCardText.bind(this);
    this.handleListText = this.handleListText.bind(this);
    this.handleToggleForm = this.handleToggleForm.bind(this);
    this.handleToggleListForm = this.handleToggleListForm.bind(this);

    const binder = this
    App.cable.subscriptions.create("ListsChannel", {
      received: function(data) {
        binder.setState({ lists:  JSON.parse(data.message), order: Object.keys(JSON.parse(data.message)) })
      }
    });
  }

  //boardRef: ?HTMLElement

  componentWillMount() {
    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');
    fetch('/lists.json', {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ lists: res , order: Object.keys(res) })
    })

    injectGlobal` body { background: rgb(0, 121, 191); } `;
  }

  handleCardText(listId, e) {
    e.preventDefault();
    this.setState({cardText: e.target.value});
  }

  handleToggleListForm() {
    this.setState({toggleListForm: true});
  }

  handleListText(e) {
    e.preventDefault();
    this.setState({listValue: e.target.value});
  }

  handleToggleForm(title, e) {
    e.preventDefault();
    const toggle = this.state.toggleForm ? '' : title
    this.setState({ toggleForm: toggle, cardText: '' });
  }

  newList(e) {
    e.preventDefault();
    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');

    const data = { name: this.state.listValue }
    fetch(`/lists` , {
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
      fetch('/lists.json', {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then(res => this.setState({ lists: res , order: Object.keys(res), toggleListForm: false, listValue: '' }))
    })
  }

  addCard(listTitle, cardText, e) {
    e.preventDefault();
    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');


    const data = { list_name: listTitle, name: cardText }
    fetch(`/cards` , {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })
    .then(() => {
      fetch('/lists.json', {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'same-origin'
      }) 
      .then(res => res.json())
      .then(res => this.setState({ lists: res , order: Object.keys(res), toggleForm: null, cardText: '' }))
    })
  }

  onDragStart(initial) {
    this.setState({
      autoFocusQuoteId: null,
    });
  }

  onDragEnd(result) {
    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // reordering column
    if (result.type === 'COLUMN') {
      const order = reorder(
        this.state.order,
        source.index,
        destination.index
      );

      this.setState({
        order,
      });

      return;
    }

    const data = reorderQuoteMap({
      quoteMap: this.state.lists,
      source,
      destination
    });

    this.setState({
      lists: data.quoteMap,
      order: Object.keys(data.quoteMap),
      autoFocusQuoteId: data.autoFocusQuoteId,
    });
  }

  render() {
    const lists = this.state.lists;
    const order = this.state.order;
    const { containerHeight } = this.props;

    const listForm = this.state.toggleListForm ? (
      <form onSubmit={this.newList}>
        <input type="text" value={this.state.listValue} onChange={this.handleListText} />
        <input type="submit" value="Add Card" className='btn' />
      </form>
    ) : <NewList><button className='bg-btn' onClick={this.handleToggleListForm}>New list</button></NewList>

    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
      >
        {(provided: DroppableProvided) => (
          <Container innerRef={provided.innerRef} {...provided.droppableProps}>
            {order.map((key, index) => (
              <Column
                key={key}
                index={index}
                title={lists[key][0]}
                droppableTitle={`column-${key}`}
                quotes={lists[key][1]}
                lists={lists[1]}
                autoFocusQuoteId={this.state.autoFocusQuoteId}
                addCard={this.addCard}
                cardText={this.state.cardText}
                handleCardText={this.handleCardText}
                toggleForm={this.state.toggleForm}
                handleToggleForm={this.handleToggleForm}
              />
            ))}
            { listForm }
          </Container>
        )}
      </Droppable>
    );

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        { this.props.containerHeight ? (
          <ParentContainer height={containerHeight}>{board}</ParentContainer>
        ) : (
        board
      )}
    </DragDropContext>
  );
  }
}

const ParentContainer = styled.div`
height: ${({ height }) => height};
overflow-x: hidden;
overflow-y: auto;
`;

const Container = styled.div`
min-height: 100vh;
min-width: 100vw;
display: inline-flex;
`;

const NewList = styled.div`
margin: 8px;
width: 10rem;
height: 3rem;
display: flex;
flex-direction: column;
background: red;
`;

