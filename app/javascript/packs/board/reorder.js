const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');

const reorder = (
  list,
  startIndex,
  endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const moveItem = startIndex + 1;
    const updatePosition = endIndex + 1;

    const data = { position:  updatePosition }

    fetch(`/lists/${moveItem}` , {
      body: JSON.stringify(data),
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'same-origin'
    })

    return result;
  };

  const reorderCards = (
    list,
    startIndex,
    endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      const moveItem = startIndex + 1;
      const updatePosition = endIndex + 1;

      const data = { position:  updatePosition  }

      const currentMoveCard = list.filter((l) => l.position == moveItem )

      fetch(`/cards/${currentMoveCard[0].id}` , {
        body: JSON.stringify(data),
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'same-origin'
      })

      return result;
    };

    export const reorderQuoteMap = ({
      quoteMap,
      source,
      destination,
    }) => {
      const current = [...quoteMap[source.droppableId]];
      const next = [...quoteMap[destination.droppableId]];
      const target = current[source.index];
      // moving to same list
      if (source.droppableId === destination.droppableId) {
        const reordered = reorderCards(
          current,
          source.index,
          destination.index,
        );
        const result = {
          ...quoteMap,
          [source.droppableId]: reordered,
        };
        return {
          quoteMap: result,
          // not auto focusing in own list
          autoFocusQuoteId: null,
        };
      }

      // moving to different list
      const listId = current[0].list_id;
      const sourceCard = current.filter((x) =>  x.position == (source.index + 1));
      const cardId = sourceCard[0].id;
      const data = { source: source, destination: destination, listId: listId, cardId: cardId }

      fetch(`/cards/${cardId}` , {
        body: JSON.stringify(data),
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'same-origin'
      })
      // remove from original
      current.splice(source.index, 1);
      // insert into next
      next.splice(destination.index, 0, target);

      const result = {
        ...quoteMap,
        [source.droppableId]: current,
        [destination.droppableId]: next,
      };

      return {
        quoteMap: result,
        autoFocusQuoteId: target.id,
      };
    };

  export default reorder;
