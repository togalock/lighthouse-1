let ServerConnectScreen = {
  screen_name: "ServerConnect",
  template_name: "ServerConnect.html",
  rendered: false,

  el: {

  },

  globals: {
    SERVER_ADDR: "ws://localhost:5501",
    RETRY_ATTEMPTS: 3,

    WS: undefined,
    ws_connect: undefined,
  },

  listeners: {
    on_ws_open: undefined,
    on_ws_error: undefined,
  },

  attachers: {
    on_ws_connect: undefined,
    on_ws_error: null,
  },

  renderers: {
    
  },

  renders: {
    target_div: undefined,
    target_app: undefined,
    target_overlay_div: undefined,
    target_overlay: undefined,
    renderTo: undefined,
    unrender: undefined,
  },
};

// Globals
ServerConnectScreen.globals.ws_connect = function() {
  ServerConnectScreen.globals.WS = new WebSocket(ServerConnectScreen.globals.SERVER_ADDR);
  ServerConnectScreen.globals.WS.onopen = ServerConnectScreen.listeners.on_ws_open;
  ServerConnectScreen.globals.WS.onerror = ServerConnectScreen.listeners.on_ws_error;
}

// Listeners
ServerConnectScreen.listeners.on_ws_open = function() {
  let action = {
    action: "WS_CONNECTED",
    ws: ServerConnectScreen.globals.WS,
  }
  HANDLER.push_action(action);
}

ServerConnectScreen.listeners.on_ws_error = function() {
  ServerConnectScreen.globals.RETRY_ATTEMPTS -= 1;
  if (ServerConnectScreen.globals.RETRY_ATTEMPTS < 0) {
    ServerConnectScreen.renders.target_overlay_div.appendChild(GEBC(
      `<div class="box has-background-danger">Connection to Server Failed, Check Server or Config.</div>`));
  }
  else {
    ServerConnectScreen.globals.ws_connect();
  }
}

// Renderers


// Final Renders
ServerConnectScreen.renders.renderTo = async function(app_target = null, overlay_target = null) {
  this.target_div = app_target;
  this.target_overlay_div = overlay_target;
  
  let template = await fetch(ServerConnectScreen.template_name).then(response => response.text()).then(htmlString => GEBC(htmlString));

  this.target_app = template.querySelector(".app_target");

  if (this.target_app != null) {
    this.target_div.appendChild(this.target_app);
  }

  this.target_overlay = template.querySelector(".overlay_target");
  if (this.target_overlay != null) {
    this.target_overlay_div.appendChild(this.target_overlay);
  }

  // Object.assign(ServerConnectScreen.el, GEBIS(ServerConnectScreen.el.__query));

  // Component Specific Renders
  ServerConnectScreen.globals.ws_connect();

  ServerConnectScreen.rendered = true;
  return ServerConnectScreen;
}

ServerConnectScreen.renders.unrender = function() {
  if (this.target_app != null) {
    this.target_app.remove();
  }

  if (this.target_overlay != null) {
    this.target_overlay.remove();
  }

  // Component Specific Unrenders

  ServerConnectScreen.rendered = false;
}