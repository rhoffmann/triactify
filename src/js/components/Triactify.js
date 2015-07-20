import React from 'react';
import Trianglify from 'trianglify';
import Immutable from 'immutable';

import chroma from 'chroma-js';

function scale(valueIn, baseMin, baseMax, limitMin, limitMax) {
  return ((limitMax - limitMin) * (valueIn - baseMin) / (baseMax - baseMin)) + limitMin;
}

function updateColor(color, brightness, saturation) {
  // return color;
  return chroma(color).brighten(brightness).saturate(saturation);
}

function getPaths(pattern) {

  var paths = [];
  pattern.polys.forEach(function(poly) {
    var d = poly[1]; // point = d[1]
    var color = poly[0] // color = d[0];

    // center x, y of triangle
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



export default React.createClass({

  propTypes: {
    fps : React.PropTypes.number,
    destruction : React.PropTypes.number,
    saturation : React.PropTypes.number,
    liveliness: React.PropTypes.number,
    brightness : React.PropTypes.number,
    animateX: React.PropTypes.boolean,
    animateY: React.PropTypes.boolean,
    delta : React.PropTypes.number,
    config: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      fps: 30,
      delta: 0.1,
      brightness: 1,
      saturation: 1,
      destruction: 0,
      liveliness: 1,
      config: {}
    }
  },

  init() {

    let pattern = Trianglify(this.props.config);

    this.setState({
      paths: getPaths(pattern)
    });
  },

  getInitialState() {

    return {
      theta : 0,
      paths : []
    }
  },

  componentWillReceiveProps(nextProps) {
    // transition this into this state
    console.log('willReceiveProps', nextProps);
  },

  componenWillUnmount() {

  },

  componentWillMount() {
    this.init();
  },

  componentDidMount() {

    var _this = this;
    var _update = this.update;

    function draw() {
      setTimeout( () => {
        requestAnimationFrame(draw);
        _update();
      }, 1000 / _this.props.fps);
    }

    draw();
  },

  update() {

    // TODO: use Immutable
    var newPaths = Array.prototype.slice.call(this.state.paths, 0);

    var _this = this;

    var theta = this.state.theta;

    var animateY = this.props.animateY;
    var animateX = this.props.animateX;

    function scaleDestFactor(scaleFactor, destFactor) {
      // _this.props.destruction)
      return scaleFactor + (scaleFactor * _this.props.liveliness) + (destFactor * _this.props.destruction);
    }

    for(var i = 0; i < newPaths.length; i++) {
  		var path = this.state.paths[i];

      if (animateY) {
        newPaths[i].y1 = path.y1 + Math.sin(theta + scale(path.x1, 0, scaleDestFactor(500, 0), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 0);
        newPaths[i].y2 = path.y2 + Math.sin(theta + scale(path.x2, 0, scaleDestFactor(500, 1), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 1);
    		newPaths[i].y3 = path.y3 + Math.sin(theta + scale(path.x3, 0, scaleDestFactor(500, 2), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 2);
      }

      if (animateX) {
        newPaths[i].x1 = path.x1 + Math.cos(theta + scale(path.x1, 0, scaleDestFactor(500, 0), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 0);
        newPaths[i].x2 = path.x2 + Math.cos(theta + scale(path.x2, 0, scaleDestFactor(500, 1), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 1);
    		newPaths[i].x3 = path.x3 + Math.cos(theta + scale(path.x3, 0, scaleDestFactor(500, 2), 0, 2 * Math.PI)) * scaleDestFactor(0.5, 2);
      }
  	}

    // TODO: bring brightness, saturation, etc into state to modify it

    this.setState({
      theta: theta + this.props.delta,
      paths: newPaths
    });

  },

  getBrightness(theta) {
    // darkness: (Math.sin(theta) + 1) * 0.5,
    // return this.state.brightness
    return this.props.brightness;

  },

  getSaturation(theta) {
    // (Math.cos(theta) + 1) * 0.5,
    return this.props.saturation;
  },

  getShapeColor(color) {
    return updateColor(color, this.getBrightness(), this.getSaturation());
  },

  getStrokeColor(color) {
    return updateColor(color, this.getBrightness(), this.getSaturation());
  },

  drawTriangleSvg(path) {
    return `M${path.x1},${path.y1}L${path.x2},${path.y2}L${path.x3},${path.y3}Z`;
  },

  render() {

    var pathNodes = this.state.paths.map( (path, index) => {
      return (
        <path d={this.drawTriangleSvg(path)} key={index} fill={this.getShapeColor(path.color)} stroke={this.getStrokeColor(path.color)}></path>
      );
    });

    return(
      <svg width={this.props.config.width} height={this.props.config.height}>
        {pathNodes}
      </svg>
    );
  }
});
