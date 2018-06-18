import {AsyncStorage} from 'react-native'

export function getNumbers(callback) {
  AsyncStorage.getItem('numbers').then((data) => {
    if (!data) {
      let list = [];
      list.push({
        contact : "Police",
        number: 155
      });
      list.push({
        contact : "Ambulance",
        number: 110
      });
      addItem(list);
      callback(list);
    }
    else {
      callback(JSON.parse(data));
    }
  });
}

export function addItem(items) {
  AsyncStorage.setItem('numbers', JSON.stringify(items));
}

export function removeItems() {
  AsyncStorage.removeItem("numbers");
}