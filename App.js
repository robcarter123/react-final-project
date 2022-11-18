import { StatusBar } from "expo-status-bar";
import React from "react";
import {StyleSheet, Text, View} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import NegativeCollectForm from './Components/NegativeCollectForm'
import PositiveCollectForm from './Components/PositiveCollectForm'
import Swipe from './Components/Swipe'


export default function App() {
  return (
  <NavigationContainer>
    <View>
      <PositiveCollectForm />
    </View>
  </NavigationContainer>
  )
}