import React from 'react';

import PropTypes from 'prop-types';

import {Svgs} from '../../constants';

import OpenAIIcon from '../icon';

export default class AskChatGPT extends React.PureComponent {

    static propTypes = {
        isSystemMessage: PropTypes.bool.isRequired,
        locale: PropTypes.string,
        open: PropTypes.func.isRequired,
        postId: PropTypes.string,
        userConnected: PropTypes.bool.isRequired,
        userCanConnect: PropTypes.bool.isRequired,
        installedInstances: PropTypes.array.isRequired,
        handleConnectFlow: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    handleClick = (e) => {
        e.preventDefault();
        let postID = this.props.postID;
    };

    render() {

        let content = null;

        content = (
            <button
                className='style--none'
                role='menuitem'
                onClick={this.handleClick}
            >
                <OpenAIIcon type='menu'/>
                    {'Ask ChatGPT'}
            </button>
        );

        return (
            <React.Fragment>
                <li
                    className='MenuItem'
                    role='menuitem'
                >
                    {content}
                </li>
            </React.Fragment>
        );
    }
};

