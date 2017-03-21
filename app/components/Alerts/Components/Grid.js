'use strict';
var React = require('react');

module.exports = React.createClass({
    displayName: 'CheckBoxList',

    propTypes: {
        defaultData: React.PropTypes.array,
        onChange: React.PropTypes.func
    },

    getInitialState: function () {
        return {
            data: this.props.defaultData || [],
            actionsValue: -1
        };
    },

    handleItemChange: function (e) {
        var selectedValues = [],
            newData = [];

        this.state.data.forEach(function (item) {
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
    reset: function () {
        var newData = [];
        this.state.data.forEach(function (item) {
            item.checked = false;
            newData.push(item);
        });

        this.setState({ data: newData, actionsValue: -1 });
    },

    selectChange: function (event) {
        if (event.target.value === '0') {
            this.reset();
        } else if (event.target.value === '1') {
            var selectedValues = [];

            var newData = this.state.data.map(function (item) {
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

    render: function () {
        var options;

        options = this.state.data.map(function (item, index) {
            return (
                <div key={'chk-' + index} className="checkbox list-group-item grid-item">
                    <div className="grid-checkbox">
                        <input type="checkbox" value={item._id}
                               onChange={this.handleItemChange}
                               checked={item.checked ? true : false}/>
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
                    <span>Ações: </span>
                    <select value={this.state.actionsValue} onChange={this.selectChange}>
                        <option value="-1">&nbsp;</option>
                        <option value="1">Selecionar todos</option>
                        <option value="0">Limpar seleção</option>
                        <option value="2">Criar sugestão</option>
                    </select>
                </div>
                {options}
            </div>
        );
    }
});
