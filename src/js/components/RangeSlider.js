import React from 'react';

export default React.createClass({
  propTypes: {
    onUpdate: React.PropTypes.func
  },
  updateValue() {
    this.props.onUpdate(this.getDOMNode().value);
  },
  render() {
    return (
      <div className="range-slider">
        <span>{this.props.title}</span>
        <input type="range" ref="{this.props.name}" onChange={this.handleChange} />
      </div>
    );
  }
});
