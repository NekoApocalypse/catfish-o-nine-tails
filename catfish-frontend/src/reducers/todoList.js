const initialState = [
/*
  {
      title: 'Write code!',
      description: 'Work in progress.',
      id: 0
  }
*/
];

function todoList(state=initialState, action) {
  let itemList = state.slice();
  switch (action.type) {
    case 'ADD_ITEM':
      return [action.item, ...state];
    case 'UPDATE_ITEM':
      let target = itemList[action.id];
      target = {...target, ...action.item}
      itemList.splice(action.id, 1, target);
      return itemList;
    case 'DELETE_ITEM':
      itemList.splice(action.id, 1);
      return itemList;
    case 'FETCH_ITEMS':
      return [...action.items]
    case 'REFRESH_ITEMS':
      return [...action.items]
    default:
      return state;
  }
}

export default todoList;
