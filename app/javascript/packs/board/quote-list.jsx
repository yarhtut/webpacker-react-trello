import React, { Component } from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import QuoteItem from './quote-item';
import Title from './title';

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

const Container = styled.div``;

class InnerQuoteList extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.quotes !== this.props.quotes) {
      return true;
    }
    return false;
  }

  render() {
    //console.log(this.props.quotes.map((quote, index) => console.log(quote)));
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
  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }

    this.addCard = this.addCard.bind(this);
    this.handleCardText = this.handleCardText.bind(this);
  }

  openForm(listId, e) {
    //this.setState({formKey: listId, value: ''});
  }

  handleCardText(e) {
    this.setState({value: e.target.value});
  }

  addCard(listId, e) {
    e.preventDefault();
    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');

    const data = {  list_id: listId, name: this.state.value }

    fetch(`/cards` , {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })
    //.then(() => {
    //  fetch('/cards.json')
    //  .then(res => res.json())
    //  .then(res => this.setState({ cards: res }))
    //})
  }

  render() {
    const { quotes, dropProvided, autoFocusQuoteId } = this.props;
    const title = this.props.title ? (
      <Title>{this.props.title}</Title>
    ) : null;
    const currentListId = quotes.map((q) => q.list_id)

    return (
      <Container>
        {title}
        <DropZone innerRef={dropProvided.innerRef}>
          <InnerQuoteList
            quotes={quotes}
            autoFocusQuoteId={autoFocusQuoteId}
          />
          {dropProvided.placeholder}
        </DropZone>
        <form onSubmit={this.addCard.bind(this, currentListId[0])} >
          <input type="text" value={this.state.value} onChange={this.handleCardText} />
          <input type="submit" value="Add Card" className='btn' />
        </form>
      </Container>
    );
  }
}

export default class QuoteList extends Component<Props> {
  render() {
    const {
      ignoreContainerClipping,
      internalScroll,
      isDropDisabled,
      listId,
      listType,
      style,
      quotes,
      autoFocusQuoteId,
      title,
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
                quotes={quotes}
                title={title}
                dropProvided={dropProvided}
                autoFocusQuoteId={autoFocusQuoteId}
              />
            )}
          </Wrapper>
        )}
      </Droppable>
    );
  }
}

// <button onClick={this.openForm.bind(this, currentListId[0])} className='btn'>Add Card</button>
