import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import Modal from '../Modal';

const btnStyle = {
    marginRight: "1%"
};

const showProductsSpan = {
    marginTop: '7px',
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
            isThereMatch: this.props.products.some(p => p.isMatch)
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
            let matchText = this.state.isThereMatch && <span style={{color: 'red'}}>MATCH!</span>;

            return (<a href="#" onClick={this.showProducts}>
                <span style={showProductsSpan}>Temos produtos para este alerta! &nbsp;{matchText}</span>
            </a>)
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
                    <button data-toggle="modal" data-target="#myModal"
                            className="btn btn-danger pull-right"
                            style={ btnStyle }>
                        Excluir
                    </button>
                    <button onClick={this.goToAlert} className="btn btn-default pull-right" style={ btnStyle }>
                        Editar
                    </button>
                </div>
                <ul style={{ backgroundColor: '#f4f4f4', padding: '0px' }}>
                    {productsList}
                </ul>
                <div id="myModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Tem certeza que deseja excluir este item?</h4>
                            </div>
                            <div className="modal-body">
                                <p>Esta ação é definitiva.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button"
                                        className="btn btn-success"
                                        onClick={this.props.onDelete}
                                        data-dismiss="modal">
                                    Confirmar
                                </button>
                                <button type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal">
                                    Cancelar
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </li>

        )
    }
}

export default AlertItem
