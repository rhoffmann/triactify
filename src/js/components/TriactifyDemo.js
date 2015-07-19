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
        width: 640,
        height: 480,
        stroke_width: 1.51,
        seed: 'qwert',
        cell_size: 100
      },
      fps: 30,
      delta: 0.1
    }
  },

  updatePalette(palette) {
    this.setState(config.palette, palette);
  },

  updateBrightness(value) {

  },

  render() {
    return (
      <div>
        <Triactify config={this.state.config} fps={this.state.fps} />


        //  *  destruction (triangles) -> variance (difference in rotational values)
        //  *  brightness
        //  *  size
        //  *  color
        //  *  liveliness -> speed?
        <RangeSlider value="" min="" max="" title="Brightness" onUpdate={this.updateBrightness} /><br />
        <RangeSlider start="" min="" max="" name="hue" /><br />
        <RangeSlider start="" min="" max="" name="hue" /><br />
        <RangeSlider start="" min="" max="" name="size" /><br />
        <RangeSlider start="" min="" max="" title="Destruction" onUpdate="variance" /><br />
      </div>
    );
  }
});
