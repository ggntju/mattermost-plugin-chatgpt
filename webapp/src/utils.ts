import {Client4} from 'mattermost-redux/client';
import {ClientError} from 'mattermost-redux/client/client4';
import {Options} from 'mattermost-redux/types/client4';
import * as fs from 'fs';

export interface Iadmin_data {
    SECRET_KEY: string,
    PROXY_URL: string,
    WEBSITE_URL: string,
}

const doFetch = async (url: string, options: any) => {
    const {data} = await doFetchWithResponse(url, options);

    return data;
};

const doFetchWithResponse = async (url: string, options: {}) => {
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

function getServerAddress() {
    return Client4.getUrl();
}

async function getThreadRootID(postID: string) {
    const server_address = getServerAddress();
    const url = server_address + '/api/v4/posts/' + postID + '/thread';
    const options = {
        method: 'get'
    };
    const response = await doFetch(url, Client4.getOptions(options));
    return response['posts'][response['order'][0]]['root_id'];
}

export async function replyPost(channelID: string, postID: string, content: string) {
    const server_address = getServerAddress();
    const url = server_address + '/api/v4/posts';
    const thread_root_id = await getThreadRootID(postID);
    const options: Options = {
        method: 'post',
        body: {
            channel_id: channelID,
            message: content,
            root_id: thread_root_id == "" ? postID: thread_root_id
        }    
    };

    const response = await doFetch(url, {
        method: 'post',
        body: JSON.stringify(options['body'])
    });

    return response; 
}

export async function getPostContent(postID: string) {
    const server_address = getServerAddress();
    const url = server_address + '/api/v4/posts/' + postID;
    const response = await doFetch(url, {});
    return response;
}

export async function getPromptResponse(key: string, prompt: string, base_url: string) {
    const requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + key,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 2048
        })
    };

    const res = await fetch(base_url + "/v1/chat/completions", requestOptions)
    .then(response => response.text())
    .then(result => {
        return JSON.parse(result);
    })
    .catch(err => {
        console.log('error', err);
        throw err;
    });
    
    return res;
}

export function handleSaveAdminDataToServer(jsonData: {}) {
    
}

export async function handleReadAdminDataFromServer() {
    return {
        SECRET_KEY: "",
        PROXY_URL: "",
        WEBSITE_URL: ""
    }
}