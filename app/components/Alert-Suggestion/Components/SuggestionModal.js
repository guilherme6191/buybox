import React from 'react';
import {Modal, Button} from 'react-bootstrap'

const initialState = {
  productName: '',
  ram: '1',
  storage: '8',
  dualChip: false,
  rearCam: '4',
  frontCam: '4',
  price: '',
  url: '',
  companyName: ''
};

class SuggestionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  };


  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleConfirm = () => {
    this.props.submitSuggestion(this.state);
    this.setState(initialState);
  };

  render() {
    return (
      <div className="modal-container">
        <Modal
          show={this.props.shown}
          onHide={this.props.close}
          container={this}
          aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Criar Sugestão
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{height: "700px"}}>
            Criar sugestão baseado em {this.props.alertQt} Alertas. <br />
            Sugestão será enviada para {this.props.userQt} usuários.
            <hr style={{borderTop: "1px solid #e5e5e5"}} />
            <form onSubmit={(event)=>event.preventDefault()}>
              <h5>Preencha os dados do produto que deseja oferecer aos donos dos
                alertas:</h5>
              <hr style={{borderTop: "1px solid #e5e5e5"}} />
              <div className="form-group col-sm-12">
                <label>Modelo do Smartphone</label>
                <div>
                  <input defaultValue={this.state.productName}
                         onChange={this.handleChange}
                         className="form-control"
                         name="productName"
                         type="text"
                         placeholder="Ex.: Iphone 9SX" required />
                </div>
              </div>
              <div className="form-group col-sm-12">
                <label>URL para compra</label>
                <div>
                  <input defaultValue={this.state.url}
                         onChange={this.handleChange}
                         name="url"
                         type="text"
                         className="form-control"
                         placeholder="Ex.: http://wayneentreprises.com/batphone"
                         required />
                </div>
              </div>
              <div className="form-group col-sm-4">
                <label>Memória RAM</label>
                <div>
                  <select defaultValue={this.state.ram}
                          onChange={this.handleChange}
                          name="ram"
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
                  <select defaultValue={this.state.storage}
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
                  <select defaultValue={this.state.dualChip}
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
                  <select defaultValue={this.state.rearCam}
                          onChange={this.handleChange}
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
                  <select defaultValue={this.state.frontCam}
                          onChange={this.handleChange}
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
                <label>Preço</label>
                <div>
                  <input defaultValue={this.state.price}
                         onChange={this.handleChange}
                         name="price"
                         type="text" className="form-control"
                         placeholder="(R$) Ex.: 1000,00" required />
                </div>
              </div>
              <div className="form-group col-sm-12">
                <label>Nome da empresa/loja</label>
                <div>
                  <input defaultValue={this.state.companyName}
                         onChange={this.handleChange}
                         name="companyName"
                         type="text"
                         className="form-control"
                         placeholder="Wayne Enterprises"
                         required />
                </div>
              </div>
              <div className="col-sm-12 form-group">
                <Button type="submit"
                        onClick={this.handleConfirm}
                        className="btn btn-success">
                  Confirmar
                </Button>
                <Button onClick={this.props.close}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    )
  };
}

export default SuggestionModal;

