import React from 'react';

export default React.createClass({
  displayName: 'RangeSlider',
  propTypes: {
    onUpdate: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    min: React.PropTypes.string,
    max: React.PropTypes.string,
    step: React.PropTypes.string,
    param: React.PropTypes.string,
    title: React.PropTypes.string
  },

  getInitialState() {
    return {
      value: 0
    };
  },

  componentWillMount() {
    this.setState({value: this.props.value});
  },

  handleChange() {
    var val = this.refs.input.getDOMNode().value;

    this.props.onUpdate(parseFloat(val), this.props.param || null);
    
    this.setState({
      value: val
    });
  },

  render() {
    return (
      <div className="range-slider">
        {this.props.title && <span>{this.props.title}</span>}
        <input type="range" min={this.props.min} max={this.props.max} ref="input" value={this.state.value} step={this.props.step} onChange={this.handleChange} /><span className="value">{this.state.value}</span>
      </div>
    );
  }
});
