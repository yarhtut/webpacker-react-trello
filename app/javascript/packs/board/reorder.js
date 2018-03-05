// @flow
// a little function to help us with reordering the result
const reorder = (
  list,
  startIndex,
  endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const moveItem = startIndex + 1;
    const updatePosition = endIndex + 1;

    const token = document.querySelector(`meta[name='csrf-token']`).getAttribute('content');
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

    //debugger
    return result;
  };

  export default reorder;

  export const reorderQuoteMap = ({
    quoteMap,
    source,
    destination,
  }) => {
    const current: Quote[] = [...quoteMap[source.droppableId]];
    const next: Quote[] = [...quoteMap[destination.droppableId]];
    const target: Quote = current[source.index];

    // moving to same list
    if (source.droppableId === destination.droppableId) {
      const reordered = reorder(
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

    // remove from original
    current.splice(source.index, 1);
    // insert into next
    next.splice(destination.index, 0, target);

    const result: QuoteMap = {
      ...quoteMap,
      [source.droppableId]: current,
      [destination.droppableId]: next,
    };

    return {
      quoteMap: result,
      autoFocusQuoteId: target.id,
    };
  };

