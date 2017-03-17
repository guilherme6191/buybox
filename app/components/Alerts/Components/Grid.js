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
            data: this.props.defaultData || []
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

        this.setState({ data: newData });

        if (this.props.onChange) {
            this.props.onChange(selectedValues);
        }
    },

    // uncheck all items in the list
    reset: function () {
        var newData = [];
        this.state.data.forEach(function (item) {
            item.checked = false;
            newData.push(item);
        });

        this.setState({ data: newData });
    },

    render: function () {
        var options;

        options = this.state.data.map(function (item, index) {
            return (
                <div key={'chk-' + index} className="checkbox">
                    <input type="checkbox" value={item._id}
                           onChange={this.handleItemChange}
                           checked={item.checked ? true : false}/>
                    <label>{item.alertName}</label>
                </div>
            );
        }.bind(this));

        return (
            React.createElement("div", null,
                options
            )
        );
    }
});
