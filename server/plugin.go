package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

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

// See https://developers.mattermost.com/extend/plugins/server/reference/
