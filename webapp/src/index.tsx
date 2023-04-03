import React from 'react';

import {Store, Action} from 'redux';

import {GlobalState} from '@mattermost/types/lib/store';

import {manifest} from '@/manifest';

import {PluginRegistry} from '@/types/mattermost-webapp';

import ChannelHeaderIcon from './components/channel-header-icon/channel-header-icon';

import AdminSetting from './components/admin-settings/admin-settings';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        
        const ChannelHeaderAction = () => {
            window.open('https://chatgpt.laser-pulse-comm.top');
        }

        registry.registerChannelHeaderButtonAction(
            <ChannelHeaderIcon/>,
            ChannelHeaderAction,
            'Chatgpt',
            'Chatgpt'
        )

        registry.registerAdminConsoleCustomSetting(
            'AdminSetting',
            AdminSetting,
            {
                showTitle: true
            }
        )
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin(manifest.id, new Plugin());
