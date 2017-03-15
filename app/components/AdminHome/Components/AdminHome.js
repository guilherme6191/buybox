import React from 'react';
import { connect } from 'react-redux';

import InsertPartnerForm from './InsertPartnerForm';
import ViewPartnerForm from './ViewPartnerForm';
import {getPartners, createPartner, deletePartner} from '../actions';

class AdminHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addNew: false
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
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.dispatch(createPartner(this.state));
    };

    handleDelete = (id) => {
        this.props.dispatch(deletePartner(this.props.token, id));
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
                    handleDelete={this.handleDelete}/>
            );

        return (
            <div className="container admin-home">
                <h2>Hello, Admin!</h2>
                <div className="row">
                    <div className="col-sm-12">
                        <ul className="nav nav-sidebar">
                            <button className="btn btn-success" onClick={this.toggleInsertForm}>
                                Adicionar Parceiro
                            </button>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    {addForm}
                </div>
                <div className="row partners-container">
                    { this.props.ready ? partners : 'Carregando...'  }
                </div>
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
