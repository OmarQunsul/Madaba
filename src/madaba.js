function drawTree(tree, canvasId) {
  var canvas = document.getElementById(canvasId);
  var context = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;

  var centerX = width / 2;
  var centerY = height / 2;

  const keys = Object.keys(tree.nodes);
  var nodes = {};
  for (node of keys) {
    var new_node = { name: node };
    nodes[node] = new_node;
  }

  nodes[keys[0]].level = 0;

  for (node of keys) {
    for (child of tree.nodes[node]) {
      if (nodes[child] == null) {
        nodes[child] = { name: child };
      }
      nodes[child].level = nodes[node].level + 1;
      if (nodes[node].children == null) { 
        nodes[node].children = [];
      }
      nodes[node].children.push(nodes[child]);
    }
  }

  var levels = [];

  for (key of Object.keys(nodes)) {
    var node = nodes[key];
    while((node.level + 1) > levels.length) levels.push([]);
    levels[node.level].push(node);
  }

  // Drawing Nodes
  const padding = 30;
  const step_height = (height - padding * 2) / (levels.length - 1);
  var current = padding;
  var all_nodes = nodes;
  for(var level = 0; level < levels.length; level++) {
    if (levels[level].length == 1) {
      var node = levels[level][0];
      //drawNode(context, centerX, current, node.name);
      node.location = [centerX, current];
    } else {
      var h_distance = 60 + level * 120;
      var nodes = levels[level];
      var currentX = centerX - h_distance / 2;
      for (var i = 0; i < nodes.length; i++) {
        var node = levels[level][i];
        //drawNode(context, currentX, current, node.name);
        node.location = [currentX, current];
        currentX += (h_distance / (levels[level].length - 1));
      }
    }
    current += step_height;
  }

  // Drawing Edges
  var nodes = all_nodes;
  for (node of keys) {
    var node = nodes[node];
    for (var i = 0; i < node.children.length; i++) {
      var child = node.children[i];
      console.log(child);
      connectNodes(context, node, child);
      drawNode(context, node.location[0], node.location[1], node.name);
      drawNode(context, child.location[0], child.location[1], child.name);
    }
  }
}

function drawNode(context, x, y, text) {
  var radius = 24;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = 'green';
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = '#003300';
  context.stroke();

  // Node text
  context.fillStyle = 'white';
  var font = "bold " + "12px Arial";
  context.font = font;
  context.strokeStyle = '#FFF';
  var width = Math.floor(context.measureText(text).width);
  context.fillText(text, x - width / 2, y + 6);
}

function connectNodes(context, node1, node2) {
    var x1 = node1.location[0];
    var y1 = node1.location[1];
    var x2 = node2.location[0];
    var y2 = node2.location[1];
    context.strokeStyle = '#333';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function drawGraph(graph, canvasId) {

  // Deciding the place of the nodes, and put them in points

  var canvas = document.getElementById(canvasId);
  var context = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;

  var centerX = width / 2;
  var centerY = height / 2;
  var radius = 20;

  var pointsNo = graph.nodes.length;
  var points = [];
  var rotateAngle = Math.PI * 2 / pointsNo;
  var rotateRadius = 0.85 * Math.min(width, height) / 2;

  var currentAngle = Math.PI / 2;

  for(i = 0; i < pointsNo; i++) {
    var x = centerX - rotateRadius * Math.sin(currentAngle);
    var y = centerY - rotateRadius * Math.cos(currentAngle);
    points.push([x, y]);
    currentAngle -= rotateAngle;
  }

  // Draw edges

  for(i = 0; i < graph.edges.length; i++) {
    // Edge line
    edge = graph.edges[i];
    var x1 = points[edge[0]][0];
    var y1 = points[edge[0]][1];
    var x2 = points[edge[1]][0];
    var y2 = points[edge[1]][1];
    context.strokeStyle = edge[3] ? 'red' : '#555';
    context.lineWidth = edge[3] ? 7 : 3;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    if (graph.directed) {
      var arrow_length = 20;
      var angle = Math.atan2(y2 - y1, x2 - x1);
      var x4 = x2 - Math.cos(angle) * radius;
      var y4 = y2 - Math.sin(angle) * radius;
      context.beginPath();
      context.moveTo(x4, y4);
      console.log(angle);
      context.lineTo(x4 - arrow_length * Math.cos(angle - Math.PI/6), y4 - arrow_length * Math.sin(angle - Math.PI/6));
      context.moveTo(x4, y4);
      context.lineTo(x4 - arrow_length * Math.cos(angle + Math.PI/6), y4 - arrow_length * Math.sin(angle + Math.PI/6));
      context.stroke();
    }

    // Edge middle space
    var x3 = (x1 + x2) / 2;
    var y3 = (y1 + y2) / 2;
    context.beginPath();
    context.arc(x3, y3, 15, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#fff';
    context.stroke();

    // Edge text
    context.fillStyle = 'black';
    var font = "bold " + "14px Arial";
    context.font = font;
    context.strokeStyle = '#FFF';
    context.fillText(edge[2].toString(), x3 - 4, y3 + 6);
  }

  // Drawing Nodes
  for (i = 0; i < graph.nodes.length; i++) {
    // Node circle
    node = graph.nodes[i];
    var center_node = (graph.center_node == i);
    var x = points[i][0];
    var y = points[i][1];
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = graph.highlight.indexOf(i) > -1 ? 'red' : 'green';
    if (center_node)
      context.fillStyle = 'yellow';
    context.fill();
    context.lineWidth = center_node ? 4 : 2;
    context.strokeStyle = '#003300';
    context.stroke();

    // Node text
    context.fillStyle = center_node ? 'black' : 'white';
    var font = "bold " + "18px Arial";
    context.font = font;
    context.strokeStyle = '#FFF';
    context.fillText(node, x - 4 ,y + 6);
  }
}

