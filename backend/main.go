package main

import (
	"log"
	"net/http"
	"os"
	"github.com/TutorialEdge/realtime-chat-go-react/pkg/websocket"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
)

var logger *log.Logger = log.New(os.Stdout, "Main: ", 0)
var pool *websocket.Pool = websocket.NewPool()

func serveRoomConnection(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	logger.Println("WebSocket endpoint hit")

	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		logger.Printf("%+V\n", err)
	}
	
	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	logger.Println("Created client address: ", client)

	pool.Register <- client
	client.Read()
}

func setupRoutes(router *httprouter.Router) {
	logger.Println("setuproutes")
	router.GET("/websocket", serveRoomConnection)
}

func main() {
	logger.Println("Chat App started")
	go pool.Start()
	router := httprouter.New()
	handler := cors.Default().Handler(router)
	setupRoutes(router)
	logger.Println("yep")
	http.ListenAndServe(":8080", handler)
}