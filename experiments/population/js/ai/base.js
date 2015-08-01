window.AI = {};

var _action = function(name, properties) {
  var S = b3.Class(b3.Action);
  var p = S.prototype;
  p.name = name;
  for (var k in properties) { p[k] = properties[k]; }
  window.AI[name] = S;
  return S
}

var _condition = function(name, properties) {
  var S = b3.Class(b3.Condition);
  var p = S.prototype;
  p.name = name;
  for (var k in properties) { p[k] = properties[k]; }
  window.AI[name] = S;
  return S
}
