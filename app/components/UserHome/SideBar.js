import React from 'react';
import { browserHistory } from 'react-router';

const SideBar = () => {
    const goToAdd = () => {
        browserHistory.push('/userhome/addAlert');
    };
    return (
        <nav className="col-sm-4 col-md-2">
            <ul className="nav nav-sidebar">
                <button className="btn btn-success" onClick={goToAdd}>
                    Adicionar Alerta de Preço
                </button>
            </ul>
        </nav>
    )
};


export default SideBar
