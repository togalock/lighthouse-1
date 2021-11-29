// Get Element By ID, Get Element By Creation
let GEBI = (query) => document.getElementById(query);
let GEBC = function(htmlString) {
  _div = document.createElement("div");
  _div.innerHTML = htmlString.trim();

  return _div.firstChild;
}

function GEBIS(query) {
  // {name: "ID"} pairs
  let res = {};
  for (let [name, element_id] of Object.entries(query)) {
    element = GEBI(element_id);
    if (!!element) {
      res[name] = element;
    }
  }

  return res;
}

// URL Helpers
function _GET() {
  _url = new URL(window.location);
  
  let res = {};
  for (let [key, value] of _url.searchParams.entries()) {
    res[key] = value;
  }

  return res;
}

// Prefix ID Queries
function PIQ(prefix, query_list) {
  // ScreenName_Query_ID
  let res = {};
  for (let query of query_list) {
    res[query] = `${prefix}_${query}`;
  }

  return res;
}

// ChildOf
let CO = (parent, child) => {
  parent.appendChild(child);
  return child;
}

// JSON Parse, JSON Create, JSON Deepcopy
let JP = (jsonString) => JSON.parse(jsonString);
let JC = (jsObject) => JSON.stringify(jsObject);
let JCP = (jsObject) => JP(JC(jsObject));

// ID Helpers
function random_string(length, candidates = null) {
  if (candidates == null) {
    candidates = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  }

  let res = '';

  for (let i = 0; i < length; i++) {
    res += candidates[Math.floor(Math.random() * candidates.length)]
  }

  return res;
}

function random_element(length, candidates) {
  let res = [];

  for (let i = 0; i < length; i++) {
    res.push(candidates[Math.floor(Math.random() * candidates.length)]);
  }

  return res;
}

// Bulma Helpers
function bulma_bg_dim(element, dim = 1) {
  let base_color = null;
  let color = null;
  for (let class_name of element.classList.values()) {
    if (class_name.startsWith("has-background-")) {
      color = class_name;
      base_color = class_name.split("-").slice(0, 3).join("-"); // Strip ending dimness if available
      break;
    }
  }
  
  if (!!color) {
    element.classList.remove(color);
    let suffix = (dim == 0) ? "-dark" : (dim == 2) ? "-light" : "";
    element.classList.add(`${base_color}${suffix}`);
  }
}

function bulma_rm_bg(element) {
  for (let class_name of element.classList.values()) {
    if (class_name.startsWith("has-background-")) {
      element.classList.remove(class_name);
    }
  }
}

function bulma_color(color, dim = 1) {
  let colors = {
    "red": "danger",
    "yellow": "warning",
    "green": "success",
    "blue": "info",
    "purple": "link",
    "grass": "primary",
    "black": "black",
    "dark": "dark",
    "gray": "light",
    "white": "white",
  };

  let suffix = (dim == 0) ? "-dark" : (dim == 2) ? "-light" : "";

  if (Object.values(colors).includes(color)) {
    return `${color}${suffix}`;
  }
  else if (colors[color] != undefined) {
    return `${colors[color]}${suffix}`;
  }
  else {
    return null;
  }
}