import React from 'react';
import Router from 'react-router';
import Trianglify from 'trianglify';
import Immutable from 'immutable';
import async from 'async';
import chroma from 'chroma-js';

import Triactify from './Triactify';
import RangeSlider from './RangeSlider';

var sourcePalette = ['#092F3D', '#0F4F68', '#010F14', '#04222B', '#0E5970'];
var targetPalette = ['#ffffff', '#333333', '#666666', '#999999', '#AAAAAA'];

var scaledPalettes = [];
var scales = [];

for(var s = 0; s < sourcePalette.length; s++) {
  scales.push(chroma.scale([sourcePalette[s], targetPalette[s]]));
}

for(var p = 0; p < 1; p += 0.1) {
  var scaledColors = scales.map(function(scale) {
    return scale(p).hex();
  })
  scaledPalettes.push(scaledColors);
}

console.log(scaledPalettes);

var initialConfig = Immutable.Map({
  variance: 0.99,
  x_colors: sourcePalette,
  y_colors: 'match_x',
  color_space: 'lab',
  // color_function: colorFunc,
  width: 400,
  height:400,
  stroke_width: 1.51,
  seed: 'sqwert',
  cell_size: 80
});


function wait(time) {
  return function(done) {
    setTimeout(function() {
      done();
    }, time);
  };
}


export default React.createClass({

  mixins: [Router.State],

  getInitialState() {
    return {
      config: initialConfig,
      saturation: 1,
      brightness: 1,
      liveliness: 1,
      animateX: true,
      animateY: true,
      fps: 10,
      destruction: 0,
      delta: 0.3
    }
  },

  updateState(value, param) {
    this.state[param] = parseFloat(value);
    this.forceUpdate();
  },

  updatePalette(scale) {
    this.updateConfig(scaledPalettes[scale], 'x_colors');
  },

  updateConfig(value, param) {

    var newConfig = this.state.config.set(param, value);

    if (newConfig !== this.state.config) {
      this.state.config = newConfig;
      this.setState({
        pattern: Trianglify(this.state.config.toJS())
      });
    }

    this.forceUpdate();
  },

  componentWillMount() {
    this.setState({
      pattern: Trianglify(this.state.config.toJS())
    });
  },

  componentDidMount() {

    var self = this;

    this.updateConfig(self.props.params.setup, 'seed')

    function delayedUpdate(value, param, time) {
      return function(done) {
        setTimeout(function() {
          self.updateConfig(value, param);
          done();
        }, time);
      };
    }

    var animateCellsize = [];
    for(var i = 50; i < 100; i = i + 2) {
      animateCellsize.push(delayedUpdate(i, 'cell_size', 10));
    }

    var animateVariance = [];
    for(var i = 1; i < 99; i = i + 2) {
      animateVariance.push(delayedUpdate((i / 100), 'variance', 10));
    }

    var animatePalette = [];
    for(var i = 1; i < 10; i++) {
      animatePalette.push(delayedUpdate(scaledPalettes[i], 'x_colors', 30));
    }

    async.series(
      []
      .concat(wait(3000))
      .concat(animatePalette)
      .concat(animatePalette.reverse())
      .concat(animateCellsize)
      .concat(wait(3000))
      .concat(animateCellsize.reverse())
      .concat(animateVariance.reverse())
      .concat(animateVariance)
      .concat(animateVariance.reverse())
      .concat(wait(2000))
    );

  },

  render() {
    return (
      <div className="triactify-demo">
        <div className="left">
          <Triactify
            pattern={this.state.pattern}
            width={this.state.config.get('width')}
            height={this.state.config.get('height')}
            destruction={this.state.destruction}
            brightness={this.state.brightness}
            saturation={this.state.saturation}
            liveliness={this.state.liveliness}
            animateX={this.state.animateX}
            animateY={this.state.animateY}
            fps={this.state.fps}
            delta={this.state.delta} />
        </div>

        <div className="rangeSliders left">

          <RangeSlider value={this.state.config.get('cell_size')} min="10" max="200" step="10" title="Cell Size" param="cell_size" onUpdate={this.updateConfig}/><br />

          <RangeSlider value={this.state.config.get('variance')} min="0.1" max="1" step="0.01" title="Variance" param="variance" onUpdate={this.updateConfig}/><br />

          <RangeSlider value={0} min="0" max="10" step="1" title="Palette" onUpdate={this.updatePalette}/><br />

          <RangeSlider value={this.state.delta} min="0.1" max="1" step=".1" title="Speed" param="delta" onUpdate={this.updateState}/><br />

          <RangeSlider value={this.state.liveliness} min="1" max="100" step="1" title="Liveliness" param="liveliness" onUpdate={this.updateState}/><br />

          <RangeSlider value={this.state.destruction} min="-2" max="2" step="0.1" title="Destruction" param="destruction" onUpdate={this.updateState}/><br />
        </div>
      </div>
    );
  }
});

/*
<RangeSlider value={this.state.brightness} min="-1" max="1" step=".1" title="Brightness" param="brightness" onUpdate={this.updateState} /><br />

<RangeSlider value={this.state.saturation} min="-1" max="1" step=".1" title="Saturation" param="saturation" onUpdate={this.updateState} /><br />
*/
