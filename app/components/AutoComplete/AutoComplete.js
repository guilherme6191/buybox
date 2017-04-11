import React from 'react';

import Select from 'react-select';

function buildList(products) {
  return products
    .filter((el, i, arr) => arr.findIndex(el2 => el2.productName === el.productName) === i)
    .map(item => {
      return { value: item._id, label: `${item.productName} - preços a partir de ${item.price}` }
    });
}

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{}]
    }
  }

  componentDidMount() {
    fetch('/products', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.props.token}` }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          this.setState({ list: buildList(json.products), data: json.products })
        });
      }
    });
  }

  handleChange = ({value}) => {
    this.props.handleChange(this.state.data.find(item=>item._id === value));
  };

  render() {
    return (<Select
      name="form-field-name"
      options={this.state.list}
      onChange={this.handleChange}
      className="input-search"
      placeholder="Pesquisar"
    />)
  }
}

export default AutoComplete

