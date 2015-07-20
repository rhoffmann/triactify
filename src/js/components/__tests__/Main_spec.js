import React from 'react/addons';
import RangeSlider from '../Main';

var TestUtils = React.addons.TestUtils;

describe('Main', () => {
  it('renders without problems', () => {
    var root = TestUtils.renderIntoDocument(<Main />);
    expect(root).toExist();
  });
});
