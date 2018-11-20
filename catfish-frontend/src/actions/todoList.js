let baseURL = 'http://localhost:8000';

export const addItem = item => {
  return dispatch => {
    let headers = {'Content-Type': 'application/json'};
    let body = JSON.stringify(item);
    return fetch(`${baseURL}/api/v1/todo_list/`, {headers, method: 'POST', body})
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        else {
          throw(res);
        }
      })
      .then(item => {
        return dispatch({
          type: 'ADD_ITEM',
          item
        })
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export const updateItem = (item, id) => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'};
    let body = JSON.stringify(item);
    // id is React Array id;
    // trueId is server side id; 
    let trueId = getState().todoList[id].id;
    return fetch(`${baseURL}/api/v1/todo_list/${trueId}/`, {headers, method: 'PUT', body})
      .then(res => res.json())
      .then(item => {
        return dispatch({
          type: 'UPDATE_ITEM',
          item,
          id
        })
      })
  }
}

export const deleteItem = id => {
  return (dispatch, getState) => {
    let headers = {'Content-Type': 'application/json'};
    let trueId = getState().todoList[id].id;
    return fetch(`${baseURL}/api/v1/todo_list/${trueId}/`, {headers, method: 'DELETE'})
      .then(res =>{
        if (res.ok) {
          return dispatch({
            type: 'DELETE_ITEM',
            id
          })
        }
      })
  }
}
 
export const sortItems = (order) => {
  return (dispatch, getState) => {
    let items = getState().todoList;
    if(order === 'time') {
      items.sort((a, b) => (b.id - a.id));
    } else if (order === 'is_complete') {
      items.sort((a, b) => {
        if (a.is_complete && !b.is_complete) return 1;
        if (b.is_complete && !a.is_complete) return -1;
        return (b.id - a.id);
      })
    }
    return dispatch({
      type: 'REFRESH_ITEMS',
      items
    });
  }
}

export const fetchItems = (order) => {
  return dispatch => {
    let headers = {'Content-Type': "application/json"};
    return fetch(`${baseURL}/api/v1/todo_list/`, {headers, })
      .then(res => res.json())
      .then(items => {
        if(order === 'time') {
          items.sort((a, b) => (b.id - a.id));
        } else if (order === 'is_complete') {
          items.sort((a, b) => {
            if (a.is_complete && !b.is_complete) return 1;
            if (b.is_complete && !a.is_complete) return -1;
            return (b.id - a.id);
          })
        }
        return dispatch({
          type: 'FETCH_ITEMS',
          items
        });
      })
  }
}