import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import TodoList from './components/TodoList';
import NotFound from './components/NotFound';
import catfishApp from './reducers';
// import logo from './logo.svg';
import logo from './trash-alt.svg';
import './style/App.css';

let store = createStore(catfishApp, applyMiddleware(thunk));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={TodoList} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
