import * as React from 'react';
import {BottomNavigation, Text} from 'react-native-paper';
import Persons from './Persons';

const ItemsRoute = () => <Text>Items</Text>;

const DistributeRoute = () => <Text>Distribute</Text>;

export default class Navigator extends React.Component {
  state = {
    index: 0,
    routes: [
      {key: 'persons', title: 'Personen', icon: 'human-male'},
      {key: 'items', title: 'Items', icon: 'format-list-bulleted'},
      {key: 'distribute', title: 'Aufteilen', icon: 'source-fork'},
    ],
  };

  _handleIndexChange = index => this.setState({index});

  _renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'persons':
        return <Persons navigation={this.props.navigation} />;
      case 'items':
        return <ItemsRoute />;
      case 'distribute':
        return <DistributeRoute />;
    }
  };

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}
