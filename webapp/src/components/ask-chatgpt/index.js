import {connect} from 'react-redux';

import PropTypes from 'prop-types';

import AskChatGPT from './ask-chatgpt-postdropdown';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
    };
}

export default connect(mapStateToProps)(AskChatGPT);