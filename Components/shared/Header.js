import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import History from '../History'
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from 'react-navigation-stack';

export default function Header({ navigation }){

    const historyFolder = () => {
      console.log('hello');
      navigation.navigate('History');
    }

    return(
        <View style={styles.header}>
        <View>
            <Text style={styles.headerText}></Text>
        </View>
        <MaterialIcons name='folder' size={28} onPress={historyFolder} style={styles.icon}></MaterialIcons>
        </View>
    )

}

const styles = StyleSheet.create({
    header: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 20,
      color: '#333',
      letterSpacing:1,
    },
    icon:{
      position: 'absolute',
      right: 16,  
    }
  })