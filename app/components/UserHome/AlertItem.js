import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

const btnStyle = {
    marginRight: "1%"
};

const showProductsSpan = {
    marginTop: '8.5px',
    display: 'inline-block',
    marginLeft: '1%'
};

const alertNameContainer = {
    float: "left",
    marginTop: "0.8%"
};

class AlertItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isProductsShown: false,
            isThereMatch: this.props.products.some(p => p.isMatch),
            productsDisplay: 'none'
        };

        this.goToAlert = this.goToAlert.bind(this);
        this.showProducts = this.showProducts.bind(this);
        this.delete = this.delete.bind(this);
    }

    goToAlert() {
        browserHistory.push("/alert/" + this.props._id);
    }

    showProducts() {
        this.setState({
            isProductsShown: !this.state.isProductsShown,
            productsDisplay: !this.state.isProductsShown ? 'block' : 'none'
        });
    }

    products() {
        if (this.props.products.length > 0) {
            let matchText = this.state.isThereMatch && <span style={{color: 'red'}}>MATCH!</span>;

            return (<a href="#" onClick={this.showProducts}>
                <span style={showProductsSpan}>Temos produtos para este alerta! &nbsp;{matchText}</span>
            </a>)
        }
    }

    delete() {
        if (confirm("Esta ação é definitiva.")) {
            this.props.onDelete(this.props._id);
        }
    }

    render() {

        const productsList = this.state.isProductsShown && this.props.products && this.props.products.length > 0 &&
            this.props.products
                .map(p =>
                    <a key={p.url + '' + p._id} href={p.url}>
                        <li key={p._id}
                            className="list-group-item"
                            style={{ color: p.isMatch && '#3c763d', backgroundColor: p.isMatch && '#dff0d8' }}>
                            <b>
                                {p.productName}
                            </b>
                            <span className="badge">{p.price}</span>
                        </li>
                    </a>);

        return (
            <li key={this.props._id} className="list-group-item">
                <div className="row"
                     style={{ marginLeft: '1%', marginRight: '1%' }}>
                    <div style={alertNameContainer}>
                        <span>{this.props.alertName}</span>
                    </div>
                    {this.products()}
                    <button onClick={this.delete}
                            className="btn btn-danger pull-right"
                            style={ btnStyle }>
                        Excluir
                    </button>
                    <button onClick={this.goToAlert} className="btn btn-default pull-right" style={ btnStyle }>
                        Editar
                    </button>
                </div>
                <ul style={{ display: this.state.productsDisplay }}
                    className="product-list">
                    {productsList}
                </ul>

            </li>

        )
    }
}

export default AlertItem
