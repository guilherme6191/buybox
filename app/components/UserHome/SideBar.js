import React from 'react';
import { browserHistory } from 'react-router';

const SideBar = () => {
    const goToAdd = () => {
        browserHistory.push('/addAlert');
    };
    return (
        <div className="col-sm-12" style={{marginBottom:'10px'}}>
            <ul className="nav nav-sidebar">
                <button className="btn btn-success" onClick={goToAdd}>
                    Adicionar Alerta de Preço
                </button>
            </ul>
        </div>
    )
};


export default SideBar
