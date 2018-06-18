import {StyleSheet} from 'react-native'

import {colors, metrics} from '../../themes'

export default StyleSheet.create({
  container    : {
    flex           : 1,
    flexDirection  : 'column',
    backgroundColor: colors.main
  },
  logoContainer: {
    width            : metrics.screenWidth,
    height           : metrics.screenHeight * .30,
    alignItems       : "center",
    justifyContent   : "center",
    borderBottomWidth: 1,
    borderColor      : colors.secondary,
  },
  logoText     : {
    fontSize    : metrics.screenHeight * .03,
    marginTop   : metrics.screenHeight * .015,
    marginBottom: metrics.screenHeight * .0075,
    color       : "#fff"
  },
  listContainer: {
    flex: 1,
    backgroundColor:"#fff"
  }
})
