package websocket

import (
	"log"
	"github.com/gorilla/websocket"
	"encoding/json"
	"os"
)

var clientLogger *log.Logger = log.New(os.Stdout, "Client: ", 0)

// Client defines a concurrent client and its connection to the websocket server
type Client struct {
	Conn *websocket.Conn
	Pool *Pool
}

// Message defines a message that passes through the WS server from the client
type Message struct {
	Username string	`json:"username"`
	Body     string `json:"body"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		
		var message Message
		json.Unmarshal(p, &message)
		clientLogger.Printf("Message received: %+v\n", message)
		c.Pool.Broadcast <- message
	}
}