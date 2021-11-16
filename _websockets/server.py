#!/usr/bin/env python


import asyncio
import websockets

connecting_slaves = dict()

async def proccess_request(instruction):
    return instruction

async def add_slave(websocket, path):
    nodeID = await websocket.recv()
    print(f"<<< {nodeID}")
    connecting_slaves[nodeID] = websocket
    greeting = f"Connected to {nodeID}!"

    await websocket.send(greeting)
    print(f">>> {greeting}")

async def serve_client(websocket,path):
    clientID = path
    instruction = await websocket.recv()
    print("Receivede request from"+path)   
    i = await proccess_request()
    
async def main(): 
    async with websockets.serve(add_slave, port =8766): 
        await asyncio.Future()  # run forever

asyncio.run(main())