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
      autoFocusQuoteId: null,
    }
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

  render() {
    const columns = this.state.columns;
    const ordered = this.state.ordered;
    const lists = this.state.lists;
    const order = this.state.order;
    const { containerHeight } = this.props;
    //console.log(this.state.order.map((key, index) => index))

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

