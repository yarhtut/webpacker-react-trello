import React from 'react'

class Cards extends React.Component {

  render() {
    return (
      <div className='card' key={this.props.id}>{this.props.name}</div> 
    )
  }
}

export default Cards;
