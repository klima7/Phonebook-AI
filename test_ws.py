import asyncio
import websockets

async def connect_and_listen():
    uri = "ws://localhost:80/api/ws/contacts/"
    subprotocols = ["token.af7c08f387023d97bc9ee83783ae1a8b2786b482"]
    
    async with websockets.connect(uri, subprotocols=subprotocols) as websocket:
        print(f"Connected to {uri}")
        
        while True:
            message = await websocket.recv()
            print(f"Received message: {message}")


if __name__ == "__main__":
    try:
        asyncio.run(connect_and_listen())
    except KeyboardInterrupt:
        print("\nConnection closed by user")
