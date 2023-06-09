export interface PluginRegistry {
    registerPostTypeComponent(typeName: string, component: React.ElementType)

    // Add more if needed from https://developers.mattermost.com/extend/plugins/webapp/reference

    registerChannelHeaderButtonAction(icon: any, action: any, dropdownText: string, tooltipText: string)

    registerAdminConsoleCustomSetting(key: string, component: any, options?: any)

    registerPostDropdownMenuComponent(component: React.ElementType)
}
