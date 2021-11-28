// Object
let ShowIDScreen = {
  screen_name: "ShowID",
  template_name: "ShowID.html",
  rendered: false,

  el: {
    __query: PIQ("ShowID", 
      ["assigned_id", "assigned_color", "button_lost", "button_end"]),
  },

  globals: {

  },

  listeners: {
    on_id_color_assign: undefined,
  },

  attachers: {
    on_id_color_assign: null,
  },

  renderers: {
    id_and_color_renders: {
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

// Listeners
ShowIDScreen.listeners.on_id_color_assign = function(id, color) {
  ShowIDScreen.renderers.id_and_color_renders.rerender(id, color);
}

// Renderers
ShowIDScreen.renderers.id_and_color_renders.rerender = function(id, color) {
  ShowIDScreen.el["assigned_id"].innerHTML = id;
  bulma_rm_bg(ShowIDScreen.el["assigned_color"]);
  let b_color = bulma_color(color);
  if (b_color != null) {
    ShowIDScreen.el["assigned_color"].classList.add(`has-background-${b_color}`);
  }
}

// Final Renders
ShowIDScreen.renders.renderTo = async function(app_target = null, overlay_target = null) {
  this.target_div = app_target;
  this.target_overlay_div = overlay_target;
  
  let template = await fetch(ShowIDScreen.template_name).then(response => response.text()).then(htmlString => GEBC(htmlString));

  this.target_app = template.querySelector(".app_target");

  if (this.target_app != null) {
    this.target_div.appendChild(this.target_app);
  }

  this.target_overlay = template.querySelector(".overlay_target");
  if (this.target_overlay != null) {
    this.target_overlay_div.appendChild(this.target_overlay);
  }

  Object.assign(ShowIDScreen.el, GEBIS(ShowIDScreen.el.__query));

  // Component Specific Renders

  ShowIDScreen.rendered = true;
  return ShowIDScreen;
}

ShowIDScreen.renders.unrender = function() {
  if (this.target_app != null) {
    this.target_app.remove();
  }

  if (this.target_overlay != null) {
    this.target_overlay.remove();
  }

  ShowIDScreen.rendered = false;
}