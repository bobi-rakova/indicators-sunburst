
// Dimensions of sunburst.
var width = 600;
var height = 600;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 200, h: 30, s: 3, t: 10
};

// Mapping of step names to colors.
var colors_ = ['#69c242', '#64bbe3', '#ffcc00', '#ff7300', '#cf2030'];
var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
var c_ = ['#FF6347', '#FF7F50', '#F08080', '#E9967A', '#FA8072', '#FF8C00', '#FFA500', '#FFD700',
'#EEE8AA', '#9ACD32', '#90EE90', '#00FF7F', '#66CDAA', '#E0FFFF', '#40E0D0', '#7FFFD4',
'#00BFFF', '#87CEFA', '#D8BFD8', '#DDA0DD', '#DDA0DD', '#DA70D6', '#FFC0CB', '#FFE4C4', '#FFE4B5']

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
c_ = shuffle(c_);

// Do not include a domain
var colors = d3.scale.ordinal()
  .range(c_);
// var colors = d3.scale.category20c();

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.linear()
    .range([0, radius]);

function computeTextRotation(d) {
  return (x(d.x + d.dx / 2 ) - Math.PI / 2 ) / Math.PI * 180;
}
function computeLongTextRotation(d) {
  return (x(d.x + d.dx / 4 ) - Math.PI / 2 ) / Math.PI * 180;
}

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// var partition = d3.layout.partition()
//     .size([2 * Math.PI, radius * radius])
//     .value(function(d) { return d.size; });

    var partition = d3.layout.partition()
        .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

d3.text("data/sunburst_em.csv", function(text) {
  var csv = d3.csv.parseRows(text);
  var json = buildHierarchy(csv);
  createVisualization(json);
});

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                lineNumber += 1
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dx", 6)
                            .attr("dy", lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  // initializeBreadcrumbTrail();

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition.nodes(json)
      .filter(function(d) {
      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
      });

  var g = vis.selectAll("g")
      .data(nodes)
      .enter().append("g");

  var path = g.append("path")
      // vis.data([json]).selectAll("path")
      // .data(nodes)
      // .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      //.style("fill", function(d) { return colors[d.name]; })
      .style("fill", function (d) { return colors((d.children ? d : d.parent).name); })
      .style("opacity", 1);
      //.on("mouseover", mouseover);


  var text = g.append("text")
      //.attr("transform", function(d) { return "rotate(" + d.name.length > 180 ? computeTextRotation(d) : computeTextRotation(d) + ")"; })
      .attr("transform", function(d) {
        if(d.name.length > 40) {
          return "rotate(" + computeLongTextRotation(d) + ")";
        } else {
        return "rotate(" + computeTextRotation(d) + ")";
      }})
      .attr("x", function(d) { return y(d.y); })
      .attr("y", 0)
      .attr("opacity", 1)
      .attr("dx", "6") // margin
      .attr("dy", ".35em") // vertical-align
      // .attr('dx', '-20')
      // .attr('dy', '.5em')
      // .attr("visibility", function(d) { return d.name.length > 30? "hidden" : "visible"})
      .text(function(d) { return d.name; })
      .call(wrap, 70);

  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.node().__data__.value;
 };


// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}


function buildHierarchy(csv) {
  var root = {"name": "", "children": []};


  for (var i = 0; i < csv.length; i++) {
    var currentNode = root;
    var sequence = csv[i][0];
    var size = 1;
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }

    for (var j=0; j < csv[i].length; j++)  {
      if(csv[i][j] == "") {
        continue;
      }

      var children = currentNode["children"];
      var nodeName = csv[i][j];
      var childNode;
      if (j + 1 < csv[i].length && csv[i][j+1] != "") {
           // Not yet at the end of the sequence; move down the tree.
         	var foundChild = false;
         	for (var k = 0; k < children.length; k++) {
         	  if (children[k]["name"] == nodeName) {
         	    childNode = children[k];
         	    foundChild = true;
         	    break;
         	  }
         	}
          // If we don't already have a child node for this branch, create it.
         	if (!foundChild) {
         	  childNode = {"name": nodeName, "children": []};
         	  children.push(childNode);
         	}
         	currentNode = childNode;
      } else {
         	// Reached the end of the sequence; create a leaf node.
         	childNode = {"name": nodeName, "size": size};
         	children.push(childNode);
      }
    }
  }

  return root;
}
