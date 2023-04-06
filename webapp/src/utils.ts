const axios = require('axios').default;
import {Client4} from 'mattermost-redux/client'
import {ClientError} from 'mattermost-redux/client/client4';

const doFetch = async (url: string, options: any) => {
    const {data} = await doFetchWithResponse(url, options);

    return data;
};

const doFetchWithResponse = async (url: string, options = {}) => {
    const response = await fetch(url, Client4.getOptions(options));
    
    let data;
    if (response.ok) {
        data = await response.json();

        return {
            response,
            data,
        };
    }

    data = await response.text();

    throw new ClientError(Client4.url, {
        message: data || '',
        status_code: response.status,
        url,
    });
};

export async function getPostContent(postID: string) {
    const server_address = getServerAddress();
    const url = server_address + '/api/v4/posts/' + postID;
    const response = await doFetch(url, {});
    return response;
}

export function getServerAddress() {
    return Client4.getUrl();
}