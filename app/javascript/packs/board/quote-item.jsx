import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { borderRadius, colors, grid } from './constants';

const Container = styled.a`
border-radius: ${borderRadius}px;
border: 1px solid grey;
background-color: ${({ isDragging }) => (isDragging ? colors.green : colors.white)};

box-shadow: ${({ isDragging }) => (isDragging ? `2px 2px 1px ${colors.shadow}` : 'none')};
padding: ${grid}px;
min-height: 40px;
margin-bottom: ${grid}px;
user-select: none;
transition: background-color 0.1s ease;

color: ${colors.black};

&:hover {
  background-color: ${colors.blue.lighter};
  text-decoration: none;
}
&:focus {
  outline: 2px solid ${colors.purple};
  box-shadow: none;
}

display: flex;
align-items: center;
`;

const Avatar = styled.img`
width: 40px;
height: 40px;
border-radius: 50%;
margin-right: ${grid}px;
flex-shrink: 0;
flex-grow: 0;
`;

const Content = styled.div`
flex-grow: 1;
flex-basis: 100%

display: flex;
flex-direction: column;
`;

const BlockQuote = styled.div`
`;

const Footer = styled.div`
display: flex;
margin-top: ${grid}px;
`;

const QuoteId = styled.span`
width: 40px;
height: 40px;
border-radius: 50%;
margin-right: ${grid}px;
flex-shrink: 0;
flex-grow: 0;
`;

const Attribution = styled.small`
margin: 0;
margin-left: ${grid}px;
text-align: right;
flex-grow: 1;
`;

export default class QuoteItem extends React.PureComponent {
  componentDidMount() {
    if (!this.props.autoFocus) {
      return;
    }
    // eslint-disable-next-line react/no-find-dom-node
    const node: HTMLElement = (ReactDOM.findDOMNode(this) : any);
    node.focus();
  }

  render() {
    const { quote, isDragging, provided } = this.props;
    return (
      <Container
        href={quote.name}
        isDragging={isDragging}
        innerRef={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Content>
          <BlockQuote>{quote.name}</BlockQuote>
          <QuoteId>(id: {quote.id})</QuoteId>
        </Content>
      </Container>
    );
  }
}

//<Avatar src={quote.name} alt={quote.name} />
//<Footer>
//  <Attribution>{quote.name}</Attribution>
//</Footer>
