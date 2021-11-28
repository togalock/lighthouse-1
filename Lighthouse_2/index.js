let HANDLER = {
  globals: {
    cid: random_string(3),
    color: random_element(1, ["red", "yellow", "green", "purple"])[0],
    ws: null,
  },

  DIV_APP: GEBI("app"),
  DIV_OVERLAY: GEBI("app-overlay"),

  active_screen: null,
  push_screen: null,
  push_action: null,
}

HANDLER.push_screen = async function(screen) {
  if (this.active_screen != null) {
    this.active_screen.renders.unrender();
  }
  this.active_screen = null;

  if (screen != null) {
    await screen.renders.renderTo(this.DIV_APP, this.DIV_OVERLAY);
    if (screen.rendered) {
      this.active_screen = screen;
    }
  }

  return this.active_screen;
}

HANDLER.push_action = async function(action) {
  console.log("HANDLER: Push Action", action);

  if (action["action"] == "WS_CONNECTED") {
    HANDLER.globals.ws = action.ws;
    HANDLER.globals.ws.onmessage = (message) => (HANDLER.push_action(JP(message.data)));
    HANDLER.globals.ws.onclose = () => (HANDLER.push_screen(ServerConnectScreen));
    HANDLER.push_screen(SelectPointsScreen);
  }
  
  if (action["action"] == "REQUEST_ROUTE") {
    let request = {
      "action": "TO_REQUEST_ROUTE",
      "from": HANDLER.globals.cid,
      "request": {
        "from_node": action["from_node"],
        "to_node": action["to_node"],
      }
    }
    HANDLER.globals.ws.send(JC(request));
  }

  if (action["action"] == "ROUTE_SET" && action["to"] == HANDLER.globals.cid) {
    await HANDLER.push_screen(ShowIDScreen);
    HANDLER.active_screen.listeners.on_id_color_assign(HANDLER.globals.cid, HANDLER.globals.color);
  }

}

HANDLER.push_screen(ServerConnectScreen);