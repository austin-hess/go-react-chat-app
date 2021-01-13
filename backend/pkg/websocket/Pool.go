package websocket

import (
	"fmt"
	"log"
	"os"
)

var logger *log.Logger = log.New(os.Stdout, "Pool: ", 0)

// Pool represents a pool of related Clients
type Pool struct {
	ID         string
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

// NewPool instantiates a new Pool instance
func NewPool(ID string) *Pool {
	return &Pool{
		ID:         ID,
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

// Start constantly listens for anything passed to any of the Pool's channels
func (pool *Pool) Start() {
	for {
		select {
			case client := <-pool.Register:
				logger.Println("Registed client address: ", client)
				pool.Clients[client] = true
				fmt.Printf("Size of connection for pool %v: %v\n", pool.ID, len(pool.Clients))
				for client := range pool.Clients {
					client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined..."})
				}
				break
			case client := <-pool.Unregister:
				logger.Println("Unregistered client address: ", client)
				pool.Clients[client] = false
				fmt.Printf("Size of connection for pool %v: %v\n", pool.ID, len(pool.Clients))
				for client := range pool.Clients {
					client.Conn.WriteJSON(Message{Type: 1, Body: "User disconnected..."})
				}
				break
			case message := <-pool.Broadcast:
				logger.Println("Sending message to all clients")
				for client := range pool.Clients {
					if err := client.Conn.WriteJSON(message); err != nil {
						fmt.Println(err)
						return
					}
				}
		}
	}
}