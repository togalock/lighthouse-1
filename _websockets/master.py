#!/usr/bin/env python


import asyncio
import websockets
import json
import 

connecting_slaves = dict()
used_pathID = list()
def assing_pathID():
    r

async def proccess_request(instruction):
    return dict()

async def add_slave(websocket, content):
    nodeID = content["NODE_ID"]
    print(f"<<< {nodeID}")
    connecting_slaves[nodeID] = websocket
    greeting = f"Connected to {nodeID}!"
    await websocket.send(greeting)
    print(f">>> {greeting}")

async def serve_client(websocket,content):
    clientID = content["CLIENT_ID"]
    print("Receivede request from "+ clientID)
    result = await proccess_request(content["DETAILS"])

    
async def router(websocket,path):
    request = await websocket.recv()
    request_dict = jsonindex.loads()
    if (request_dict["header"] == "SLAVE"):
        add_slave(websocket,request_dict["HEADER"])
    elif (request_dict["header"] == "CLIENT"):
        serve_client(websocket,request_dict["HEADER"])
    else:
        pass

async def main(): 
    async with websockets.serve(add_slave, port =8765): 
        await asyncio.Future()  # run forever

asyncio.run(main())