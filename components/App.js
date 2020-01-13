import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Events from './Events';
import Persons from './Persons';

const MainNavigator = createStackNavigator(
  {
    Events: {screen: Events},
    Persons: {screen: Persons},
  },
  {
    headerMode: 'none',
    initialRouteName: 'Events',
  },
);

const AppContainer = createAppContainer(MainNavigator);

const App = () => <AppContainer />;

export default App;
