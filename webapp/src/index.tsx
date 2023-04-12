import React from 'react';

import {Client4} from 'mattermost-redux/client'

import {Store, Action} from 'redux';

import {GlobalState} from '@mattermost/types/lib/store';

import {manifest} from './manifest';

import {PluginRegistry} from '@/types/mattermost-webapp';

import ChannelHeaderIcon from './components/channel-header-icon/channel-header-icon';

import AdminSetting from './components/admin-settings/admin-settings';

import AskChatGPT from './components/ask-chatgpt/ask-chatgpt-postdropdown';

import {handleReadAdminDataFromServer} from './utils';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        
        Client4.setUrl('' + store.getState().entities.general.config.SiteURL);

        const ChannelHeaderAction = async () => {
            // const admin_data = await handleReadAdminDataFromServer();
            window.open("https://openai.com/");
        }

        registry.registerChannelHeaderButtonAction(
            <ChannelHeaderIcon/>,
            ChannelHeaderAction,
            'Chatgpt',
            'Chatgpt'
        )

        registry.registerAdminConsoleCustomSetting('AdminSetting', AdminSetting, {showTitle: true})

        // registry.registerPostDropdownMenuComponent(AskChatGPT)
        
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin(manifest.id, new Plugin());
