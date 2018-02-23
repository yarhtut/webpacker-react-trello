export class Test {

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 8 * 2,
    margin: `0 0 8px 0`,
    borderRadius: 3,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'whiteSmoke',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

   const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 8,
    width: 250,
    margin: 2,
    borderRadius: 3,
  });
}
