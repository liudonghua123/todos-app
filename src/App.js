import React, { Component } from 'react';
import './App.css';

/**
 * App组件
 */
class App extends Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);
    // 设置状态信息，包括所有的todoItems以及输入框里的内容
    this.state = { todoItems: [], todoText: '' };
    // 保存一份 todoItems 的备份，方便过滤操作
    this.originTodoItems = [];
    // API 请求的网址前缀
    this.api_host = 'http://113.55.12.52:50140';
    // 提取一些通用的ajax请求参数
    this.commonFetchOptions = {
      method: 'GET',
      mode: 'cors', // no-cors, cors, *same-origin
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };
  }

  /**
   * 当组件挂载时，类似于 ready 事件
   */
  async componentDidMount() {
    await this.login();
    await this.loadTodoItems();
  }

  /**
   * 登录获取其他api接口的认证 token
   */
  login = async () => {
    const loginData = {
      email: 'test@test.com',
      password: 'test'
    };
    try {
      // 获取 token
      let response = await fetch(`${this.api_host}/api/users/login`, {
        ...this.commonFetchOptions,
        method: 'POST',
        body: JSON.stringify(loginData)
      });
      const { token } = await response.json();
      // 设置通用的ajax请求参数中请求头里面的Authorization
      this.commonFetchOptions.headers['Authorization'] = token;
    } catch (e) {
      console.log(`Woops!, some error ${e.message} occurs`);
    }
  };

  /**
   * 获取 todoItems 数据
   */
  loadTodoItems = async () => {
    try {
      let response = await fetch(
        `${this.api_host}/api/todos/`,
        this.commonFetchOptions
      );
      response = await response.json();
      const todoItems = response.data;
      console.info(`initial todoItems: ${JSON.stringify(todoItems)}`);
      this.setState({
        todoItems
      });
      this.originTodoItems = todoItems;
    } catch (e) {
      console.log(`Woops!, some error ${e.message} occurs`);
    }
  };

  /**
   * 添加 todoItem
   */
  addTodoItem = async todoItem => {
    try {
      let response = await fetch(`${this.api_host}/api/todos/`, {
        ...this.commonFetchOptions,
        method: 'POST',
        body: JSON.stringify(todoItem)
      });
      response = await response.json();
      console.info(`added todoItem: ${JSON.stringify(response.data)}`);
      await this.loadTodoItems();
    } catch (e) {
      console.log(`Woops!, some error ${e.message} occurs`);
    }
  };

  /**
   * 更新 todoItem
   */
  updateTodoItem = async todoItem => {
    try {
      let response = await fetch(`${this.api_host}/api/todos/${todoItem._id}`, {
        ...this.commonFetchOptions,
        method: 'PUT',
        body: JSON.stringify(todoItem)
      });
      response = await response.json();
      console.info(`updated todoItem: ${JSON.stringify(response.data)}`);
      await this.loadTodoItems();
    } catch (e) {
      console.log(`Woops!, some error ${e.message} occurs`);
    }
  };

  /**
   * 删除已完成的 todoItem 数据
   */
  deleteCompletedTodoItems = async () => {
    try {
      const { todoItems } = this.state;
      const deleteIds = todoItems
        .filter(todoItem => todoItem.isCompleted)
        .map(todoItem => todoItem._id);
      let response = await fetch(`${this.api_host}/api/todos/`, {
        ...this.commonFetchOptions,
        method: 'DELETE',
        body: JSON.stringify({ _ids: deleteIds })
      });
      response = await response.json();
      console.info(`deleted todoItem: ${JSON.stringify(response.data)}`);
      await this.loadTodoItems();
    } catch (e) {
      console.log(`Woops!, some error ${e.message} occurs`);
    }
  };

  /**
   * 输入框的 change 事件回调
   */
  handleChange = e => {
    this.setState({ todoText: e.target.value });
  };

  /**
   * 输入框点击Enter键，创建一个todo
   */
  onCreateItem = e => {
    if (e.key === 'Enter') {
      const { todoText, todoItems } = this.state;
      if (todoText.trim()) {
        const todoItem = {
          text: todoText,
          isCompleted: false
        };
        this.setState({ todoText: '' });
        this.addTodoItem(todoItem);
      }
    }
  };

  /**
   * 改变 todo 的 isCompleted 状态的回调
   */
  toggleCompleted = id => e => {
    let { todoItems } = this.state;
    let todoItem = todoItems.find(item => item._id == id);
    todoItem.isCompleted = !todoItem.isCompleted;
    this.updateTodoItem(todoItem);
  };

  /**
   * 过滤所有的 todoItems
   */
  filterAll = () => {
    this.setState({ todoItems: this.originTodoItems });
  };

  /**
   * 过滤活动的 todoItems
   */
  filterActive = () => {
    this.setState({
      todoItems: this.originTodoItems.filter(item => item.isCompleted == false)
    });
  };

  /**
   * 过滤已经完成的 todoItems
   */
  filterCompleted = () => {
    this.setState({
      todoItems: this.originTodoItems.filter(item => item.isCompleted == true)
    });
  };

  /**
   * 删除已经完成的 todoItems
   */
  clearCompleted = () => {
    this.deleteCompletedTodoItems();
  };

  render() {
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            id="todoContents"
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyPress={this.onCreateItem}
            value={this.state.todoText}
            onChange={this.handleChange}
            autoFocus
          />
        </header>
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul id="todoContainer" className="todo-list">
            {this.state.todoItems.map(item => (
              <li
                className={item.isCompleted ? 'completed' : ''}
                key={item._id}
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={this.toggleCompleted(item._id)}
                  />
                  <label onClick={this.toggleCompleted(item._id)}>
                    {item.text}
                  </label>
                  <button className="destroy" />
                </div>
              </li>
            ))}
          </ul>
          <footer className="footer">
            <span className="todo-count" />
            <ul className="filters">
              <li>
                <a href="#/" className="selected" onClick={this.filterAll}>
                  All
                </a>
              </li>
              <li>
                <a href="#/active" onClick={this.filterActive}>
                  Active
                </a>
              </li>
              <li>
                <a href="#/completed" onClick={this.filterCompleted}>
                  Completed
                </a>
              </li>
            </ul>
            <button className="clear-completed" onClick={this.clearCompleted}>
              Clear completed
            </button>
          </footer>
        </section>
      </section>
    );
  }
}
