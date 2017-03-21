import React from 'react';
import { connect } from 'react-redux';

import {getSuggestions} from '../actions';

import SuggestionItem from './SuggestionItem';

class SuggestionList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (!this.props.token) {
            return;
        }
        this.props.dispatch(getSuggestions(this.props.token, this.props.user._id));
    }

    render() {
        const suggestions = this.props.ready ?
            this.props.suggestions && this.props.suggestions.length > 0 ?
                this.props.suggestions.map((item) =>
                    <SuggestionItem key={item._id} {...item}/>
                ) : <label>Não há sugestões para você ainda, aguarde.</label>
            : '';

        return (
            <div className="container suggestions-container">
                <h4>Sugestões:</h4>
                <small>
                    Sugestões criadas baseadas nos seus Alertas!
                </small>
                <ul className="list-group grid">
                    {suggestions}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
        suggestions: state.suggestion.suggestions,
        ready: state.suggestion.ready
    }
};

export default connect(mapStateToProps)(SuggestionList)
