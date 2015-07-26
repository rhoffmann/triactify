import React from 'react';

export default React.createClass({
  displayName: 'Checkbox',
  propTypes: {
    onUpdate: React.PropTypes.func.isRequired,
    checked: React.PropTypes.boolean,
    param: React.PropTypes.string
  },

  getInitialState() {
    return {
      checked: false
    };
  },

  componentWillMount() {
    this.setState({checked: this.props.checked});
  },

  handleChange() {
    var val = this.refs.input.getDOMNode().checked;
    this.props.onUpdate(val, this.props.param || false);
    this.setState({
      checked: val
    });
  },

  render() {
    return (
      <div className="checkbox">
        <input type="checkbox" value={this.props.param} checked={this.state.checked} ref="input" onChange={this.handleChange} /><span className="value">{this.props.param}</span>
      </div>
    );
  }
});
