// Object
let SelectPointsScreen = {
  screen_name: "SelectPoints",
  template_name: "SelectPoints.html",
  rendered: false,

  el: {
    __query: PIQ("SelectPoints", 
      ["from_block", "from_label", "to_block", "to_label",
      "menu_block", "room_query", "room_query_results", 
      "button_block", "go_button"]),
  },

  globals: {
    TARGETS: {
      cursor: "from_room",
      "from_room": null,
      "to_room": null,
    },

    ROOMS: undefined,
    
    query_rooms: undefined,
  },

  listeners: {
    on_target_cursor_change: undefined,
    on_target_change: undefined,
    on_query_result_click: undefined,
    on_room_query_input: undefined,
    on_button_go: undefined,
    on_initial_point_set: undefined,
  },

  attachers: {
    on_target_cursor_change: {
      attach: undefined,
      // detach: undefined,
    },
    on_target_change: null,
    on_query_result_click: null,
    on_room_query_input: {
      attach: undefined,
      // detach: undefined,
    },
    on_button_go: {
      attach: undefined,
      // detach: undefined,
    },
    on_initial_point_set: null,
  },

  renderers: {
    query_list_renders: {
      target_div: undefined,
      renderTo: undefined,
      unrender: undefined,
      rerender: undefined,
    },
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
SelectPointsScreen.globals.query_rooms = function(query, rooms) {
  let res = [];

  for (let room of rooms) {
    if (room["node"].includes(query) || room["name"].includes(query)) {
      res.push(room);
    }
  }

  return res;
}

// Listeners and Attachers
SelectPointsScreen.listeners.on_target_cursor_change = function(new_target) {
  SelectPointsScreen.globals.TARGETS.cursor = new_target;
  
  if (["from_room", "to_room"].includes(SelectPointsScreen.globals.TARGETS.cursor)) {
    SelectPointsScreen.el["menu_block"].classList.remove("is-hidden");
  }
  else {
    SelectPointsScreen.el["menu_block"].classList.add("is-hidden");
  }

  bulma_bg_dim(SelectPointsScreen.el["from_block"], (new_target == "from_room") ? 1 : 2);
  bulma_bg_dim(SelectPointsScreen.el["to_block"], (new_target == "to_room") ? 1 : 2);
}

SelectPointsScreen.attachers.on_target_cursor_change.attach = function() {
  SelectPointsScreen.el["from_block"].addEventListener("click", () => SelectPointsScreen.listeners.on_target_cursor_change("from_room"));
  SelectPointsScreen.el["to_block"].addEventListener("click", () => SelectPointsScreen.listeners.on_target_cursor_change("to_room"));
}


SelectPointsScreen.listeners.on_target_change = function() {
  SelectPointsScreen.el["room_query"].value = '';
  
  if (SelectPointsScreen.globals.TARGETS["from_room"] != null) {
    SelectPointsScreen.el["from_label"].innerHTML = SelectPointsScreen.globals.TARGETS["from_room"]["name"];
  }

  if (SelectPointsScreen.globals.TARGETS["to_room"] != null) {
    SelectPointsScreen.el["to_label"].innerHTML = SelectPointsScreen.globals.TARGETS["to_room"]["name"];
  }

  if (SelectPointsScreen.globals.TARGETS["from_room"] != null && SelectPointsScreen.globals.TARGETS["to_room"] != null) {
    SelectPointsScreen.el["button_block"].classList.remove("is-hidden");
  }
  else {
    SelectPointsScreen.el["button_block"].classList.add("is-hidden");
  }
}

SelectPointsScreen.listeners.on_query_result_click = function(room) {
  SelectPointsScreen.globals.TARGETS[SelectPointsScreen.globals.TARGETS.cursor] = room;

  switch (SelectPointsScreen.globals.TARGETS.cursor) {
    case "from_room":
      SelectPointsScreen.listeners.on_target_cursor_change("to_room");
      break;
    case "to_room":
      SelectPointsScreen.listeners.on_target_cursor_change(null);
      break;
    default:
      SelectPointsScreen.listeners.on_target_cursor_change("from_room");
      break;
  }

  SelectPointsScreen.listeners.on_target_change();
}

SelectPointsScreen.listeners.on_room_query_input = function(inputEvent) {
  let result_rooms = SelectPointsScreen.globals.query_rooms(inputEvent.data, SelectPointsScreen.globals.ROOMS);
  SelectPointsScreen.renderers.query_list_renders.rerender(result_rooms);
}

SelectPointsScreen.attachers.on_room_query_input.attach = function() {
  SelectPointsScreen.el["room_query"].addEventListener("input", SelectPointsScreen.listeners.on_room_query_input);
}

SelectPointsScreen.listeners.on_button_go = function() {
  let action = {
    action: "REQUEST_ROUTE",
    from_node: SelectPointsScreen.globals.TARGETS.from_room,
    to_node: SelectPointsScreen.globals.TARGETS.to_room,
  };

  HANDLER.push_action(action);
}

SelectPointsScreen.attachers.on_button_go.attach = function() {
  SelectPointsScreen.el["go_button"].addEventListener("click", SelectPointsScreen.listeners.on_button_go);
}

SelectPointsScreen.listeners.on_initial_point_set = function(initial_nid) {
  let target_room = null;
  let target_rooms = SelectPointsScreen.globals.query_rooms(initial_nid, SelectPointsScreen.globals.ROOMS);
  if (target_rooms.length > 0) {
    SelectPointsScreen.listeners.on_query_result_click(target_rooms[0]);
  }
}

// Renderers
SelectPointsScreen.renderers.query_list_renders.renderTo = function(target_div) {
  this.target_div = target_div;
}

SelectPointsScreen.renderers.query_list_renders.unrender = function() {
  this.target_div.innerHTML = '';
  this.target_div = null;
}

SelectPointsScreen.renderers.query_list_renders.rerender = function(result_rooms) {
  if (this.target_div == null) {
    return false;
  }

  this.target_div.innerHTML = '';

  for (let room of result_rooms) {
    let anchor = GEBC(`<li><a>${room["name"]}</a></li>`);
    anchor.addEventListener("click", () => SelectPointsScreen.listeners.on_query_result_click(room));
    this.target_div.appendChild(anchor);
  }
}

SelectPointsScreen.renders.renderTo = async function(app_target = null, overlay_target = null) {
  this.target_div = app_target;
  this.target_overlay_div = overlay_target;
  
  let template = await fetch(SelectPointsScreen.template_name).then(response => response.text()).then(htmlString => GEBC(htmlString));

  this.target_app = template.querySelector(".app_target");

  if (this.target_app != null) {
    this.target_div.appendChild(this.target_app);
  }

  this.target_overlay = template.querySelector(".overlay_target");
  if (this.target_overlay != null) {
    this.target_overlay_div.appendChild(this.target_overlay);
  }

  Object.assign(SelectPointsScreen.el, GEBIS(SelectPointsScreen.el.__query));

  // Component Specific Renders
  SelectPointsScreen.renderers.query_list_renders.renderTo(SelectPointsScreen.el["room_query_results"]);
  SelectPointsScreen.attachers.on_target_cursor_change.attach();
  SelectPointsScreen.attachers.on_room_query_input.attach();
  SelectPointsScreen.attachers.on_button_go.attach();

  SelectPointsScreen.globals.ROOMS = await fetch("nodes.json").then(response => response.json());

  if (_GET()["from"] != undefined) {
    SelectPointsScreen.listeners.on_initial_point_set(_GET()["from"]);
  }

  SelectPointsScreen.rendered = true;
  return SelectPointsScreen;
}

SelectPointsScreen.renders.unrender = function() {
  if (this.target_app != null) {
    this.target_app.remove();
  }

  if (this.target_overlay != null) {
    this.target_overlay.remove();
  }

  SelectPointsScreen.rendered = false;
}