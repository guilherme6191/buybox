'use strict';
const React = require('react');

import ReactPaginate from 'react-paginate';

const PAGE_SIZE = 10;

const getDefaultFilters = () => (
  {
    storage: 128,
    ram: 8,
    rearCam: 16,
    frontCam: 16
  }
);


module.exports = React.createClass({
  displayName: 'CheckBoxList',

  propTypes: {
    defaultData: React.PropTypes.array,
    onChange: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      data: this.props.defaultData.slice(0, PAGE_SIZE) || [],
      actionsValue: -1,
      pageCount: Math.ceil(this.props.defaultData.length / PAGE_SIZE),
      filtering: [],
      defaultFilters: getDefaultFilters()
    };
  },

  handleItemChange: function(e) {
    var selectedValues = [],
      newData = [];

    this.state.data.forEach(function(item) {
      if (item._id === e.target.value) {
        item.checked = e.target.checked;
      }
      if (item.checked) {
        selectedValues.push(item._id);
      }
      newData.push(item);
    });

    this.setState({ data: newData, actionsValue: -1 });
  },

  // uncheck all items in the list
  reset: function() {
    var newData = [];
    this.state.data.forEach(function(item) {
      item.checked = false;
      newData.push(item);
    });

    this.setState({ data: newData, actionsValue: -1 });
  },

  selectChange: function(event) {
    if (event.target.value === '0') {
      this.reset();
    } else if (event.target.value === '1') {
      var selectedValues = [];

      var newData = this.state.data.map(function(item) {
        selectedValues.push(item._id);
        return Object.assign({}, item, { checked: true });
      });

      this.setState({ data: newData });

    } else if (event.target.value === '2') {
      var selectedItems = this.state.data.filter((item) => {
        return item.checked && item;
      });
      this.props.handleSuggestion(selectedItems);
    }
    this.setState({ actionsValue: -1 })
  },

  handlePageClick: function({selected}) {
    const start = selected * PAGE_SIZE;
    this.setState({ data: this.props.defaultData.slice(start, start + PAGE_SIZE) })
  },

  filter: function(value, name) {
    let filtering = [];
    filtering[name] = value;
    let filters = [];
    filters[name] = value;
    this.setState({
      filtering: Object.assign([], this.state.filtering, filtering),
      defaultFilters: Object.assign([], this.state.defaultFilters, filters),
    });
  },

  clearFilters: function () {
    this.setState({
      filtering: [],
      defaultFilters: getDefaultFilters()
    });
  },

  render: function() {
    var options;
    const keys = Object.keys(this.state.filtering);
    let filteredData = this.state.data.slice();
    if (keys.length > 0) {
        keys.map(prop => {
          for (let i = 0; i < filteredData.length; i++) {
            var obj = filteredData[i];
            if (obj[prop] > this.state.filtering[prop]) {
              filteredData.splice(i, 1);
              i--;
            }
          }
        })
    }

    options = filteredData.map(function(item, index) {
      return (
        <div key={'chk-' + index}
             className="checkbox list-group-item grid-item">
          <div className="grid-checkbox">
            <input type="checkbox" value={item._id}
                   onChange={this.handleItemChange}
                   checked={item.checked ? true : false} />
          </div>
          <div className="col-sm-2 storage-cel">
            <label>Memória:</label>
            <span> {item.storage}GB</span>
          </div>
          <div className="col-sm-2 ram-cel">
            <label>RAM:</label>
            <span> {item.ram}GB</span>
          </div>
          <div className="col-sm-2">
            <label>Camera princ.:</label>
            <span> {item.rearCam}MP</span>
          </div>
          <div className="col-sm-2">
            <label>Camera Frontal:</label>
            <span> {item.frontCam}MP</span>
          </div>
          <div className="col-sm-2">
            <label>DualChip:</label>
            <span> {item.dualChip ? "Sim" : "Não"}</span>
          </div>
          <div className="col-sm-2">
            <span>R$ {item.price}</span>
          </div>
        </div>
      );
    }.bind(this));

    return (
      <div>
        <div>
          <span>Ações:&nbsp;</span>
          <select value={this.state.actionsValue} onChange={this.selectChange}>
            <option value="-1">Opções</option>
            <option value="1">Selecionar todos</option>
            <option value="0">Limpar seleção</option>
            <option value="2">Criar sugestão</option>
          </select>
          <br />
          <br />
          <span>Filtros:</span>
          <div className="panel panel-body" style={{padding: '5px'}}>
            <div className="col-sm-2 text-center">
              Memória
              <div>
                <select
                  name="storage"
                  className="form-control"
                  value={this.state.defaultFilters.storage}
                  onChange={(e)=>this.filter(e.target.value, 'storage')}
                >
                  <option value="8">8GB</option>
                  <option value="16">16GB</option>
                  <option value="32">32GB</option>
                  <option value="64">64GB</option>
                  <option value="128">128GB</option>
                </select>
              </div>
            </div>
            <div className="col-sm-2 text-center">
              Memória RAM
              <div>
                <select
                  value={this.state.defaultFilters.ram}
                  onChange={(e)=>this.filter(e.target.value, 'ram')}
                  name="ram"
                  className="form-control"
                >
                  <option value="1">1GB</option>
                  <option value="1.5">1.5GB</option>
                  <option value="2">2GB</option>
                  <option value="4">4GB</option>
                  <option value="8">8GB</option>
                </select>
              </div>
            </div>
            <div className="col-sm-2 text-center">
              Camera Principal
              <div>
                <select
                  value={this.state.defaultFilters.rearCam}
                  onChange={(e)=>this.filter(e.target.value, 'rearCam')}
                  name="rearCam"
                  className="form-control">
                  <option value="4">4 MP</option>
                  <option value="5">5 MP</option>
                  <option value="8">8 MP</option>
                  <option value="13">13 MP</option>
                  <option value="14">14 MP</option>
                  <option value="15">15 MP</option>
                  <option value="16">16 MP</option>
                </select>
              </div>
            </div>
            <div className="col-sm-2 text-center">
              Camera Frontal
              <div>
                <select
                  value={this.state.defaultFilters.frontCam}
                  onChange={(e)=>this.filter(e.target.value, 'frontCam')}
                  name="frontCam"
                  className="form-control">
                  <option value="1">1 MP</option>
                  <option value="1.2">1.2 MP</option>
                  <option value="1.5">1.5 MP</option>
                  <option value="2">2 MP</option>
                  <option value="3">3 MP</option>
                  <option value="4">4 MP</option>
                  <option value="5">5 MP</option>
                  <option value="6">6 MP</option>
                  <option value="8">8 MP</option>
                  <option value="14">14 MP</option>
                  <option value="16">16 MP</option>
                </select>
              </div>
            </div>
            <div
              className="col-sm-1"
              style={{paddingTop: '30px'}}>
              <a href="#" onClick={this.clearFilters}>Limpar</a>
            </div>
            <div className="col-sm-3" style={{paddingTop: '5px'}}>
              <p>
                <small style={{color: 'gray'}}>
                  A partir do parâmetro selecionados, os valores inferiores da mesma categoria
                  também são utilizados.
                </small>
              </p>
            </div>
          </div>
        </div>
        {options}
        <ReactPaginate previousLabel={"anterior"}
                       nextLabel={"próximo"}
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={this.state.pageCount}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageClick}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
      </div>
    );
  }
});
