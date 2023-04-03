import React from 'react';

import {Svgs} from '../../constants';

export default class ChannelHeaderIcon extends React.PureComponent {
    render() {
        const style = getStyle();
        return (
            <span
                style={style.iconStyle}
                className='icon'
                aria-hidden='true'
                dangerouslySetInnerHTML={{__html: Svgs.OPENAI}}
            />
        );
    }
}

const getStyle = () => {
    return {
        iconStyle: {
            position: 'relative',
            top: '-1px',
        },
    };
};