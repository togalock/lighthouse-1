#!/usr/bin/env python

# WS client example

import asyncio
import websockets

async def hello():
    uri = "ws://pathserver.tomnotch.top:8765"
    async with websockets.connect(uri) as websocket:
        nodeID = input("What's your nodeID? ")

        await websocket.send(nodeID)
        print(f">>> {nodeID}")

        greeting = await websocket.recv()
        print(f"<<< {greeting}")

asyncio.run(hello())