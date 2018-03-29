import React, { Component } from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import QuoteItem from './quote-item';
import { colors, grid } from './constants';

const Wrapper = styled.div`
background-color: ${({ isDraggingOver }) => (isDraggingOver ? '#d9fcff' : 'lightblue')};
display: flex;
flex-direction: column;
opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
padding: 8px;
padding-bottom: 0;
transition: background-color 0.1s ease, opacity 0.1s ease;
user-select: none;
width: 250px;
`;

const DropZone = styled.div`
min-height: 250px;
margin-bottom: 8px;
`;

const ScrollContainer = styled.div`
overflow-x: hidden;
overflow-y: auto;
max-height: 300px;
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

const Container = styled.div``;

class InnerQuoteList extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.quotes !== this.props.quotes) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div>
        {this.props.quotes.map((quote, index) => (
          <Draggable key={quote.id} draggableId={quote.id} index={index}>
            {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
              <div>
                <QuoteItem
                  key={quote.id}
                  quote={quote}
                  isDragging={dragSnapshot.isDragging}
                  provided={dragProvided}
                  autoFocus={this.props.autoFocusQuoteId === quote.id}
                />
              {dragProvided.placeholder}
            </div>
            )}
          </Draggable>
        ))}
      </div>
    );
  }
}

class InnerList extends Component {

  render() {
    const { index,title, quotes, dropProvided, autoFocusQuoteId, cardText } = this.props;
    const addCard = this.props.addCard.bind(null, title, cardText);
    const handleCardText = this.props.handleCardText.bind(null, title);
    const handleToggleForm = this.props.handleToggleForm.bind(null, title);

    console.log(this.props.toggleForm) 
    const form = (this.props.toggleForm == title) ? (
      <form onSubmit={addCard}>
        <input type="text" value={cardText} onChange={handleCardText} />
        <input type="submit" value="Add Card" className='btn' />
      </form>
    ) : <button className='btn' onClick={handleToggleForm}>add new</button>;

    return (
      <Container>
        <DropZone innerRef={dropProvided.innerRef}>
          <InnerQuoteList
            quotes={quotes}
            autoFocusQuoteId={autoFocusQuoteId}
          />
          { dropProvided.placeholder }
        </DropZone>
        { form }
      </Container>
    );
  }
}

export default class QuoteList extends Component {
  render() {
    const {
      ignoreContainerClipping,
      internalScroll,
      isDropDisabled,
      index,
      listId,
      listType,
      style,
      quotes,
      autoFocusQuoteId,
      title,
      addCard,
      cardText,
      handleCardText,
      handleToggleForm,
      toggleForm
    } = this.props;

    return (
      <Droppable
        droppableId={listId}
        type={listType}
        ignoreContainerClipping={ignoreContainerClipping}
        isDropDisabled={isDropDisabled}
      >
        {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
          <Wrapper
            style={style}
            isDraggingOver={dropSnapshot.isDraggingOver}
            isDropDisabled={isDropDisabled}
            {...dropProvided.droppableProps}
          >
            {internalScroll ? (
              <ScrollContainer>
                <InnerList
                  quotes={quotes}
                  title={title}
                  dropProvided={dropProvided}
                  autoFocusQuoteId={autoFocusQuoteId}
                />
              </ScrollContainer>
            ) : (
              <InnerList
                index={index}
                quotes={quotes}
                title={title}
                dropProvided={dropProvided}
                autoFocusQuoteId={autoFocusQuoteId}
                addCard={addCard}
                cardText={cardText}
                toggleForm={toggleForm}
                handleCardText={handleCardText}
                handleToggleForm={handleToggleForm}
              />
            )}
          </Wrapper>
        )}
      </Droppable>
    );
  }
}
