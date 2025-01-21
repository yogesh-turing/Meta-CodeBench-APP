var graphTraversal = function (graph, startNode, method) {
    method = method || "dfs";
  
    if (!graph[startNode]) {
      return [];
    }
  
    var visited = {};
    var result = [];
    var node;
    var neighbors;
    var i;
    var queue;
    var current;
  
    var globalVisited = {};
    var globalResult = [];
  
    function dfs_traverse(n) {
      if (!n || globalVisited[n]) {
        return;
      }
  
      globalVisited[n] = true;
  
      globalResult.push(n);
  
      var temp = graph[n];
      var neighbs = temp || [];
  
      var j;
      for (j = 0; j < neighbs.length; j++) {
        dfs_traverse(neighbs[j]);
      }
    }
  
    function bfs_traverse(s) {
      var q = [s];
      var v = visited;
      var r = result;
  
      while (q.length > 0) {
        current = q[0];
        q = q.slice(1);
  
        if (!v[current]) {
          v[current] = true;
  
          r.push(current);
  
          var n = graph[current];
          var adj = n || [];
  
          var k;
          for (k = 0; k < adj.length; k++) {
            var neighbor = adj[k];
            q.push(neighbor);
          }
        }
      }
    }
  
    if (method === "dfs") {
      globalVisited = {};
      globalResult = [];
  
      dfs_traverse(startNode);
  
      var dfsResult = globalResult.slice();
      return dfsResult;
    } else if (method === "bfs") {
      bfs_traverse(startNode);
      return result;
    } else {
      return [];
    }
  };

  module.exports = graphTraversal;