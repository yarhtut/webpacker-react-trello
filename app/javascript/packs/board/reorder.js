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
      destination
    }) => {

      const sourceDroppableId = source.droppableId.split('-')[1]
      const destinationDroppableId = destination.droppableId.split('-')[1]
      const current = [...quoteMap[sourceDroppableId]][1];
      const next = [...quoteMap[destinationDroppableId]][1];
      const currentColumnName = quoteMap[sourceDroppableId][0];
      const nextColumnName = quoteMap[destinationDroppableId][0];

      const target = current[source.index];
      // moving to same list
      if (sourceDroppableId === destinationDroppableId) {
        const reordered = reorderCards(
          current,
          source.index,
          destination.index,
        );

        const cardReOrdered = [ currentColumnName, reordered ]

        const result = {
          ...quoteMap,
          [sourceDroppableId]: cardReOrdered,
        };

        return {
          quoteMap: result,
          // not auto focusing in own list
          autoFocusQuoteId: null,
        };
      }

      // moving to different list
      const cardId = target.id;

      target.list_id = parseInt(destinationDroppableId);

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

      const currentColumn = [ currentColumnName, current ]
      const nextColumn = [ nextColumnName, next ]

      const result = {
        ...quoteMap,
        [sourceDroppableId]: currentColumn,
        [destinationDroppableId]: nextColumn
      };

      return {
        quoteMap: result,
        autoFocusQuoteId: null,
      };
    };

    export default reorder;
