import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

const btnStyle = {
    marginRight: "1%"
};

const showProductsSpan = {
    marginTop: '7px',
    display: 'inline-block',
    marginLeft: '1%'
};

class AlertItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isProductsShown: false
        };

        this.goToAlert = this.goToAlert.bind(this);
        this.showProducts = this.showProducts.bind(this);
    }

    goToAlert() {
        browserHistory.push("/alert/" + this.props._id);
    }

    showProducts() {
        this.setState({
            isProductsShown: !this.state.isProductsShown
        });
    }

    products() {
        if (this.props.products.length > 0) {
            return <a href="#" onClick={this.showProducts}>
                <span style={showProductsSpan}>Temos produtos para este alerta!</span>
            </a>
        }
    }

    render() {

        const productsList = this.state.isProductsShown && this.props.products && this.props.products.length > 0 &&
            this.props.products
                .map(p => <li key={p._id} style={{  }}>
                    <b>{p.productName}</b> a partir de <b>{p.price}</b>!
                    <a href={p.url}> &nbsp; &nbsp; Comprar</a>
                </li>);

        return (
            <li key={this.props._id} className="list-group-item">
                <div className="row" style={{ marginLeft: '1%' }}>
                    <div style={{ float: "left", marginTop: "0.8%" }}>
                        <span >{this.props.alertName}</span>
                    </div>
                    {this.products()}
                    <button onClick={this.props.onDelete} className="btn btn-danger pull-right"
                            style={ btnStyle }>
                        Excluir
                    </button>
                    <button onClick={this.goToAlert} className="btn btn-default pull-right" style={ btnStyle }>
                        Editar
                    </button>
                </div>
                <ul style={{ backgroundColor: '#f4f4f4' }}>
                    {productsList}
                </ul>
            </li>
        )
    }
}

export default AlertItem
