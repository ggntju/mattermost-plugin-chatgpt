import {connect} from 'react-redux';

import PropTypes from 'prop-types';

import ChannelHeaderIcon from './channel-header-icon';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
    };
}

export default connect(mapStateToProps)(ChannelHeaderIcon);