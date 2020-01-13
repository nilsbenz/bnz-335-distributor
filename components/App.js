import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Events from './Events';
import Navigator from './Navigator';

const MainNavigator = createStackNavigator(
  {
    Events: {screen: Events},
    Navigator: {screen: Navigator},
  },
  {
    headerMode: 'none',
    initialRouteName: 'Events',
  },
);

const AppContainer = createAppContainer(MainNavigator);

const App = () => <AppContainer />;

export default App;
