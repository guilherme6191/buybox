import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

import { addAlert } from '../../actions/alert';
import AutoComplete from '../AutoComplete/AutoComplete';


class AlertForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      productFieldDisabled: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.back = this.back.bind(this);
  }

  componentDidMount() {
    if (this.props.params) {
      fetch('/alert/' + this.props.params.id, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.token}`
        }
      }).then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            this.setState({
              ready: true,
              fields: json.alert,
              productFieldDisabled: true
            })
          });
        }
      });
    } else {
      this.setState({
        ready: true,
        fields: {
          alertName: '',
          product: '',
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
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === "granted") {
      const options = {
        body: "Já estamos procurando para você! Fique de olho em seu email e sua Home.",
        icon: "../images/bb-logo.jpg"
      };
      new Notification("BuyBox", options);
    }
    this.props.dispatch(addAlert(this.state.fields, this.props.token, this.props.user._id));
    event.preventDefault();
    this.back();
  }

  handleComplete = (product) => {
    this.setState({
      ready: true,
      fields: {
        ram: product.ram || this.state.fields.ram,
        storage: product.storage || this.state.fields.storage,
        dualChip: product.dualChip || this.state.fields.dualChip,
        rearCam: product.rearCam || this.state.fields.rearCam,
        frontCam: product.frontCam || this.state.fields.frontCam,
        price: this.state.fields.price,
        alertName: this.state.fields.alertName
      }
    })
  };

  back() {
    browserHistory.push("/userHome");
  }

  render() {
    const autoComplete = !this.state.productFieldDisabled &&
      <div className="form-group col-sm-12">
        <label>Produto</label>
        <small style={{color:'#626872'}}>
          &nbsp; - Você pode se basear em um Smartphone para preencher as especificações
          técnicas que deseja.
        </small>
        <div>
          <AutoComplete
            token={this.props.token}
            handleChange={this.handleComplete}
            disabled={this.state.productFieldDisabled}
          />
        </div>
      </div>;
    const form = this.state.ready ?
      (<div className="container panel panel-body">
          <form onSubmit={this.handleSubmit}>
            <h3>Preencha os dados do produto que deseja comprar:</h3>
            <div className="form-group col-sm-12">
              <label>Nome do Alerta</label>
              <div>
                <input value={this.state.fields.alertName}
                       onChange={this.handleChange}
                       className="form-control"
                       name="alertName"
                       type="text"
                       placeholder="Nome do Alerta" required />
              </div>
            </div>
            {autoComplete}
            <div className="form-group col-sm-4">
              <label>Memória RAM</label>
              <div>
                <select value={this.state.fields.ram}
                        onChange={this.handleChange} name="ram"
                        className="form-control">
                  <option value="1">1GB</option>
                  <option value="1.5">1.5GB</option>
                  <option value="2">2GB</option>
                  <option value="4">4GB</option>
                  <option value="8">8GB</option>
                </select>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <label>Armazenamento</label>
              <div>
                <select value={this.state.fields.storage}
                        onChange={this.handleChange}
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
                <select value={this.state.fields.dualChip}
                        onChange={this.handleChange}
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
                <select value={this.state.fields.rearCam}
                        onChange={this.handleChange}
                        name="rearCam"
                        className="form-control">
                  <option value="4">4 MP</option>
                  <option value="5">5 MP</option>
                  <option value="8">8 MP</option>
                  <option value="13">13 MP</option>
                  <option value="14">14 MP</option>
                  <option value="15">15 MP</option>
                  <option value="16">16 MP</option>
                  <option value="99">Maior que 16 MP</option>
                </select>
              </div>
            </div>
            <div className="form-group col-sm-6">
              <label>Camera Frontal</label>
              <div>
                <select value={this.state.fields.frontCam}
                        onChange={this.handleChange}
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
                  <option value="99">Maior que 16 MP</option>
                </select>
              </div>
            </div>
            <div className="form-group col-sm-12">
              <label>Preço que deseja pagar</label>
              <div>
                <input value={this.state.fields.price}
                       onChange={this.handleChange} name="price"
                       type="text" className="form-control"
                       placeholder="(R$) Ex.: 1000,00" required />
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
      ) : <div className="loader"></div>;

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



