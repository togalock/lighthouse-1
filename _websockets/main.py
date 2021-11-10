#!/usr/bin/env python


import asyncio
import websockets

connecting_slaves = dict()

async def add_slave(websocket, path):
    nodeID = await websocket.recv()
    print(f"<<< {nodeID}")
    connecting_slaves[nodeID] = websocket
    greeting = f"Connected to {nodeID}!"

    await websocket.send(greeting)
    print(f">>> {greeting}")


async def main(): 
    async with websockets.serve(add_slave, port =8765): 
        await asyncio.Future()  # run forever

asyncio.run(main())