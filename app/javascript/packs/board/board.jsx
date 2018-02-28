// @flow
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
      autoFocusQuoteId: null,
    }
  }

 boardRef: ?HTMLElement

 componentDidMount() {
    fetch('/lists.json')
    .then(res => res.json())
    .then(res => this.setState({ lists: res }))
    injectGlobal` body { background: rgb(0, 121, 191); } `;
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
    console.log(source)
    console.log(destination)
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

  render() {
    const columns = this.state.columns;
    const ordered = this.state.ordered;
    const lists = this.state.lists;
    const order = (Object.keys(lists));
    const { containerHeight } = this.props;
  
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

