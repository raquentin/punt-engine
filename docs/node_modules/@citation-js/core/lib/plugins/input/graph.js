"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyGraph = applyGraph;
exports.removeGraph = removeGraph;
function applyGraph(entry, graph) {
  if (entry._graph) {
    const index = graph.findIndex(({
      type
    }) => type === '@else/list+object');
    if (index !== -1) {
      graph.splice(index + 1, 0, ...entry._graph.slice(0, -1));
    }
  }
  entry._graph = graph;
  return entry;
}
function removeGraph(entry) {
  delete entry._graph;
  return entry;
}