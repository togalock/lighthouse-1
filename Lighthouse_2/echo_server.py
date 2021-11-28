import asyncio
import websockets

CONNECTIONS = []

async def handler(websocket):
  global CONNECTIONS
  CONNECTIONS.append(websocket)
  try:
    async for message in websocket:
      websockets.broadcast(CONNECTIONS, message)
  except websockets.exceptions.ConnectionClosedError:
    pass
  finally:
    CONNECTIONS.remove(websocket)

async def main():
  async with websockets.serve(handler, "localhost", "5501"):
    await asyncio.Future()

asyncio.run(main())
