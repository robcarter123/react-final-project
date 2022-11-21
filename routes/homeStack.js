import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import PositiveCollectForm from '../Components/PositiveCollectForm';
import NegativeCollectForm from '../Components/NegativeCollectForm';
import Swipe from '../Components/Swipe';
import History from '../Components/History';
import Header from '../Components/shared/Header';

const screens = {
    
    
    PositiveCollectForm: {
        screen: PositiveCollectForm,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />
            }
        }
    },
    Swipe: {
        screen: Swipe,
        navigationOptions: {
            title: '',
            headerTitle: () => <Header navigation={navigation} />
        },
    History: {
        screen: History,
        navigationOptions: {
            title: '',
            headerStyle: {backgroundColor: '#555'}
        }
    },
    }
    
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);

  // NegativeCollectForm: {
    //     screen: NegativeCollectForm
    //     },navigationOptions: {
        //     title: 'hello',
        //     headerStyle: {backgroundColor: '#555'}
        // }