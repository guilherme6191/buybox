import React from 'react';

import AlertList from './AlertList'
import SideBar from './SideBar'
import SuggestionList from '../Alert-Suggestion/Components/SuggestionList';


class UserHome extends React.Component {
  render() {
    return (
      <div className="container user-home">
        <div id="userHome" className="row">
          <SideBar />
          <AlertList />
          <SuggestionList />
        </div>
      </div>
    );
  }
}

export default UserHome

