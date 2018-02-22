import React from 'react'
import Cards from './cards.jsx'

class Lists extends React.Component {
  constructor() {
    super()
    this.state = {
      lists: [],
      cards: [],
      value: ''
    }

    this.addCard = this.addCard.bind(this);
    this.handleCardText = this.handleCardText.bind(this);
  }

  componentDidMount() {
    fetch('/lists.json')
    .then(res => res.json())
    .then(res => this.setState({ lists: res }))
    fetch('/cards.json')
    .then(res => res.json())
    .then(res => this.setState({ cards: res }))
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
    const allLists = this.state.lists.map((list) => {
      const allCards = this.state.cards.map((card) => {
        if (card.list_id == list.id) {
          return <Cards key={card.id} name={card.name}/>
        }
      })

      const form = (this.state.formKey == list.id) ?
      (
        <form >
          <input type="text" value={this.state.value} onChange={this.handleCardText} onKeyPress={this.addCard.bind(this, list.id)} />
          <input type="submit" value="Add Card" />
        </form>
      ) : ( <button onClick={this.openForm.bind(this,list.id)}>Add Card</button> )


      return (
        <div className='col-3 card list'>
          <h4 key={ list.id }>{ list.name }</h4>
          { allCards }
          { form }
        </div>
      )
    })

    return <div className='row'>
      { allLists }
      <a href='/lists/new' className='btn col-3 card'>Add List</a>
    </div>
  }
}
export default Lists
