import React from 'react';
import { Link } from 'react-router';

const AlertItem = (props) => {
    const deleteBtnStyle = {
        marginRight: "1%"
    };

    return (
        <li key={props._id} className="list-group-item">
            <div className="row" style={{ marginLeft: '1%' }}>
                <Link to={"/alert/" + props._id}>
                    <div style={{ float: "left", marginTop: "0.8%" }}>
                        <span >{props.alertName}</span>
                    </div>
                </Link>

                <button onClick={props.onDelete} className="btn btn-danger pull-right" style={ deleteBtnStyle }>
                    Excluir
                </button>
            </div>
        </li>
    )
};

export default AlertItem
