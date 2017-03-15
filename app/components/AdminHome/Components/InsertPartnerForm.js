import React from 'react';

const InsertPartnerForm = ({handleChange, handleSubmit, handleCancel}) => {
    return (
        <li className="list-group-item">
            <form className="form-inline"
                  onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nome:</label>
                    <input type="text"
                           name="name"
                           onChange={handleChange}
                           className="form-control"
                           placeholder="Empresa ou pessoa"
                           required/>
                </div>
                &nbsp;
                <div className="form-group">
                    <label>Email:</label>
                    <input type="text"
                           name="email"
                           onChange={handleChange}
                           className="form-control"
                           placeholder="bruce@waynecorporation.com"
                           required/>
                </div>
                &nbsp;
                <div className="form-group">
                    <label>Senha:</label>
                    <input type="password"
                           name="password"
                           onChange={handleChange}
                           className="form-control"
                           placeholder="*********"
                           required/>
                </div>
                <button type="submit" className="btn btn-success pull-right">
                    Salvar
                </button>
                <button type="button"
                        className="btn btn-default pull-right"
                        onClick={handleCancel}>
                    Cancelar
                </button>
            </form>
        </li>
    )
};

export default InsertPartnerForm;
