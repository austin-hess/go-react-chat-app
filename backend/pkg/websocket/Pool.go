package websocket

import (
	"fmt"
	"log"
	"os"
)

var poolLogger *log.Logger = log.New(os.Stdout, "Pool: ", 0)

var rooms map[int][]*Client = make(map[int][]*Client)
var roomCounter int = 0

// Pool represents a pool of related Clients
type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

// NewPool instantiates a new Pool instance
func NewPool() *Pool {
	return &Pool{
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
				poolLogger.Println("Registed client address: ", client)
				pool.Clients[client] = true
				poolLogger.Printf("Size of connection for pool: %v\n", len(pool.Clients))
				for client := range pool.Clients {
					client.Conn.WriteJSON(Message{Body: "New user joined"})
				}
			case client := <-pool.Unregister:
				poolLogger.Println("Unregistered client address: ", client)
				delete(pool.Clients, client)
				fmt.Printf("Size of connection for pool: %v\n", len(pool.Clients))
				for client := range pool.Clients {
					client.Conn.WriteJSON(Message{Body: "User disconnected"})
				}
			case message := <-pool.Broadcast:
				poolLogger.Println("Sending message to all clients")
				for client := range pool.Clients {
					if err := client.Conn.WriteJSON(message); err != nil {
						fmt.Println(err)
						return
					}
				}
		}
	}
}