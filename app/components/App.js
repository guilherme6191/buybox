import React from 'react';
import Header from './Header';
import Footer from './Footer';

class App extends React.Component {
    constructor(props) {
        super(props);

        if (!("Notification" in window)) {
            console.log("[NOTE]:This browser does not support desktop notification.");
        }
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                console.log("[NOTE]:User granted permission for desktop notification.")
            });
        } else if (Notification.permission !== "denied") {
            console.log("[NOTE]: User has already granted permission for desktop notification.")
        }
    }

    render() {
        return (
            <div>
                <Header/>
                {this.props.children}
                <Footer/>
            </div>
        );
    }
}

export default App;
