package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/TutorialEdge/realtime-chat-go-react/pkg/websocket"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
)

const (
	// RoomID parameter name from websocket connections
	_RoomID = "roomId"
)

var activeChatRooms int = 0;
var logger *log.Logger = log.New(os.Stdout, "Main: ", 0)
var poolMap map[string]*websocket.Pool = make(map[string]*websocket.Pool)

func serveRoomConnection(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	logger.Println("WebSocket endpoint hit")
	
	roomID := ps.ByName(_RoomID)
	logger.Printf("Room Id (%v): %v", _RoomID, roomID)
	
	pool := poolMap[roomID]
	if pool == nil {
		logger.Fatalf("No room exists for roomID: %v", roomID)
	}

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
	go client.Read()
}

func createRoom(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	logger.Println("Creating new chat room...")

	// Get next room ID
	// create new pool
	// store pool in poolMap
	// return roomId

	activeChatRooms = activeChatRooms + 1
	roomID := fmt.Sprint(activeChatRooms)
	logger.Printf("RoomID: %v", roomID)

	if p := poolMap[roomID]; p != nil {
		logger.Fatalf("RoomID %v already exists", roomID)
	}

	poolMap[roomID] = websocket.NewPool(roomID)
	logger.Printf("Created room: %v", roomID)
	go poolMap[roomID].Start()
	logger.Printf("Started room: %v", roomID)

	_, err := w.Write([]byte(roomID))
	if err != nil {
		logger.Fatal(err)
	}
}

func getRooms(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	logger.Println("Getting all rooms...")

	keys := "{\"roomIds\": ["
	curIdx := 0
	for k := range poolMap {
		keys += fmt.Sprintf("\"%v\"", k)
		if curIdx < len(poolMap) - 1 {
			keys += ","
		}
		curIdx++
	}
	keys += "]}"
	logger.Printf("Got roomIDs: %v", keys)
	w.Write([]byte(keys))
}

func setupRoutes(router *httprouter.Router) {
	//router.GET("/ws", serveAppConnection)
	router.GET("/ws/:roomId", serveRoomConnection)
	router.GET("/chatroom", getRooms);
	router.POST("/chatroom", createRoom);
}

func main() {
	logger.Println("Distributed Chat App v0.01")
	router := httprouter.New()
	handler := cors.Default().Handler(router)
	setupRoutes(router)
	http.ListenAndServe(":8080",handler)
}