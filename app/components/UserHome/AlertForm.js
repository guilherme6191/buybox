import React from 'react'
import { connect } from 'react-redux'
import { form } from '../../actions/form'

class AlertForm extends React.Component {
    constructor() {
        super();
        this.state = {
            fields: {  // used to populate
                alertName: '',
                product: 'smartphone',
                ram: '512',
                storage: '8',
                dualChip: false,
                rearCam: '4',
                frontCam: '4',
                price: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        debugger;
        this.setState({ fields: Object.assign(this.state.fields, { [event.target.name]: event.target.value }) });
    }

    handleSubmit(event) {
        debugger;
        this.props.dispatch(form(this.state.fields));
    }


    render() {
        return (
            <div className="col-sm-offset-1" style={{width:"70%"}}>
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
                                <option defaultValue="512MB">512MB</option>
                                <option defaultValue="1">1GB</option>
                                <option defaultValue="2">2GB</option>
                                <option defaultValue="4">4GB</option>
                                <option defaultValue="8">8GB</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group col-sm-4">
                        <label>Armazenamento</label>
                        <div>
                            <select defaultValue={this.state.fields.storage} onChange={this.handleChange} name="storage"
                                    className="form-control" required>
                                <option defaultValue="8">8GB</option>
                                <option defaultValue="16">16GB</option>
                                <option defaultValue="32">32GB</option>
                                <option defaultValue="64">64GB</option>
                                <option defaultValue="128">128GB</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group col-sm-4">
                        <label>Dual Chip</label>
                        <div>
                            <input defaultValue={this.state.fields.dualChip} onChange={this.handleChange}
                                   name="dualChip"
                                   type="checkbox"
                                   className="checkbox"/>
                        </div>
                    </div>
                    <div className="form-group col-sm-6">
                        <label>Camera Traseira</label>
                        <div>
                            <select defaultValue={this.state.fields.rearCam} onChange={this.handleChange} name="rearCam"
                                    className="form-control">
                                <option defaultValue="4">4 MP</option>
                                <option defaultValue="8">8 MP</option>
                                <option defaultValue="14">14 MP</option>
                                <option defaultValue="16">16 MP</option>
                                <option defaultValue="99">Maior que 16 MP</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group col-sm-6">
                        <label>Camera Frontal</label>
                        <div>
                            <select defaultValue={this.state.fields.frontCam} onChange={this.handleChange}
                                    name="frontCam"
                                    className="form-control">
                                <option defaultValue="4">4 MP</option>
                                <option defaultValue="8">8 MP</option>
                                <option defaultValue="14">14 MP</option>
                                <option defaultValue="16">16 MP</option>
                                <option defaultValue="99">Maior que 16 MP</option>
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
                            Submit
                        </button>
                        <button type="button" className="btn btn-warning">Clear Values
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect()(AlertForm)



