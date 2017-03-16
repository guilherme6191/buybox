import React from 'react';

const ViewPartnerForm = ({_id, name, email, handleDelete}) => {
    return (
        <li className="list-group-item partner-item">
            <form className="form-inline">
                <div className="form-group">
                    <label>{name}</label>
                </div>
                &nbsp;
                -
                &nbsp;
                <div className="form-group">
                    <label>{email}</label>
                </div>
                &nbsp;
                <button
                    onClick={(event) => {
                        event.preventDefault();
                        handleDelete(_id);
                    }}
                    className="btn btn-danger pull-right">
                    Excluir
                </button>
            </form>
        </li>
    )
};

export default ViewPartnerForm;
