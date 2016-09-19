import React from 'react';
import { connect } from 'react-redux'
import Messages from './Messages';
import UserHome from './UserHome';

class Home extends React.Component {
  render() {
    const home = this.props.token ?  (
        <div>
          Usuário Logado
          <UserHome></UserHome>
        </div>
    ): (
      <div>
        <div className="row">
            <div className="col-sm-12">
              <div className="panel">
                <div className="panel-body">
                  <h4>O que é o BuyBox? </h4>
                  <p>O BuyBox é um sistema de alerta de preços baseado em especificações técnicas.</p>
                  <p>Ah, mas já existe sistemas de alertas de preço.</p>
                  <p>Sim, mas não por especificações técnicas. Ao invés de focarmos em produtos, focamos nas suas necessidades 
                  técnicas. Isso deixa muito mais abrangente a sua procura pelo com oportunidade de vocês encontrarem o que realmente necessitam.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="panel">
                <div className="panel-body">
                  <h4>Como funciona?</h4>
                  <p>Você cadastra suas necessidades, exemplo: Celular com 32GB de RAM e câmera de 12MP, por no máximo R$ 1.200,00.</p>
                  <p>A gente te notifica por email assim que encontrarmos <b>qualquer</b> produto que atinja suas necessidade e abaixo
                  do preço que nos foi informado. Mas lembre-se, pode ser que a gente encontre também um produto <i><b>MELHOR</b></i> 
                  do que vocês estavam esperando.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="panel">
                <div className="panel-body">
                  <h4>Mais informações</h4>
                  <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor
                    mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna
                    mollis euismod. Donec sed odio dui.</p>
                </div>
            </div>
          </div>
          </div>
        </div>
      );
    return (      
      <div className="container-fluid">
        <Messages messages={this.props.messages}/>
        {home}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  
  return {
    messages: state.messages,
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(Home);
