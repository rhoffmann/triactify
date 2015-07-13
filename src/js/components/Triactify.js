import React from 'react';
import Trianglify from 'trianglify';
import Immutable from 'immutable';

// import chroma from 'chroma';
// console.dir(chroma);

function scale(valueIn, baseMin, baseMax, limitMin, limitMax) {
  return ((limitMax - limitMin) * (valueIn - baseMin) / (baseMax - baseMin)) + limitMin;
}

// TODO: get vertexes, not paths, so we can animate adjacent triangles
//  that use the same point as its neighbors. is that possible?

// TODO: extract rendering and update in mixin? animatedComponent?

// TODO: different animation algorithm: rotate vertex in circle/ellipsis around
// its origin, different offsets, randomized

// TODO: transform one color scheme to the next, interpolate values
// with chroma from source to target

function getPaths(pattern) {
  console.dir(pattern);

  var paths = [];
  pattern.polys.forEach(function(poly) {
    var d = poly[1]; // point = d[1]
    var color = poly[0] // color = d[0];

    var x = (d[0][0] + d[1][0] + d[2][0])/3;
    var y = (d[0][1] + d[1][1] + d[2][1])/3;
    var c = color;

    paths.push({
      x1: d[0][0],
      y1: d[0][1],
      x2: d[1][0],
      y2: d[1][1],
      x3: d[2][0],
      y3: d[2][1],
      color: c
    });
  });
  return paths;
}

function getColorUpdate(color, lightness, saturation) {
    // return Chroma.
}

export default React.createClass({

  propTypes: {
    fps : React.PropTypes.number,
    config: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      fps: 30,
      config: {
        width: 100,
        height: 100,
        cell_size: 10
      }
    }
  },

  getInitialState() {

    // antipattern? props in state
    let pattern = Trianglify(this.props.config);

    return {
      theta : 0,
      paths : getPaths(pattern)
    }
  },

  componentWillMount() {

    var _this = this;

    function draw() {
      setTimeout( () => {
        requestAnimationFrame(draw);
        _this.update();
      }, 1000 / _this.props.fps);
    }

    draw();

  },

  update() {

    // TODO: use Immutable
    var newPaths = Array.prototype.slice.call(this.state.paths, 0);

    var theta = this.state.theta;

    for(var i = 0; i < newPaths.length; i++) {
  		var path = newPaths[i];
  		newPaths[i].y1 = path.y1 + Math.sin(theta + scale(path.x1, 0, 500, 0, 2 * Math.PI)) * 0.5;
  		newPaths[i].y2 = path.y2 + Math.sin(theta + scale(path.x2, 0, 500, 0, 2 * Math.PI)) * 0.5;
  		newPaths[i].y3 = path.y3 + Math.sin(theta + scale(path.x3, 0, 500, 0, 2 * Math.PI)) * 0.5;
  	}

    this.setState({
      theta: theta + 0.01,
      paths: newPaths
    });

  },

  drawTriangleSvg(path) {
    return `M${path.x1},${path.y1}L${path.x2},${path.y2}L${path.x3},${path.y3}Z`;
    // return `M{path.x1},{path.y1}L{path.x2},{path.y2}L{path.x3},{path.y3}Z`;
  },

  render() {
    var pathNodes = this.state.paths.map( (path) => {
      return (
        <path d={this.drawTriangleSvg(path)} fill={path.color} stroke={path.color}></path>
      );
    });
    return(
      <svg width={this.props.config.width} height={this.props.config.height}>
        {pathNodes}
      </svg>
    );
  }
});
