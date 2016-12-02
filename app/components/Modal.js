import React from 'react';

export default function (headerText, innerText, confirm, dismiss) {
    debugger;
    return (<div id="myModal" className="modal fade" role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">{headerText}</h4>
                    </div>
                    <div className="modal-body">
                        <p>{innerText}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={{confirm}}>Confirmar</button>
                        <button type="button" className="btn btn-default" onClick={{dismiss}}>Close</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
