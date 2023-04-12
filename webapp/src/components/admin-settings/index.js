import {connect} from 'react-redux';

import PropTypes from 'prop-types';

import AdminSetting from './admin-settings';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
    };
}

export default connect(mapStateToProps)(AdminSetting);