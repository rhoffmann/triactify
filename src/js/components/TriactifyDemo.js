import React from 'react';
import Router from 'react-router';
import Trianglify from 'trianglify';
import Immutable from 'immutable';
import async from 'async';
import chroma from 'chroma-js';
import _ from 'lodash';

import Triactify from './Triactify';
import RangeSlider from './RangeSlider';
import Checkbox from './Checkbox';

// TODO: aufräumen, refactoring!!!

var sourcePalette = _.shuffle(['#000', '#04222B', '#092F3D', '#0F4F68', '#08445C', '#0E5970', '#fff']);
var targetPalette = _.shuffle(['#000', '#74C2EF', '#51A9DB', '#2F96BC', '#237Ea7', '#0C6F91', '#fff']);

// positiv
// neutral
// negativ

var scaledPalettes = [];
var scales = [];

for(var s = 0; s < sourcePalette.length; s++) {
  scales.push(chroma.scale([sourcePalette[s], targetPalette[s]]));
}

for(var p = 0; p < 10; p += 1) {
  var scaledColors = scales.map(function(scale) {
    return scale(p / 10).hex();
  })
  scaledPalettes.push(scaledColors);
}

var initialConfig = Immutable.Map({
  variance: 0.99,
  x_colors: sourcePalette,
  y_colors: 'match_x',
  color_space: 'lab',
  color_function: null,
  width: 320,
  height: 568,
  stroke_width: 1.51,
  seed: 'nappit',
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
      // saturation: 1,
      brightness: 0,
      liveliness: 0,
      paletteIndex: 0,
      animateX: true,
      animateY: true,
      randomPalette: false,
      fps: 30,
      destruction: 0,
      delta: 0.3
    }
  },

  reset() {
    this.setState(this.getInitialState());
    this.forceUpdate();
  },

  updateState(value, param) {
    this.state[param] = value;
    this.forceUpdate();
  },

  updatePalette(scale) {

    this.state.paletteIndex = scale;
    var palette = scaledPalettes[this.state.paletteIndex];

    if (this.state.randomPalette) {
      this.updateConfig(function(x,y) {
        return _.sample(palette);
      }, 'color_function');
    } else {
      this.updateConfig(null, 'color_function');
      this.updateConfig(palette, 'x_colors');
    }

    this.forceUpdate();
  },

  toggleRandomPalette() {
    this.state.randomPalette = !this.state.randomPalette;
    console.log('toggleRandom');
    this.updatePalette(this.state.paletteIndex);
  },

  updateConfig(value, param) {

    console.log('updateConfig: ', value, param);
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

    // this.updateConfig(self.props.params.setup, 'seed')

    // TODO: check why delayedUpdate keeps increasing

    function delayedUpdate(value, param, time) {
      return function(done) {
        var t = setTimeout(function() {
          console.log('updateConfig('+value+','+param+')');
          self.updateConfig(value, param);
          clearTimeout(t);
          done();
        }, time);
      };
    }

    function delayedUpdateState(value, param, time) {
      return function(done) {
        var t = setTimeout(function() {
          console.log('updateState('+value+','+param+')');
          self.updateState(value, param);
          clearTimeout(t);
          done();
        }, time);
      };
    }

    var animateCellsize = [];
    for(var i = 50; i < 100; i = i + 2) {
      animateCellsize.push(delayedUpdate(i, 'cell_size', 100));
    }

    var animateVariance = [];
    for(var i = 1; i < 99; i = i + 2) {
      animateVariance.push(delayedUpdate((i / 100), 'variance', 100));
    }

    var animateDestruction = [];
    for(var i = 0; i < 10; i = i + 1) {
      animateDestruction.push(delayedUpdateState((0.1 * i), 'destruction', 100));
    }

    var animatePalette = [];
    for(var i = 1; i < 10; i++) {
      animatePalette.push(delayedUpdate(scaledPalettes[i], 'x_colors', 100));
    }

    var animationSeries = []
      .concat(animateDestruction)
      .concat(wait(2000))
      .concat(animateDestruction.reverse())
      .concat(wait(3000))
      .concat(animateCellsize)
      .concat(wait(3000))
      .concat(animateCellsize.reverse())
      .concat(animateVariance.reverse())
      .concat(animateVariance)
      .concat(wait(4000))
      .concat(animateVariance.reverse())
      .concat(wait(2000));

    // console.dir(animationSeries);
    //
    // async.series(
    //   animationSeries
    // );

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

        <div className="controls left sep">

          <div className="checkboxes cf">
            <div className="left">
              <Checkbox onUpdate={this.updateState} checked={this.state.animateX} param="animateX" /> <br/>
            </div>
            <div className="left">
              <Checkbox onUpdate={this.updateState} checked={this.state.animateY} param="animateY" /> <br/>
            </div>

          </div>

          <RangeSlider value={this.state.config.get('cell_size')} min="20" max="200" step="10" title="Größe" param="cell_size" onUpdate={this.updateConfig}/><br />

          <RangeSlider value={this.state.config.get('variance')} min="0.1" max="1" step="0.01" title="Varianz" param="variance" onUpdate={this.updateConfig}/><br />

          <RangeSlider value={this.state.paletteIndex} min="0" max="9" step="1" title="Helligkeit" onUpdate={this.updatePalette}/><br />

          <RangeSlider value={this.state.delta} min="0.1" max="1" step=".1" title="Bewegung 1" param="delta" onUpdate={this.updateState}/><br />

          <RangeSlider value={this.state.liveliness} min="0" max="10" step="1" title="Bewegung 2" param="liveliness" onUpdate={this.updateState}/><br />

          <RangeSlider value={this.state.destruction} min="-2" max="2" step="0.1" title="Zerstörung" param="destruction" onUpdate={this.updateState}/><br />
        </div>
      </div>
    );
  }
});

/*

<div className="left sep">
  <Checkbox onUpdate={this.toggleRandomPalette} checked={this.state.randomPalette} param="randomPalette" /> <br/>
</div>

<RangeSlider value={this.state.liveliness} min="1" max="100" step="1" title="Liveliness" param="liveliness" onUpdate={this.updateState}/><br />
*/
