package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration
}

type usage_struct struct {
	Prompt_tokens     int `json:"prompt_tokens"`
	Completion_tokens int `json:"completion_tokens"`
	Totel_tokens      int `json:"totel_tokens"`
}

type message_struct struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type choice_struct struct {
	Message       message_struct `json:"message"`
	Finish_reason string         `json:"finish_reason"`
	Index         int            `json:"index"`
}

type respBody struct {
	Id      string          `json:"id"`
	Object  string          `json:"object"`
	Created int             `json:"created"`
	Model   string          `json:"model"`
	Usage   usage_struct    `json:"usage"`
	Choices []choice_struct `json:"choices"`
}

type reqBody struct {
	Model      string            `json:"model"`
	Messages   [1]message_struct `json:"messages"`
	Max_tokens int               `json:"max_tokens"`
}

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {

	switch r.URL.Path {
	case "/configuration-data":
		configuration := p.getConfiguration()
		config_enc, err := json.Marshal(configuration)
		if err != nil {
			// if error is not nil
			// print error
			fmt.Println(err)
		}
		encoded := base64.StdEncoding.EncodeToString([]byte(string(config_enc)))
		fmt.Fprint(w, encoded)
	default:
		http.NotFound(w, r)
	}
}

// MessageHasBeenPosted automatically replies to posts that plea for help.
func (p *Plugin) MessageHasBeenPosted(c *plugin.Context, post *model.Post) {
	configuration := p.getConfiguration()

	// Ignore posts this plugin made.
	if sentByPlugin, _ := post.GetProp("sent_by_plugin").(bool); sentByPlugin {
		return
	}

	// Ignore posts without a plea for help.
	if !strings.Contains(post.Message, "#chatgpt") {
		return
	}

	message_item := &message_struct{
		Role:    "user",
		Content: strings.Replace(post.Message, "#chatgpt", "", 8),
	}

	req_body := &reqBody{
		Model:      "gpt-3.5-turbo",
		Messages:   [1]message_struct{*message_item},
		Max_tokens: 2048,
	}

	client := http.Client{Timeout: time.Duration(120) * time.Second}

	payloadBuf := new(bytes.Buffer)
	err := json.NewEncoder(payloadBuf).Encode(req_body)
	if err != nil {
		p.API.LogError("Encode JSON: " + err.Error())
		p.API.CreatePost(&model.Post{
			ChannelId: post.ChannelId,
			UserId:    configuration.AdminSetting.BOT_USERID,
			Message:   err.Error(),
			Props: map[string]any{
				"sent_by_plugin": true,
			},
		})
		return
	}

	req, err := http.NewRequest("POST", configuration.AdminSetting.PROXY_URL+"/v1/chat/completions", payloadBuf)

	if err != nil {
		p.API.LogError("Create POST Request: " + err.Error())
		p.API.CreatePost(&model.Post{
			ChannelId: post.ChannelId,
			UserId:    configuration.AdminSetting.BOT_USERID,
			Message:   err.Error(),
			Props: map[string]any{
				"sent_by_plugin": true,
			},
		})
		return
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+configuration.AdminSetting.SECRET_KEY)
	req.Header.Add("Connection", "keep-alive")
	req.Header.Add("Accept", "*/*")

	resp, err := client.Do(req)

	if err != nil {
		p.API.LogError("Do POST Request: " + err.Error())
		p.API.CreatePost(&model.Post{
			ChannelId: post.ChannelId,
			UserId:    configuration.AdminSetting.BOT_USERID,
			Message:   err.Error(),
			Props: map[string]any{
				"sent_by_plugin": true,
			},
		})
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		p.API.LogError("HTTP Status Code: " + resp.Status)
		p.API.CreatePost(&model.Post{
			ChannelId: post.ChannelId,
			UserId:    configuration.AdminSetting.BOT_USERID,
			Message:   resp.Status,
			Props: map[string]any{
				"sent_by_plugin": true,
			},
		})
		return
	}

	resp_body := &respBody{}
	derr := json.NewDecoder(resp.Body).Decode(resp_body)
	if derr != nil {
		p.API.LogError("Decoder: " + derr.Error())
		p.API.CreatePost(&model.Post{
			ChannelId: post.ChannelId,
			UserId:    configuration.AdminSetting.BOT_USERID,
			Message:   derr.Error(),
			Props: map[string]any{
				"sent_by_plugin": true,
			},
		})
		return
	}

	p.API.CreatePost(&model.Post{
		ChannelId: post.ChannelId,
		UserId:    configuration.AdminSetting.BOT_USERID,
		Message:   resp_body.Choices[0].Message.Content,
		Props: map[string]any{
			"sent_by_plugin": true,
		},
	})
}

// See https://developers.mattermost.com/extend/plugins/server/reference/
