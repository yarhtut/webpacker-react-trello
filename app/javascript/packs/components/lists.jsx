import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled, { injectGlobal } from 'styled-components';
import reorder, { reorderQuoteMap } from '../board/reorder';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './cards'

class Lists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: [],
      cards: []
    }

    // this.onDragEnd = this.onDragEnd.bind(this);
    // this.addCard = this.addCard.bind(this);
    // this.handleCardText = this.handleCardText.bind(this);
  }

  componentDidMount() {
    fetch('/lists.json')
    .then(res => res.json())
    .then(res => this.setState({ lists: res }))
  }

  onDragStart = (initial) => {
    this.setState({
      autoFocusQuoteId: null,
    });
  }

  onDragEnd = (result: DropResult) => {
    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    // reordering column
    if (result.type === 'COLUMN') {
      const ordered: string[] = reorder(
        this.state.ordered,
        source.index,
        destination.index
      );

      this.setState({
        ordered,
      });

      return;
    }

    const data = reorderQuoteMap({
      quoteMap: this.state.columns,
      source,
      destination,
    });

    this.setState({
      columns: data.quoteMap,
      autoFocusQuoteId: data.autoFocusQuoteId,
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


  render() {
    const columns: QuoteMap = this.state.columns;
    const lists = this.state.lists;
    const ordered: string[] = this.state.ordered;
    const { containerHeight } = this.props;
  
    console.log('columns[key]')
    console.log(lists)
    debugger
    console.log(ordered.map((key, index) => columns[key] ))
    console.log('columns[key]')
    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
      >
        {(provided: DroppableProvided) => (
          <Container innerRef={provided.innerRef} {...provided.droppableProps}>
            {ordered.map((key, index) => (
              <Column
                key={key}
                index={index}
                title={key}
                quotes={columns[key]}
                lists={lists}
                autoFocusQuoteId={this.state.autoFocusQuoteId}
              />
            ))}
          </Container>
        )}
      </Droppable>
    );
    return(
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        {this.props.containerHeight ? (
          <ParentContainer height={containerHeight}>{board}</ParentContainer>
        ) : (
        board
      )}
    </DragDropContext>
    );
  }
}

export default Lists


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
