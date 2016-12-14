import React from 'react';

function trends1() {
    return { __html: '<iframe id="trends-widget-5" src="https://www.google.com/trends/embed/explore/TIMESERIES?req=%7B%22comparisonItem%22%3A%5B%7B%22keyword%22%3A%22Rear%20Camera%22%2C%22geo%22%3A%22%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22Front%20Camera%22%2C%22geo%22%3A%22%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22Mobile%20RAM%22%2C%22geo%22%3A%22%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22Storage%22%2C%22geo%22%3A%22%22%2C%22time%22%3A%22today%2012-m%22%7D%5D%2C%22category%22%3A390%2C%22property%22%3A%22froogle%22%7D&tz=120&eq=cat%3D390%26date%3Dtoday%252012-m%26gprop%3Dfroogle%26q%3DRear%2520Camera%2CFront%2520Camera%2CMobile%2520RAM%2CStorage&hl=ptBR" width="100%" frameborder="0" scrolling="0" style="border-radius: 2px; box-shadow: rgba(0, 0, 0, 0.117647) 0px 0px 2px 0px, rgba(0, 0, 0, 0.239216) 0px 2px 2px 0px; height: 384px;"></iframe>' }
}

function trends2() {
    return { __html: '<iframe id="trends-widget-1" src="https://www.google.com/trends/embed/explore/TIMESERIES?req=%7B%22comparisonItem%22%3A%5B%7B%22keyword%22%3A%22iPhone%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22Samsung%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22Motorola%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22Sony%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22LG%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%5D%2C%22category%22%3A390%2C%22property%22%3A%22froogle%22%7D&tz=120&eq=cat%3D390%26date%3Dtoday%252012-m%26geo%3DBR%26gprop%3Dfroogle%26q%3DiPhone%2CSamsung%2CMotorola%2CSony%2CLG&hl=enUS" width="100%" frameborder="0" scrolling="0" style="border-radius: 2px; box-shadow: rgba(0, 0, 0, 0.117647) 0px 0px 2px 0px, rgba(0, 0, 0, 0.239216) 0px 2px 2px 0px; height: 384px;"></iframe>' }
}

function trends3() {
    return { __html: '<iframe id="trends-widget-2" src="https://www.google.com/trends/embed/explore/TIMESERIES?req=%7B%22comparisonItem%22%3A%5B%7B%22keyword%22%3A%22Sony%20Xperia%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22Samsung%20Galaxy%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22Motorola%20Moto%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22LG%20G%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%2C%7B%22keyword%22%3A%22Asus%20Zenfone%22%2C%22geo%22%3A%22BR%22%2C%22time%22%3A%22today%2012-m%22%7D%5D%2C%22category%22%3A390%2C%22property%22%3A%22%22%7D&amp;tz=120&amp;eq=cat%3D390%26date%3Dtoday%252012-m%26geo%3DBR%26q%3DSony%2520Xperia%2CSamsung%2520Galaxy%2CMotorola%2520Moto%2CLG%2520G%2CAsus%2520Zenfone&amp;hl=enUS" width="100%" frameborder="0" scrolling="0" style="border-radius: 2px; box-shadow: rgba(0, 0, 0, 0.117647) 0px 0px 2px 0px, rgba(0, 0, 0, 0.239216) 0px 2px 2px 0px; height: 384px;"></iframe>' }
}

class Trends extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="panel">
                    <div className="panel-body">
                        <h4>Está sem ideias?
                            <small> Veja estes gráficos com pesquisas no Google para se inspirar.</small>
                        </h4>
                        <br />
                        <div className="text-center">
                            <div dangerouslySetInnerHTML={trends1()}/>
                            <h4>
                                <small>
                                    Pesquisas no último ano, todos países, especificações técnicas na categoria Mobile
                                    Phones.
                                </small>
                            </h4>
                        </div>
                        <br />
                        <div className="text-center">
                            <div dangerouslySetInnerHTML={trends2()}/>
                            <h4>
                                <small>
                                    Pesquisas no último ano, no Brasil, por marcas na categoria Mobile
                                    Phones.
                                </small>
                            </h4>
                        </div>
                        <br />
                        <div className="text-center">
                            <div dangerouslySetInnerHTML={trends3()}/>
                            <h4>
                                <small>
                                    Pesquisas no último ano, no Brasil, por linhas de marcas de celulares.
                                </small>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Trends
