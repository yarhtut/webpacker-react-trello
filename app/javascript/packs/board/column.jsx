import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import QuoteList from './quote-list';
import { colors, grid } from './constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
`;

const Container = styled.div`
  margin: 8px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  height: 3rem;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background-color: ${({ isDragging }) => (isDragging ? 'lightblue' : '#e2e4e6')};
  transition: background-color 0.1s ease;

  &:hover {
    background-color: #d9fcff;
  }
`;
//lightblue
//d9fcff
const Title = styled.h4`
  padding: 8px;
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
      droppableTitle,
      quotes,
      index,
      addCard,
      cardText,
      handleCardText,
      handleToggleForm,
      toggleForm
    } = this.props;

    return (
      <Draggable draggableId={droppableTitle} index={index}>
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
                title={title}
                index={index}
                listType="QUOTE"
                quotes={quotes}
                autoFocusQuoteId={this.props.autoFocusQuoteId}
                index={index}
                addCard={addCard}
                cardText={cardText}
                toggleForm={toggleForm}
                handleCardText={handleCardText}
                handleToggleForm={handleToggleForm}
              />
            </Container>
            {provided.placeholder}
          </Wrapper>
        )}
      </Draggable>
    );
  }
}
