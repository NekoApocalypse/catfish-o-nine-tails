import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { todoList } from '../actions';
import logo from '../trash-alt.svg';

function PriorityTag(props) {
  switch (props.status){
    case 'L':
      return (<span className='priority-l' onClick={props.togglePriority}>Low</span>);
    case 'N':
      return (<span className='priority-n' onClick={props.togglePriority}>Normal</span>);
    case 'I':
      return (<span className='priority-i' onClick={props.togglePriority}>Important</span>);
    case 'C':
      return (<span className='priority-c' onClick={props.togglePriority}>Critical</span>);
    default:
      return null;
  }
}

function OrderToggle(props) {
  return (
    <span 
      className="filter-toggle"
      onClick={props.toggleOrder}>
      <span className={props.status?"dot-yes":"dot-no"}/>
      <span>变更排序</span>
    </span>
  )
}

class ItemSnippet extends Component {
  constructor(props) {
    super(props);
    let item = this.props.item;
    this.state={
      title: item.title,
      description: item.description,
      priority: item.priority,
      is_complete: item.is_complete
    }
  }

  componentWillReceiveProps(nextProps) {
    let item = nextProps.item;
    this.setState({
      title: item.title,
      description: item.description,
      priority: item.priority,
      is_complete: item.is_complete
    });
  }

  restoreState() {
    let item = this.props.item;
    this.setState({
      title: item.title,
      description: item.description,
      priority: item.priority,
      is_complete: item.is_complete
    });
  }

  toggleComplete(e) {
    e.preventDefault();
    e.stopPropagation();
    let item = this.props.item;
    // console.log(`toggling flag from ${item.is_complete}`)
    this.props.partialSubmit(
      {...item, is_complete: !item.is_complete}
    );
    return false;
  }

  togglePriority(e) {
    e.preventDefault();
    e.stopPropagation();
    let item = this.props.item
    let priorityList = ["L", "N", "I", "C"];
    let id = priorityList.indexOf(item.priority);
    id = (id + 1) % priorityList.length;
    this.props.partialSubmit(
      {...item, priority: priorityList[id]}
    );
    return false;
  }

  render() {
    let item = this.props.item;
    let title = item.title;
    let preview = item.description.slice(0, 20);
    let is_complete = item.is_complete;
    let priority = item.priority;
    let active = this.props.active;
    if(!active){
      return (
        <div className="item-snippet" onClick={this.props.onClick}>
          <div className="left-panel">
            <div className="snippet-title">
              {is_complete? (
                <span className='dot-yes' onClick={
                  (e) => this.toggleComplete(e)
                }></span>) :(
                <span className='dot-no' onClick={
                  (e) => this.toggleComplete(e)
                }></span>
              )}
              {title}
            </div>
            <div className="snippet-preview">{preview}</div>
          </div>
          <div className="right-panel">
            <PriorityTag
              status={priority}
              togglePriority={(e) => this.togglePriority(e)}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="active-snippet">
          <form className="snippet-form"
            onSubmit={(e) => {
              e.preventDefault();
              this.props.deactivate();
            }}>
            <input
              className="form-control title-field"
              value={this.state.title}
              onChange={(e) => this.setState(
                {title: e.target.value}
              )}
              required
            />
            <textarea
              className="form-control description-field"
              value={this.state.description}
              rows={3}
              onChange={(e) => this.setState(
                {description: e.target.value}
              )}
              // required
            />
            <div className="priority-box">
              {is_complete? (
                <span className='dot-yes' onClick={
                  (e) => this.toggleComplete(e)
                }></span>) :(
                <span className='dot-no' onClick={
                  (e) => this.toggleComplete(e)
                }></span>
              )}
              <img
                src={logo} 
                className="delete-icon"
                alt="delete" 
                onClick={() =>{
                  this.props.deleteItem();
                  this.props.deactivate();
                }}
              />
              <PriorityTag
                status={priority}
                togglePriority={(e) => this.togglePriority(e)}
              />
            </div>
            <button className="button-no" 
              onClick={() => {
                this.restoreState();
                this.props.deactivate();
              }}
            >取消</button>
            <button className="button-yes"
              onClick={() => {
                this.props.submitItem(this.state)
              }}
            >保存</button>
          </form>
        </div>
      )
    }
  }
}

class AdditionSnippet extends Component {
  state = {
    title: "",
    description: "",
    is_complete: false,
    priority: "N",
  }

  resetState() {
    this.setState({
      title: "",
      description: "",
      is_complete: false,
      prioriry: "N",
    });
    // console.log('resetting addition snippet state...');
  }

  togglePriority(e) {
    e.stopPropagation();
    this.setState(
      (prevState) => {
        let priorityList = ["L", "N", "I", "C"];
        let id = priorityList.indexOf(prevState.priority);
        id = (id + 1) % priorityList.length;
        return ({priority: priorityList[id]});
    });
  }

  toggleComplete(e) {
    e.stopPropagation();
    this.setState(
      prevState => ({
        is_complete: !prevState.is_complete
      })
    );
  }

  submitItem() {
    this.props.submitItem(this.state);
  }

