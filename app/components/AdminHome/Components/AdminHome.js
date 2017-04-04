import React from 'react';
import { connect } from 'react-redux';

import InsertPartnerForm from './InsertPartnerForm';
import ViewPartnerForm from './ViewPartnerForm';
import MyModal from '../../Modal'
import {getPartners, createPartner, deletePartner} from '../actions';

class AdminHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addNew: false,
      modalShown: false
    };
  }

  componentDidMount() {
    this.props.dispatch(getPartners(this.props.token));
  }

  toggleInsertForm = () => {
    this.setState({
      addNew: !this.state.addNew
    })
  };

  handleChange = (event) => {
    const value = event.target.name === 'admin' || event.target.name === 'partner' ?
    event.target.value === 'on' : event.target.value;
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.dispatch(createPartner(this.state));
    this.toggleInsertForm();
  };

  handleDelete = (id) => {
    this.setState({ selectedId: id });
    this.modalShow();
  };

  modalClose = () => {
    this.setState({ modalShown: false });
    this.setState({ selectedId: null });
  };

  modalShow = () => {
    this.setState({ modalShown: true })
  };

  modalConfirm = () => {
    this.props.dispatch(deletePartner(this.props.token, this.state.selectedId));
    this.modalClose();
  };

  render() {
    const addForm = this.state && this.state.addNew &&
      <InsertPartnerForm
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        handleCancel={this.toggleInsertForm}
      />;
    const partners = this.props.partners &&
      this.props.partners.map(partner =>
        <ViewPartnerForm
          key={partner._id}
          {...partner}
          handleDelete={this.handleDelete} />
      );

    return (
      <div className="container admin-home">
        <div className="row">
          <div className="col-sm-12">
            <ul className="nav nav-sidebar">
              <button className="btn btn-success" onClick={this.toggleInsertForm}>
                Adicionar Parceiro
              </button>
            </ul>
          </div>
        </div>
        <div className="row container insert-container">
          {addForm}
        </div>
        <div className="row container">
          { this.props.ready ? partners : 'Carregando...'  }
        </div>
        <MyModal shown={this.state.modalShown}
                 close={this.modalClose}
                 text="Essa ação é irreversível."
                 title="Tem certeza que deseja excluir este Parceiro?"
                 confirm={this.modalConfirm} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    partners: state.partner.partners,
    ready: state.partner.ready,
    token: state.auth.token
  }
};

export default connect(mapStateToProps)(AdminHome);
