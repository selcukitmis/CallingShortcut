import React, {Component} from 'react';
import {SafeAreaView, View, Text, Keyboard, Alert, Modal, TouchableHighlight, FlatList, TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input, Button, ListItem} from 'react-native-elements';
import {Actions} from 'react-native-router-flux'
import {getNumbers, addItem} from '../services/numberService'
import Permissions from "react-native-permissions";
import Contacts from 'react-native-contacts'
import {colors, metrics} from "../themes";

export default class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact     : "",
      contactError: "",
      number      : "",
      numberError : "",
      contacts    : null,
      modalVisible: false
    };
  }

  getContacts = () => {
    Permissions.check('contacts').then(response => {
      console.log("response", response);
      if (response === "authorized") {
        this.loadContacts();
      }
      else {
        this.alertForPermission();
      }
    });
  };

  alertForPermission() {
    Alert.alert(
      'Can we access your contacts?',
      'We need access so you can set your contacts',
      [
        {
          text   : 'No way',
          onPress: () => console.log('Permission denied'),
          style  : 'cancel',
        },
        {text: 'Open Settings', onPress: Permissions.openSettings},
      ],
    )
  };

  loadContacts() {
    Contacts.getAll((err, contacts) => {
      if (err) throw err;
      this.setState({modalVisible: true, contacts});
    })
  }

  save() {
    let contact = this.state.contact;
    if (!contact) {
      this.setState({contactError: "Contact Name is required!"});
      return false;
    }
    let number = this.state.number;
    if (!number) {
      this.setState({numberError: "Phone Number is required!"});
      return false;
    }
    getNumbers((items) => {
      items.push({
        contact: this.state.contact,
        number : this.state.number
      });
      addItem(items);
      this.setState({
        contact     : "",
        contactError: "",
        number      : "",
        numberError : ""
      });
      Actions.home();
    });
  };

  render() {
    if (this.state.modalVisible) {
      return (
        <SafeAreaView style={{flex: 1}}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible: false});
            }}>
            <View style={{marginTop: 22}}>
              <FlatList data={this.state.contacts}
                        style={{height: metrics.screenHeight}}
                        renderItem={({item}) => <ListItem
                          key={Math.random().toString(36).substring(7)}
                          title={item.givenName + " " + item.familyName}
                          subtitle={item.number}
                          onPress={() => {
                            this.setState({
                              contact     : item.givenName + " " + item.familyName,
                              contactError: "",
                              number      : item.phoneNumbers[0].number,
                              numberError : "",
                              contacts    : null,
                              modalVisible: false
                            });
                          }}/>}
              />

              <TouchableHighlight
                onPress={() => {
                  this.setState({modalVisible: false});

                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>

            </View>
          </Modal>
        </SafeAreaView>
      )
    }
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{
          flex         : 1,
          flexDirection: 'column',
        }}>
          <View style={{marginTop: 20, marginBottom: 10, height: 30, alignItems: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 20}}>Add New Contact</Text>
          </View>
          <View style={{marginBottom: 10, alignItems: "center"}}>
            <TextInput
              style={{width: metrics.screenWidth-30}}
              label={"Contact Name"}
              onSubmitEditing={() => {
                this.numberInput.focus();
              }}
              labelStyle={{fontSize: 17, color: "#000"}}
              placeholder='Enter Contact Name'
              shake={false}
              onChangeText={(val) => {
                this.setState({contact: val, contactError: ""})
              }}
              autoFocus={true}
              autoCorrect={false}
              autoCapitalize={"words"}
              errorMessage={this.state.contactError}
              leftIcon={
                <Text> <Icon
                  name='user'
                  size={24}
                  color='black'
                /></Text>
              }
              defaultValue={this.state.contact}
            />
            <Text>{this.state.contactError}</Text>
          </View>
          <View style={{alignItems: "center", marginBottom: 10}}>
            <TextInput
              ref={(input) => {
                this.numberInput = input;
              }}
              style={{width: metrics.screenWidth-30}}
              keyboardType={"phone-pad"}
              label={"Phone Number"}
              labelStyle={{fontSize: 17, color: "#000"}}
              placeholder='Enter Phone Number'
              shake={false}
              onChangeText={(val) => {
                this.setState({number: val, numberError: ""})
              }}
              onSubmitEditing={() => {
                this.save();
              }}
              errorMessage={this.state.numberError}
              leftIcon={
                <Text> <Icon
                  name='phone'
                  size={24}
                  color='black'
                /></Text>
              }
              defaultValue={this.state.number}
            />
            <Text>{this.state.numberError}</Text>
          </View>
          <View style={{marginBottom: 10, paddingHorizontal: 15}}>
            <Button
              icon={
                <Icon
                  name='download'
                  size={15}
                  color='white'
                />
              }
              iconRight
              title='Load from your contacts'
              buttonStyle={{backgroundColor: "#007bff"}}
              onPress={() => {
                Keyboard.dismiss();
                this.getContacts();
              }}
            />
          </View>
          <View style={{flexDirection: "row"}}>
            <View style={{flex: 1, paddingLeft: 15, paddingRight: 7}}>
              <Button
                icon={
                  <Icon
                    name='arrow-left'
                    size={15}
                    color='white'
                  />
                }
                title='Cancel'
                buttonStyle={{
                  backgroundColor: "#dc3545",
                }}
                onPress={() => {
                  Actions.pop();
                  Keyboard.dismiss();
                }}
              />
            </View>
            <View style={{flex: 1, paddingLeft: 7, paddingRight: 15}}>
              <Button
                icon={
                  <Icon
                    name='save'
                    size={15}
                    color='white'
                  />
                }
                title='Save'
                buttonStyle={{backgroundColor: "#28a745"}}
                onPress={() => {
                  Keyboard.dismiss();
                  this.save();
                }}

              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
