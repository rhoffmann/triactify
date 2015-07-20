import React from 'react/addons';
import RangeSlider from '../RangeSlider';

var TestUtils = React.addons.TestUtils;

describe('RangeSlider', () => {
  var component;

  // FIXME: look up jasmine mocks
  function updateFunction() {

  }

  beforeEach(() => {
    component = TestUtils.renderIntoDocument(
      <RangeSlider onUpdate={updateFunction} min=0 max=10 step=1 param='someProp' title='PropertySlider'/>
    );
  });

  it('should render the correct title', () => {
    // FIXME: not sure if this will work
    expect(component.getDOMNode().title).toMatch('PropertySlider');
  });
});
