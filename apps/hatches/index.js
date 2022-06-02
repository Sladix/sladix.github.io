import sketch from "./sketch.js";

paper.install(window);

window.onload = function () {
  paper.setup(document.getElementById("mainCanvas"));
  const pane = new Tweakpane.Pane();
  sketch(pane)
};