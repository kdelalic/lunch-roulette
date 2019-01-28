import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { mount, shallow, render } from 'enzyme';

describe('App', () => {
  it('renders without crashing', () => {
    const component = shallow(<App />);
  
    expect(component).toMatchSnapshot();
  });

  it('should catch if the browser does not support geolocation', () => {
    const component = shallow(<App />);

    const showRestaurantsButton = component.find('WithStyles(Button)#show-restaurants');
    showRestaurantsButton.simulate('click');

    const message = component.find('h2#message').text().trim();

    expect(message).toEqual("Geolocation is not supported by this browser.");

  });

  
})
