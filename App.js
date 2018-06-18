import React, {Component} from 'react';
import {BackHandler} from 'react-native'
import {Router, Stack, Scene} from 'react-native-router-flux'
import Home from './src/containers/home'
import AddContact from './src/containers/addContact'

export default class App extends Component {


  render() {
    return (
      <Router showNavigationBar={false}>
        <Stack key="root">
          <Scene key="home" initial component={Home} hideNavBar={true}/>
          <Scene key="add" component={AddContact} hideNavBar={true}/>
        </Stack>
      </Router>
    );
  }
}
