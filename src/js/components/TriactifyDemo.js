import React from 'react';
import Router from 'react-router';

import Triactify from './Triactify';
import RangeSlider from './RangeSlider';

var nappitPalette = [
  '#092F3D',
  '#0F4F68',
  '#010F14',
  '#04222B',
  '#0E5970'
];

export default React.createClass({

  mixins: [Router.State],

  getInitialState() {
    return {
      config: {
        variance: 0.99,

        // x_colors: 'random',
        x_colors: nappitPalette,
        y_colors: 'match_x',
        color_space: 'lab',
        // color_function: colorFunc,
        width: 400,
        height:400,
        stroke_width: 1.51,
        seed: 'qwert',
        cell_size: 80
      },
      saturation: 1,
      brightness: 1,
      liveliness: 1,
      destruction: 0,
      fps: 60,
      delta: 0.3
    }
  },

  updatePalette(palette) {
    this.setState(config.palette, palette);
  },

  updateState(value, param) {
    this.state[param] = parseFloat(value);
    this.forceUpdate();
  },

  render() {
    return (
      <div>
        <Triactify
          config={this.state.config}
          destruction={this.state.destruction}
          brightness={this.state.brightness}
          saturation={this.state.saturation}
          liveliness={this.state.liveliness}
          animateX={true}
          animateY={true}
          delta={this.state.delta}
          fps={this.state.fps} />

        <div className="right">
          <RangeSlider value={this.state.brightness} min="-30" max="30" step=".1" title="Brightness" param="brightness" onUpdate={this.updateState} /><br />
          <RangeSlider value={this.state.saturation} min="-30" max="30" step=".1" title="Saturation" param="saturation" onUpdate={this.updateState} /><br />
          <RangeSlider value={this.state.delta} min="0" max="1" step=".1" title="Speed" param="delta" onUpdate={this.updateState}/><br />
          <RangeSlider value={this.state.liveliness} min="1" max="100" step="1" title="Liveliness" param="liveliness" onUpdate={this.updateState}/><br />
          <RangeSlider value={this.state.destruction} min="-0.9" max="0.9" step="0.1" title="Destruction" param="destruction" onUpdate={this.updateState}/><br />
          <RangeSlider value={this.state.fps} min="1" max="60" step="1" title="FPS" param="fps" onUpdate={this.updateState} /><br />

          <RangeSlider value="40" min="20" max="200" step="1" title="Cell Size" param="cell_size" onUpdate={this.updateConfig}/><br />
          <RangeSlider start="0.99" min="0.1" max="1" step="0.01" title="Variance" param="variance" onUpdate={this.updateConfig}/><br />
        </div>
      </div>
    );
  }
});
