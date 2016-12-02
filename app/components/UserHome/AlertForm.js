import React from 'react'
import { connect } from 'react-redux'
import { addAlert } from '../../actions/alert'
import { browserHistory } from 'react-router';

class AlertForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.back = this.back.bind(this);
    }

    componentWillMount() {
        if (this.props.params) {
            fetch('/alert/' + this.props.params.id, {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.props.token}` }
            }).then((response) => {
                if (response.ok) {
                    response.json().then((json) => {
                        this.setState({
                            ready: true,
                            fields: json.alert
                        })
                    });
                }
            });
        } else {
            this.setState({
                ready: true,
                fields: {
                    alertName: '',
                    product: 'smartphone',
                    ram: '1',
                    storage: '8',
                    dualChip: false,
                    rearCam: '4',
                    frontCam: '4',
                    price: ''
                }
            })
        }
    }

    handleChange(event) {
        this.setState({ fields: Object.assign(this.state.fields, { [event.target.name]: event.target.value }) });
    }

    handleSubmit(event) {
        this.props.dispatch(addAlert(this.state.fields, this.props.token, this.props.user._id));
        event.preventDefault();
        this.back();
    }

    back() {
        browserHistory.push("/userHome");
    }

    render() {
        const form = this.state.ready ?
            (<div className="panel panel-body">
                    <form onSubmit={this.handleSubmit}>
                        <h3>Preencha os dados do produto que deseja comprar:</h3>
                        <div className="form-group col-sm-12">
                            <label>Nome do Alerta</label>
                            <div>
                                <input defaultValue={this.state.fields.alertName} onChange={this.handleChange}
                                       className="form-control"
                                       name="alertName"
                                       type="text"
                                       placeholder="Nome do Alerta" required/>
                            </div>
                        </div>
                        <div className="form-group col-sm-12">
                            <label>Produto</label>
                            <div>
                                <input defaultValue={this.state.fields.product} name="product"
                                       type="text"
                                       className="form-control" disabled/>
                            </div>
                        </div>
                        <div className="form-group col-sm-4">
                            <label>Memória RAM</label>
                            <div>
                                <select defaultValue={this.state.fields.ram} onChange={this.handleChange} name="ram"
                                        className="form-control">
                                    <option value="1">1GB</option>
                                    <option value="2">2GB</option>
                                    <option value="4">4GB</option>
                                    <option value="8">8GB</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group col-sm-4">
                            <label>Armazenamento</label>
                            <div>
                                <select defaultValue={this.state.fields.storage} onChange={this.handleChange}
                                        name="storage"
                                        className="form-control" required>
                                    <option value="8">8GB</option>
                                    <option value="16">16GB</option>
                                    <option value="32">32GB</option>
                                    <option value="64">64GB</option>
                                    <option value="128">128GB</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group col-sm-4">
                            <label>Dual Chip</label>
                            <div>
                                <select defaultValue={this.state.fields.dualChip} onChange={this.handleChange}
                                        name="dualChip"
                                        className="form-control">
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group col-sm-6">
                            <label>Camera Traseira</label>
                            <div>
                                <select defaultValue={this.state.fields.rearCam} onChange={this.handleChange}
                                        name="rearCam"
                                        className="form-control">
                                    <option value="4">4 MP</option>
                                    <option value="8">8 MP</option>
                                    <option value="14">14 MP</option>
                                    <option value="16">16 MP</option>
                                    <option value="99">Maior que 16 MP</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group col-sm-6">
                            <label>Camera Frontal</label>
                            <div>
                                <select defaultValue={this.state.fields.frontCam} onChange={this.handleChange}
                                        name="frontCam"
                                        className="form-control">
                                    <option value="4">4 MP</option>
                                    <option value="8">8 MP</option>
                                    <option value="14">14 MP</option>
                                    <option value="16">16 MP</option>
                                    <option value="99">Maior que 16 MP</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group col-sm-12">
                            <label>Preço que deseja pagar</label>
                            <div>
                                <input defaultValue={this.state.fields.price} onChange={this.handleChange} name="price"
                                       type="text" className="form-control"
                                       placeholder="(R$) Ex.: 1000,00" required/>
                            </div>
                        </div>
                        <div className="form-group col-sm-12">
                            <button type="submit" className="btn btn-success">
                                Enviar
                            </button>
                            <button type="button" className="btn btn-default" onClick={this.back}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            ) : <span> Loading.. </span>;

        return (
            <div>
                {form}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user
    }
};

export default connect(mapStateToProps)(AlertForm)



