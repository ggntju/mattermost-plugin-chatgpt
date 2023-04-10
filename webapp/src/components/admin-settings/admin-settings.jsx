import React from 'react';

import PropTypes from 'prop-types';

import {handleReadAdminDataFromServer, handleSaveAdminDataToServer} from '../../utils';

export default class AdminSetting extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        helpText: PropTypes.node,
        value: PropTypes.any,
        disabled: PropTypes.bool.isRequired,
        config: PropTypes.object.isRequired,
        license: PropTypes.object.isRequired,
        setByEnv: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        registerSaveAction: PropTypes.func.isRequired,
        setSaveNeeded: PropTypes.func.isRequired,
        unRegisterSaveAction: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        const admin_data = handleReadAdminDataFromServer();
        this.state = {
            showSecretMessage: false,
            admin_setting: {
                'SECRET_KEY': admin_data['SECRET_KEY'],
                'PROXY_URL': admin_data['PROXY_URL'] == ''? 'https://api.openai.com': admin_data['PROXY_URL'],
                'WEBSITE_URL': admin_data['WEBSITE_URL'] == ''? 'https://openai.com/': admin_data['WEBSITE_URL'],
            }
        };
    }

    componentDidMount() {
        this.props.registerSaveAction(this.handleSave);
    }

    componentWillUnmount() {
        this.props.unRegisterSaveAction(this.handleSave);
    }

    handleSave = async () => {
        this.setState({
            error: '',
        });

        let error;
        return {error};
    }

    showSecretMessage = () => {
        this.setState({
            showSecretMessage: true,
        });
    }

    toggleSecretMessage = (e) => {
        e.preventDefault();

        this.setState({
            showSecretMessage: !this.state.showSecretMessage,
        });
    }

    handleAPIKeyChange = (e) => {
        let new_admin_setting = this.state.admin_setting;
        new_admin_setting['SECRET_KEY'] = e.target.value;
        this.setState({
            admin_setting: new_admin_setting
        })
        this.props.onChange(this.props.id, new_admin_setting);
        handleSaveAdminDataToServer(new_admin_setting);
    }

    handleProxyURLChange = (e) => {
        let new_admin_setting = this.state.admin_setting;
        new_admin_setting['PROXY_URL'] = e.target.value;
        this.setState({
            admin_setting: new_admin_setting
        })
        this.props.onChange(this.props.id, new_admin_setting);
        handleSaveAdminDataToServer(new_admin_setting);
    }

    handleWebsiteURLChange = (e) => {
        let new_admin_setting = this.state.admin_setting;
        new_admin_setting['WEBSITE_URL'] = e.target.value;
        this.setState({
            admin_setting: new_admin_setting
        })
        this.props.onChange(this.props.id, new_admin_setting);
        handleSaveAdminDataToServer(new_admin_setting);
    }

    render() {
        return (
            <React.Fragment>
                {
                    <div style={style.text}>
                        {'OPENAI Website'}
                    </div>
                }
                {
                    <textarea
                        style={style.input}
                        className='form-control website_input'
                        rows={1}
                        value={this.state.admin_setting['WEBSITE_URL']}
                        disabled={this.props.disabled || this.props.setByEnv}
                        onInput={this.handleWebsiteURLChange}
                    />
                }

                {
                    <div style={style.text}>
                        {'OPENAI API KEY'}
                    </div>
                }
                {this.state.showSecretMessage &&
                    <textarea
                        style={style.input}
                        className='form-control input'
                        rows={1}
                        value={this.state.admin_setting['SECRET_KEY']}
                        disabled={this.props.disabled || this.props.setByEnv}
                        onInput={this.handleAPIKeyChange}
                    />
                }
                <div>
                    <button
                        className='btn btn-default'
                        onClick={this.toggleSecretMessage}
                        disabled={this.props.disabled}
                    >
                        {this.state.showSecretMessage && 'Hide OPENAI API KEY'}
                        {!this.state.showSecretMessage && 'Show OPENAI API KEY'}
                    </button>
                </div>

                {
                    <div style={style.text}>
                        {'OPENAI API PROXY URL'}
                    </div>
                }
                {
                    <textarea
                        style={style.input}
                        className='form-control proxy_input'
                        rows={1}
                        value={this.state.admin_setting['PROXY_URL']}
                        disabled={this.props.disabled || this.props.setByEnv}
                        onInput={this.handleProxyURLChange}
                    />
                }
            </React.Fragment>
        );
    }
}

const style = {
    text: {
        padding: '5px',
        textAlign: 'center',
        fontWeight: '900',
    },
    input: {
        marginBottom: '5px',
    },
};