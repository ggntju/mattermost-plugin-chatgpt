import React from 'react';

import PropTypes from 'prop-types';

import OpenAIIcon from '../icon';

import {getPostContent} from '../../utils';

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

    handleClick = async (e) => {
        e.preventDefault();
        let postID = this.props.postId;
        const content = await getPostContent(postID);
        const postMessage = content.message;
        console.log(postMessage);
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

