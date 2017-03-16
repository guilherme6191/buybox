import React from 'react';
import AlertList from './AlertList'
import SideBar from './SideBar'

class UserHome extends React.Component {
    render() {
        return (
            <div className="container user-home">
                <div id="userHome" className="row">
                    <SideBar />
                    <AlertList />
                </div>
            </div>
        );
    }
}

export default UserHome

