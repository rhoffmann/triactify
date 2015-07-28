import React from 'react';
// import Trianglify from 'trianglify';
import Immutable from 'immutable';
import chroma from 'chroma-js';

function cloneArray(arr) {
  return Array.prototype.slice.call(arr, 0);
}

export default React.createClass({

  propTypes: {
    destruction : React.PropTypes.number,
    saturation : React.PropTypes.number,
    liveliness: React.PropTypes.number,
    brightness : React.PropTypes.number,
    animateX: React.PropTypes.boolean,
    animateY: React.PropTypes.boolean,
    delta : React.PropTypes.number,
    pattern: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      delta: 0.1,
      brightness: 0,
      // saturation: 1,
      destruction: 0,
      animateX: false,
      animateY: true,
      liveliness: 1,
      fps: 10,
      pattern: {
        polys: []
      }
    }
  },

  getInitialState() {
    return {
      theta : 0,
      paths : getPaths(this.props.pattern)
    }
  },

  init() {
    var _this = this;

    // clear any running animation timeouts if we are (re)initializing
    if (_this.animationID) {
      cancelAnimationFrame(_this.animationID);
    }

    this.setState({
      paths: getPaths(this.props.pattern)
    });

    this.forceUpdate();

    setTimeout(function(){
      _this.loop();
    }, 200);

  },

  loop() {

    var _this = this;
    var _update = this.update;

    function draw() {
      setTimeout(function(){
        _this.animationID = requestAnimationFrame(draw);
        _this.setState({
          theta: _this.state.theta + _this.props.delta
        });
      }, 1000 / _this.props.fps);
    }

    draw();
  },

  componentWillReceiveProps(nextProps) {
    // transition this into this state
    if (nextProps.pattern.polys !== this.props.pattern.polys) {
      this.init();
    }
  },

  componentWillMount() {
    this.init();
  },

  componentDidMount() {
    this.loop();
  },

  updateColor(color) {
    return color;
    // return chroma(color).darken(this.props.brightness);
  },

  drawTriangleSvg(path) {
    return `M${path.x1},${path.y1}L${path.x2},${path.y2}L${path.x3},${path.y3}Z`;
  },

  updatePaths(paths) {

    var theta = this.state.theta;
    var animateY = this.props.animateY;
    var animateX = this.props.animateX;
    var liveliness = this.props.liveliness;
    var destruction = this.props.destruction;

    // TODO: better scaling!!!

    function scaleDestFactor(scaleFactor, destFactor) {
      var scale = scaleFactor + (destFactor * destruction) + liveliness;
      return scale;
    }

    for(var i = 0; i < paths.length; i++) {
      var path = paths[i];

      if (animateY) {
        path.y1 = path.y1 + Math.sin(theta + scale(path.x1, 0, scaleDestFactor(500, 0), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 0);
        path.y2 = path.y2 + Math.sin(theta + scale(path.x2, 0, scaleDestFactor(500, 1), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 1);
    		path.y3 = path.y3 + Math.sin(theta + scale(path.x3, 0, scaleDestFactor(500, 2), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 2);
      }

      if (animateX) {
        path.x1 = path.x1 + Math.cos(theta + scale(path.y1, 0, scaleDestFactor(500, 0), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 0);
        path.x2 = path.x2 + Math.cos(theta + scale(path.y2, 0, scaleDestFactor(500, 1), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 1);
      	path.x3 = path.x3 + Math.cos(theta + scale(path.y3, 0, scaleDestFactor(500, 2), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 2);
      }
    }

    return paths;
  },

  render() {
    var updatePaths = this.updatePaths(this.state.paths);
    var pathNodes = updatePaths.map( (path, index) => {
      var color = this.updateColor(path.color);
      return (
        <path d={this.drawTriangleSvg(path)} key={index} fill={color} stroke={color}></path>
      );
    });

    return(
      <svg width={this.props.width} height={this.props.height}>
        {pathNodes}
      </svg>
    );
  }
});



function scale(valueIn, baseMin, baseMax, limitMin, limitMax) {
  return ((limitMax - limitMin) * (valueIn - baseMin) / (baseMax - baseMin)) + limitMin;
}
//
// function updateColor(color, brightness, saturation) {
//   return chroma(color).brighten(brightness).saturate(saturation);
// }

function getPaths(pattern) {
  var paths = [];
  pattern.polys.forEach(function(poly) {
    var d = poly[1]; // point = d[1]
    var color = poly[0] // color = d[0];

    paths.push({
      x1: d[0][0],
      y1: d[0][1],
      x2: d[1][0],
      y2: d[1][1],
      x3: d[2][0],
      y3: d[2][1],
      color: color
    });
  });
  return paths;
}
