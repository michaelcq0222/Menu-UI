import React from "react";
import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nnd: [],
      items: [],
      cap: [],
      SIndex: 0,
      selected: null
    };
  }

  componentDidMount() {
    fetch(`https://stream-restaurant-menu-svc.herokuapp.com/category/`)
      .then(response => response.json())
      .then(response => {
        for (let obj of response) {
          this.setState({
            items: [...this.state.items, obj.name],
            cap: [...this.state.cap, obj.short_name]
          });
        }
      });
  }

  handleClick = index => {
    this.setState({
      nnd: []
    });
    fetch(
      `https://stream-restaurant-menu-svc.herokuapp.com/item?category=${
        this.state.cap[index]
      }`
    )
      .then(response => response.json())
      .then(response => {
        for (let item of response) {
          let name = item.name,
            description = item.description;
          this.setState({
            nnd: [...this.state.nnd, { name, description }]
          });
        }
      });

    this.setState({
      selected: this.state.cap[index],
      SIndex: index
    });
  };

  render() {
    return (
      <div>
        <div className="side">
          <div className="left">
            <h3>Menu Categories</h3>
            <ul>
              {this.state.items.map((item, index) => {
                return (
                  <li key={item} onClick={this.handleClick.bind(this, index)}>
                    {item} - ({this.state.cap[index]})
                  </li>
                );
              })}
            </ul>
          </div>
          <span className="right" />
          <div className="table">
            <Table
              data={this.state.nnd}
              name={this.state.selected}
              index={this.state.SIndex}
            />
          </div>
        </div>
      </div>
    );
  }
}
class Table extends React.Component {
  setTable = ({ name, description }) => {
    if (this.props.name === null) return;
    return (
      <tbody>
        <tr>
          <td>{name}</td>
          <td>{description}</td>
        </tr>
      </tbody>
    );
  };

  render() {
    const data = this.props.data;
    if (this.props.name === null) return <div />;
    return (
      <div>
        Items in Category: ({this.props.name})
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </tbody>
          {data && data.map(this.setTable)}
        </table>
      </div>
    );
  }
}

export default App;
