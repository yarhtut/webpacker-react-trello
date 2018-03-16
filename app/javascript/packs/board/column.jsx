import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import QuoteList from './quote-list';
import { colors, grid } from './constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  margin: 8px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  background-color: ${({ isDragging }) => (isDragging ? 'lightblue' : '#d9fcff')};
  transition: background-color 0.1s ease;

  &:hover {
    background-color: #d9fcff;
  }
`;

const Title = styled.h4`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  &:focus {
    outline: 2px solid ${colors.purple};
    outline-offset: 2px;
  }
`;

export default class Column extends Component {
  render() {
    const {
      title,
      quotes,
      lists,
      index
    } = this.props;

    return (
      <Draggable draggableId={title} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Wrapper>
            <Container
              innerRef={provided.innerRef}
              {...provided.draggableProps}
            >
              <Header isDragging={snapshot.isDragging}>
                <Title
                  isDragging={snapshot.isDragging}
                  {...provided.dragHandleProps}
                >
                  {title}
                </Title>
              </Header>
              <QuoteList
                listId={title}
                listType="QUOTE"
                quotes={quotes}
                autoFocusQuoteId={this.props.autoFocusQuoteId}
                addCard={this.props.addCard}
              />
            </Container>
            {provided.placeholder}
          </Wrapper>
        )}
      </Draggable>
    );
  }
}
