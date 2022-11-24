import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import PositiveCollectForm from "../Components/PositiveCollectForm";
import NegativeCollectForm from "../Components/NegativeCollectForm";
import Swipe from "../Components/Swipe";
import History from "../Components/History";
import Header from "../Components/shared/Header";
import WelcomePage from "../Components/WelcomePage";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
const screens = {
  " ": {
    screen: WelcomePage,
    navigationOptions: {
      header: null,
      cardStyle: { backgroundColor: "#96B5CB" },
    },
  },
  "Get the ball rolling...": {
    screen: PositiveCollectForm,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#96B5CB",
        borderBottomWidth: 0,
        shadowColor: "transparent", // this covers iOS
        elevation: 0,
      }, // this covers Android},
      cardStyle: { backgroundColor: "#96B5CB" },
    },
  },
  "Swipe right if you like...": {
    screen: Swipe,
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#96B5CB",
        borderBottomWidth: 0,
        shadowColor: "transparent", // this covers iOS
        elevation: 0,
      }, // this covers Android},
      cardStyle: { backgroundColor: "#96B5CB" },
    },
  },
  History: {
    screen: History,
    navigationOptions: {},
  },
};
// const navTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     background: "transparent",
//   },
// };
const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
