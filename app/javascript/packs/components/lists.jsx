import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './cards.jsx'

class Lists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: [],
      cards: [],
      value: '',
    }

    this.onDragEnd = this.onDragEnd.bind(this);
    this.addCard = this.addCard.bind(this);
    this.handleCardText = this.handleCardText.bind(this);
    this.moveCard = this.moveCard.bind(this)
  }

  componentDidMount() {
    fetch('/lists.json')
    .then(res => res.json())
    .then(res => this.setState({ lists: res }))
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const cards = reorder(
      this.state.cards,
      result.source.index,
      result.destination.index
    );

    this.setState({
      cards,
    });
  }

  openForm(listId, e) {
    this.setState({formKey: listId, value: ''});
  }

  addCard(listId, e) {
    e.preventDefault();
    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');
    const data = {  list_id: listId, name:  this.state.value }

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
      fetch('/cards.json')
      .then(res => res.json())
      .then(res => this.setState({ cards: res }))
    })
  }

  handleCardText(e) {
    this.setState({value: e.target.value});
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state
    const dragCard = cards[dragIndex]
    debugger
console.log(dragCard)
    this.setState(
      update(this.state, {
        cards: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        },
      }),
    )
  }

  render() {
    const allLists = this.state.lists.map((list) => {
      const allCards = list[1].map((card, index) => {
        console.log(card)
          return (
          <Draggable key={card.id} draggableId={card.id} index={card.position}>
            {(provided, snapshot) => (
              <div>
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  {card.name}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Draggable>
        )
      })

      const form = (this.state.formKey == list[0].id) ?
      (
        <form onSubmit={this.addCard.bind(this, list.id)} >
          <input type="text" value={this.state.value} onChange={this.handleCardText} />
          <input type="submit" value="Add Card" className='btn' />
        </form>
      ) : ( <button onClick={this.openForm.bind(this,list[0].id)} className='btn'>Add Card</button> )

      return (
        <DragDropContext onDragEnd={this.onDragEnd} className='col-3 card list'>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                <h4 >{ list[0].name }</h4>
                { allCards }
                { form }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )
    })

    return <div className='row'>
      { allLists }
      <a href='/lists/new' className='btn col-3 card'>Add List</a>
    </div>
  }
}

export default Lists

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 8 * 2,
  margin: `0 0 8px 0`,
  borderRadius: 3,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'whiteSmoke',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: 8,
  width: 250,
  margin: 2,
  borderRadius: 3,
});
