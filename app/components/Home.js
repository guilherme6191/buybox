import React from 'react';
import { connect } from 'react-redux'
import Messages from './Messages';
import UserHome from './UserHome/UserHome';
//<img src="../images/bb-logo-full.jpg" width="120px" alt="BuyBox"/>
class Home extends React.Component {

    render() {
        const home = (
            <div className="mkt-page">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="panel mkt-panel">
                            <div className="panel-body text-center">
                                <h1>O que é o BuyBox? </h1>
                                <p>Você conta pra gente o que precisa em um Smartphone e a gente procura pra você!</p>
                                <p>O BuyBox é um sistema de alerta de preços baseado em especificações técnicas para
                                    smartphones. Mas já existe sistemas de Alerta de Preço.</p>
                                <p>Sim, existe, mas não por especificações técnicas. Ao invés de focarmos em produtos,
                                    focamos
                                    nas suas necessidades técnicas. Isso deixa muito mais abrangente a sua
                                    procura pelo com oportunidade de vocês encontrarem o que realmente
                                    necessitam.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="panel mkt-panel">
                            <div className="panel-body text-center">
                                <h1>Como funciona?</h1>
                                <p>Você cadastra suas necessidades, exemplo: Celular com 32GB de RAM e câmera de
                                    12MP,
                                    por no máximo R$ 1.200,00.</p>
                                <p>A gente te notifica por email assim que encontrarmos <b>qualquer</b> produto que
                                    atinja suas necessidade no preço alvo ou abaixo.
                                    Mas lembre-se, pode ser que a gente encontre
                                    também
                                    um produto <i><b>MELHOR </b></i>
                                    do que vocês estavam esperando.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="panel mkt-panel">
                            <div className="panel-body text-center">
                                <h1>Utilizamos a API do Buscapé!</h1>
                                <p>A gente utiliza a API do Buscapé,
                                    uma das empresas mais confiáveis no mercado, com credibilidade.</p>
                                <p>Todos os dias meia noite, a gente procura pelas ofertas do Buscapé, verifica
                                    se o produto atende suas necessidade, com o preço igual ou menor ao
                                    desejado. E claro, a gente te avisa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        return (
            <div className="container">
                {home}
            </div>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        messages: state.messages,
        token: state.auth.token
    };
};

export default connect(mapStateToProps)(Home);
