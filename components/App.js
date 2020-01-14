import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Events from './Events';
import Navigator from './Navigator';
import Selector from './Selector';

const MainNavigator = createStackNavigator(
  {
    Events: {screen: Events},
    Navigator: {screen: Navigator},
    Selector: {screen: Selector},
  },
  {
    headerMode: 'none',
    initialRouteName: 'Events',
  },
);

const AppContainer = createAppContainer(MainNavigator);

const App = () => <AppContainer />;

export default App;
