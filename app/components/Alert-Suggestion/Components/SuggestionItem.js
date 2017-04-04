import React from 'react';

const SuggestionItem = ({
  _id, productName, ram, rearCam, frontCam, storage, dualChip, price, companyName, url
  }) => {
  return (

    <li className="list-group-item grid-item"
        key={_id} style={{minHeight:'65px'}}>
      <div className="col-sm-12 names-cel">
        {productName} - {companyName}
      </div>
      <div className="col-sm-2 storage-cel">
        <label>Memória:</label>
        <span> {storage}GB</span>
      </div>
      <div className="col-sm-2 ram-cel">
        <label>RAM:</label>
        <span> {ram}GB</span>
      </div>
      <div className="col-sm-2">
        <label>Camera princ.:</label>
        <span> {rearCam}MP</span>
      </div>
      <div className="col-sm-2">
        <label>Camera Frontal:</label>
        <span> {frontCam}MP</span>
      </div>
      <div className="col-sm-2">
        <label>DualChip:</label>
        <span> {dualChip ? "Sim" : "Não"}</span>
      </div>
      <div className="col-sm-1">
        <span>R$ {price}</span>
      </div>
      <div className="col-sm-1">
        <a href={url}>
          <span>COMPRAR</span>
        </a>
      </div>
    </li>

  )
};

export default SuggestionItem;
