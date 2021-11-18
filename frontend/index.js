function createNode(html_string) {
  let div = document.createElement("div");
  div.innerHTML = html_string.trim();
  return div.firstChild;
}


let DIV_MAIN = document.getElementById("main");
let DIV_OVERLAY = document.getElementById("ui-overlay");

let DIV_FROM_ROW = document.getElementById("from_row");
let DIV_FROM_LABEL = document.getElementById("from_label");
let DIV_TO_ROW = document.getElementById("to_row");
let DIV_TO_LABEL = document.getElementById("to_label");

let BUTTONS_TEXT = document.getElementById("buttons_text");
let GO_BUTTON = document.getElementById("button_go");
let ATTACH_BUTTON = document.getElementById("button_attach");

let INPUT_MENU = document.getElementById("input_menu");
let COMPLETE_QUERY = document.getElementById("input_1");
let COMPLETE_LIST = document.getElementById("complete_list");

let NODES = {
  "A1371": "Node A1371",
  "A1372": "Node A1372",
  "A1373": "Node A1373",
}

let pass = undefined;

function background_light(div, level = 1) {
  let base_color = null;
  for (let css of div.classList.values()) {
    if (css.startsWith("has-background-")) {
      base_color = css;
      break;
    }
  }
  base_color_tokens = base_color.split("-");
  
  if (["dark", "light"].includes(base_color_tokens[base_color_tokens.length - 1])) {
    base_color_tokens.pop();
  }

  if (level == 0) {
    base_color_tokens.push("dark");
  }

  if (level == 2) {
    base_color_tokens.push("light");
  }

  new_color_class = base_color_tokens.join("-");

  if (base_color) {
    div.classList.remove(base_color);
    div.classList.add(new_color_class);
  }
}

let input_target = "FROM";
let inputs = {
  "FROM": null,
  "TO": null,
};

function change_input_target(target = "FROM") {
  background_light(DIV_FROM_ROW, (target == "FROM") ? 1 : 2);
  background_light(DIV_TO_ROW, (target == "TO") ? 1 : 2);
  input_target = target;
  COMPLETE_LIST.innerHTML = "";
  COMPLETE_QUERY.value = "";

  if (!!input_target) {
    INPUT_MENU.classList.remove("is-hidden");
  }
  else {
    INPUT_MENU.classList.add("is-hidden");
  }

  if (input_target == "FROM") {
    COMPLETE_QUERY.placeholder = "Where are you now?";
  }
  else if (input_target == "TO") {
    COMPLETE_QUERY.placeholder = "Where do you want to go?";
  }
  else if (input_target == "SESSION") {
    COMPLETE_QUERY.placeholder = "Enter your Callsign";
  }
  else {
    pass;
  }
}

DIV_FROM_ROW.addEventListener("click", () => change_input_target("FROM"));
DIV_TO_ROW.addEventListener("click", () => change_input_target("TO"));

function query_nodes(query_string, nodes_list = NODES) {
  let query_output = {};
  for (let [node_id, node_details] of Object.entries(nodes_list)) {
    if (node_id.toLowerCase().includes(query_string.toLowerCase()) || 
    node_details.toLowerCase().includes(query_string.toLowerCase())) {
      query_output[node_id] = node_details;
    }
  }

  return query_output;
}

function on_complete_select(data) {
  inputs[input_target] = data;

  if (input_target == "FROM") {
    DIV_FROM_LABEL.innerHTML = Object.values(data)[0];
    change_input_target("TO");
  }

  else if (input_target == "TO") {
    DIV_TO_LABEL.innerHTML = Object.values(data)[0];
    change_input_target(null);
  }

  else {
    pass;
  }

  if (!!inputs["FROM"] && !!inputs["TO"]) {
    BUTTONS_TEXT.innerHTML = "Ready? Press "
    GO_BUTTON.classList.remove("is-hidden");
    ATTACH_BUTTON.classList.add("is-hidden");
  }
  else {
    BUTTONS_TEXT.innerHTML = "Already Assigned? "
    GO_BUTTON.classList.add("is-hidden");
    ATTACH_BUTTON.classList.remove("is-hidden");
  }
}

function generate_item(node) {
  let [node_id, description] = Object.entries(node)[0];
  anchor = createNode(`<a>${description}</a>`);
  anchor.addEventListener("click", () => on_complete_select(node));
  list_item = createNode(`<li></li>`);
  list_item.appendChild(anchor);
  
  return list_item;
}

function on_complete_input(event) {
  if (["FROM", "TO"].includes(input_target)) {
    COMPLETE_LIST.innerHTML = "";
    nodes_available = query_nodes(event.target.value);
    for (let [node_id, node_details] of Object.entries(nodes_available)) {
      node = {};
      node[node_id] = node_details;
      COMPLETE_LIST.appendChild(generate_item(node));
    }
  }
}

COMPLETE_QUERY.addEventListener("input", on_complete_input);

GO_BUTTON.addEventListener("click", () => console.log(inputs));

ATTACH_BUTTON.addEventListener("click", () => {
  if (!!COMPLETE_QUERY.value) {
    console.log(COMPLETE_QUERY.value);    
  }
  else {
    change_input_target("SESSION");
  }
})