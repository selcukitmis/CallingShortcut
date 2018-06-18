import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux'
import {Keyboard, BackHandler, View, Text, FlatList, Linking, SafeAreaView, Alert} from 'react-native'
import {Icon, ListItem} from 'react-native-elements'
import {colors, metrics} from '../themes'
import styles from './styles/home'
import {getNumbers, addItem} from '../services/numberService'

console.disableYellowBox = true;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {items: null};
  }

  componentDidMount() {
    Keyboard.dismiss();
    this.loadContacts();
  }

  loadContacts() {
    getNumbers((items) => {
      this.setState({items});
    });
  }

  removeContact(item) {
    Alert.alert(
      'Remove Confirmation',
      'We are removing this contact. Are you want to continue?',
      [
        {
          text : 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, continue', onPress: () => {
            getNumbers((items) => {
              let newItems = items.filter(s => s.contact !== item.contact && s.number !== item.number);
              addItem(newItems);
              this.loadContacts();
            });
          }
        },
      ],
    );

  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.main}}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Icon
              raised
              name='phone'
              type='font-awesome'
              color={colors.main}
              size={metrics.screenHeight * .067}/>
            <Icon
              containerStyle={{position: "absolute", top: 0, right: 0}}
              raised
              name='plus'
              type='font-awesome'
              color={colors.main}
              onPress={() => {
                Actions.add();
              }}
              size={metrics.screenHeight * .020}/>
            <Text style={styles.logoText}>Calling Shortcut</Text>
          </View>
          <View style={styles.listContainer}>
            <FlatList data={this.state.items}
                      style={{height: metrics.screenHeight * .69}}
                      renderItem={({item}) => <ListItem
                        key={Math.random().toString(36).substring(7)}
                        title={item.contact}
                        subtitle={item.number}
                        onPress={() => {
                          let url = 'tel:' + item.number;
                          Linking.openURL(url);
                        }}
                        onLongPress={() => {
                          this.removeContact(item)
                        }}
                        rightIcon={{name: "delete"}}/>}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
