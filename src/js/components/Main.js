import React from 'react';
import Triactify from './Triactify';
import RangeSlider from '/RangeSlider';


let patternConfig = {
  height: 480,
  width: 320,
  cell_size: 20
};

export default React.createClass({

  getInitialState() {
    return {};
  },

  render() {

    var title = this.props.title;

    return (
      <div>

        <Triactify config={patternConfig} fps={30} />,

        <RangeSlider start="" min="" max="" ref="hue" />
        <RangeSlider start="" min="" max="" ref="size" />
        <RangeSlider start="" min="" max="" ref="brightness" />
        <RangeSlider start="" min="" max="" ref="thickness" />

      </div>
    );
  }
});
