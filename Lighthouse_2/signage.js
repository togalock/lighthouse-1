const SERVER_ADDR = "ws://localhost:5501";
let WS = undefined;

const CLIENT_ADDR = "";

const DISPLAY_ID = _GET()["nid"];
const DISPLAY_NAME = _GET()["name"];

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

const el = GEBIS({
  "overlay": "app-overlay",
  "routes": "routes",
  "display_id": "display_id",
  "display_name": "display_name",
  "client_qr": "client_qr",
});

const CLIENT_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${CLIENT_ADDR}?from=${DISPLAY_ID}`;


// Routes
let ROUTES = {};

function route_renders(symbol, cid, color) {
  let renders = {
    background_box: GEBC(`<div class="is-block has-background-${bulma_color(color)}"></div>`),
    symbol: undefined,
    cid: undefined,

    target_div: null,
    renderTo: undefined,
    unrender: undefined,
  };

  renders.symbol = CO(renders.background_box, GEBC(`<i class="is-size-2 fas fa-${symbol}"></i>`));
  renders.cid = CO(renders.background_box, GEBC(`<span class="is-size-2 mx-2 font_j">${cid}</span>`));

  renders.renderTo = function(target_div) {
    this.target_div = target_div;
    target_div.appendChild(this.background_box);
  }

  renders.unrender = function() {
    this.background_box.remove();
    this.target_div = null;
  }

  return renders;
}

function unrender_route(cid) {
  if (ROUTES[cid] == undefined) {
    return false;
  }
  ROUTES[cid].unrender();
  delete ROUTES[cid];
}

function render_route(symbol, cid, color, timeout = 30 * MINUTES) {
  ROUTES[cid] = route_renders(symbol, cid, color);
  ROUTES[cid].renderTo(el["routes"]);
  setTimeout(() => unrender_route(cid), timeout);
}

// Server Handling
let RETRIES_REMAINING = 3;

function on_ws_error() {
  RETRIES_REMAINING -= 1;
  if (RETRIES_REMAINING > 0) {
    ws_connect();
  }
  else {
    el["overlay"].innerHTML = `<div class="box has-background-danger">Connection to Server Failed, Check Server or Config.</div>`;
  }
}

function on_ws_message(message) {
  try {
    let data = JP(message.data);
  }
  catch (SyntaxError) {
    return false;
  }

  if (data["to"] == DISPLAY_ID && data["action"] == "SET_ROUTE") {
    let symbol = data["request"]["symbol"];
    if (symbol != undefined) {
      render_route(symbol, data["request"]["cid"], data["request"]["color"]);
    }
  }

  if (data["to"] == DISPLAY_ID && data["action"] == "UNSET_ROUTE") {
    unrender_route(data["request"]["cid"]);
  }
}

function ws_connect(uri = SERVER_ADDR) {
  WS = new WebSocket(uri);
  WS.onerror = on_ws_error;
  WS.onmessage = on_ws_message;
}

function on_load() {
  el["display_name"].innerHTML = DISPLAY_NAME;
  el["display_id"].innerHTML = DISPLAY_ID;
  el["client_qr"].src = CLIENT_QR_URL;

  ws_connect();
}

document.addEventListener("DOMContentLoaded", on_load);