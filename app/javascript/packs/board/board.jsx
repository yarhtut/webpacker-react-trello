import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import Column from './column';
import reorder, { reorderQuoteMap } from './reorder';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: this.props.initial,
      ordered: Object.keys(this.props.initial),
      lists: this.props.lists,
      order: Object.keys(this.props.lists),
      value: '',
      autoFocusQuoteId: null,
    }

    this.addCard = this.addCard.bind(this);
    this.handleCardText = this.handleCardText.bind(this);
  }

  boardRef: ?HTMLElement

  componentWillMount() {
    fetch('/lists.json')
    .then(res => res.json())
    .then(res => this.setState({ lists: res , order: Object.keys(res) }))

    injectGlobal` body { background: rgb(0, 121, 191); } `;
  }

  onDragStart = (initial) => {
    this.setState({
      autoFocusQuoteId: null,
    });
  }

  onDragEnd = (result) => {
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
      destination,
    });

    this.setState({
      lists: data.quoteMap,
      autoFocusQuoteId: data.autoFocusQuoteId,
    });
  }

  openForm(listId, e) {
    this.setState({formKey: listId, value: ''});
  }

  handleCardText(e) {
    this.setState({value: e.target.value});
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

  render() {
    const columns = this.state.columns;
    const ordered = this.state.ordered;
    const lists = this.state.lists;
    const order = this.state.order;
    const { containerHeight } = this.props;

    const form = 
    (
      <form onSubmit={this.addCard.bind(this, 1)} >
        <input type="text" value={this.state.value} onChange={this.handleCardText} />
        <input type="submit" value="Add Card" className='btn' />
      </form>
    )
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
                title={key}
                quotes={lists[key]}
                lists={lists}
                autoFocusQuoteId={this.state.autoFocusQuoteId}
              />
            ))}
          </Container>
        )}
      </Droppable>
    );

    return (
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