  render() {
    if (this.props.show) {
      return (
        <section className="row addition-section">
          <div className="title-snippet">
            <span className="snippet-title">新条目</span>
          </div>
          <div className="active-snippet">
            <form className="snippet-form"
              onSubmit={(e)=>{
                e.preventDefault();
                this.props.deactivate();
              }}>
              <input
                className="form-control title-field"
                value={this.state.title}
                placeholder="New Title"
                onChange={(e) => this.setState(
                  {title: e.target.value}
                )}
              />
              <div className="textarea-fix">
                <textarea
                  rows={3}
                  className="description-field form-control"
                  value={this.state.description}
                  placeholder="Description Here"
                  onChange={(e) => this.setState(
                    {description: e.target.value}
                  )}
                />
              </div>
              <div className="priority-box">
                {this.state.is_complete? (
                  <span className='dot-yes' onClick={
                    (e) => this.toggleComplete(e)
                  }></span>) :(
                  <span className='dot-no' onClick={
                    (e) => this.toggleComplete(e)
                  }></span>
                )}
                <img src={logo} alt="delete" className="delete-icon"/>
                <PriorityTag 
                  status={this.state.priority}
                  togglePriority={(e) => this.togglePriority(e)}
                />
              </div>
              <button className="button-no"
                onClick={() => this.resetState()}
              >取消</button>
              <button className="button-yes"
                onClick={() => {
                  this.props.submitItem(this.state);
                  this.resetState();
                }}
              >保存</button>
            </form>
          </div>
        </section>
      );
    } else {
      return null;
    }
  }
}

class TodoList extends Component {
  // For actions only
  state = {
    active_id: null,
    addition_active: false,
    order_by_complete: false
  }

  componentDidMount() {
    this.props.fetchItems('time');
  }

  resetForm = () => {
    this.setState(
      {
        active_id: null,
        addition_active: false
      }
    )
  }

  partialSubmit = (item, id) => {
    if (id === null) {
      this.props.addItem(item);
    } else {
      this.props.updateItem(item, id);
    }
  }

  submitItem = (item, id) => {
    if (id === null) {
      this.props.addItem(item)
        .then(this.resetForm());
    } else {
      this.props.updateItem(item, id)
        .then(this.resetForm());
    }
  }

  deleteItem = (id) => {
    this.props.deleteItem(id).then(this.resetForm());
  }

  deactivate = () => {
    this.setState({active_id: null});
  }

  toggleOrder = () => {
    let currentOrder = this.state.order_by_complete;
    this.setState(prevState => ({
      order_by_complete: !prevState.order_by_complete
    }));
    if(currentOrder) {
      this.props.fetchItems('time');
    } else {
      this.props.fetchItems('is_complete');
    }
  }

  render() { return (
    <div>
      <main id="wrap">
        <header className="">
          <div className="container">
            <div className="row title">
              <div className="title-box">
                <h2>渔猫笔记</h2>
                <button 
                  className={"action-button" + (this.state.addition_active? " active": "")}
                  onClick={() => {
                    this.setState(
                      prevState => 
                      ({
                        addition_active: !prevState.addition_active
                      }));
                  }}
                >+ 新条目</button>
              </div>
            </div>
          </div>
          <nav></nav>
        </header>
        <main className="container todo-list-main">
          <AdditionSnippet 
            show={this.state.addition_active}
            submitItem={
              (item) => this.submitItem(item, null)
            }
            deactivate={
              () => this.setState({addition_active: false})
            }
          />
          <section className="row list-section">
            <div className="title-snippet">
              <span className="snippet-title">备忘录</span>
              <OrderToggle
                status={this.state.order_by_complete}
                toggleOrder={() => this.toggleOrder()}
              />
            </div>
            {(this.props.todoList.length > 0?null:
              <div className="item-snippet null-snippet"
                onClick={() => {
                  this.setState(
                    prevState => 
                    ({
                      addition_active: !prevState.addition_active
                    }));
                }}
              >
                <span>备忘录是空的... 添加新条目试试？</span>
              </div>
            )}
            {this.props.todoList.map((item, id) => {
                return (
                  <ItemSnippet 
                    item={item}
                    key={id}
                    active={id===this.state.active_id}
                    onClick={() => {
                      this.setState({active_id: id})
                    }}
                    submitItem={
                      (item) => this.submitItem(item, id)
                    }
                    partialSubmit={
                      (item) => this.partialSubmit(item, id)
                    }
                    deactivate={() => this.setState({active_id: null})}
                    deleteItem={
                      () => this.deleteItem(id)
                    }
                  />
                )
              }
            )}
            {(this.props.todoList.length > 0?
              <div className="subtitle-snippet">
                <span className="snippet-title">没有更多条目了</span>
              </div>:
              null
            )}
          </section>
          <section className="end-clear"></section>
        </main>
      </main>
      <footer className="container-fluid">
        <div className="row">
          <div className="col-md-12 text-center">
            <span>Made by <a href='https://github.com/NekoApocalypse/catfish-o-nine-tails'>NekoApocalypse</a></span>
          </div>
        </div>
      </footer>
    </div>
  )}
}

const mapStateToProps = state => {
  return {
    todoList: state.todoList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addItem: (item) => {
      return dispatch(todoList.addItem(item));
    },
    updateItem: (item, id) => {
      return dispatch(todoList.updateItem(item, id));
    },
    deleteItem: (id) => {
      return dispatch(todoList.deleteItem(id));
    },
    fetchItems: (order) => {
      dispatch(todoList.fetchItems(order));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
