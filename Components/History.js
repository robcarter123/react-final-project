import { StyleSheet, Text, View, FlatList, SafeAreaView, Image } from 'react-native'
import Card from './shared/Card';
import React from 'react';
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from 'react-navigation-stack';

export default function History({navigation}) {
    const present = [{
        id: 1,
        name: 'PresentOne',
        slug: 'PresentOne Slug',
        image: require('../assets/present.jpeg')
    },
    {
        id:2,
        name: 'PresentTwo',
        slug: 'PresentTwo Slug',
        image: require('../assets/present2.jpeg')
    }, 
    {
        id:3,
        name: 'PresentThree',
        slug: 'PresentThree Slug',
        image: require('../assets/present3.jpeg')
    }, 
    {
        id:4,
        name: 'PresentFour',
        slug: 'PresentFour Slug',
        image: require('../assets/present4.jpeg')
    }, 
    {
        id:5,
        name: 'PresentFive',
        slug: 'PresentFive Slug',
        image: require('../assets/present5.jpeg')
    },  
];

const onePresent = ( { item } ) => (
<Card>
    <View style={styles.item}>
        <View style={styles.avatarContainer}>
            <Image source = {item.image} style={styles.avatarContainer}/>
        </View>
            <Text style={styles.name}> {item.name}</Text>
            <Text style={styles.slug}>{item.slug}</Text>
    </View>
</Card>
)

const headerComponent = () => {
  return <Text style={styles.listHeadline}>Presents</Text>
}

const itemSeperator = () => {
    return <View style = {styles.seperator}/>
}

return (
    <View>
            <FlatList 
            ListHeaderComponentStyle={styles.listHeader}
            ListHeaderComponent={headerComponent}
            data = { present }
            renderItem = { onePresent }
            ItemSeperatorComponent = { itemSeperator }
            ListEmptyComponent = { <Text>Empty</Text>}
            />
    </View>
        
    );
}

const styles = StyleSheet.create({
    slug:{
        transform: [{translateX: -100}],
        // alignContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    name:{
        transform: [{translateY: -30},{translateX: 10}],
        fontSize: 20,
    },
    listHeadline:{
        color:'#333',
        fontSize: 21,
        fontWeight: 'bold',
    },
    item: {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:13,
    },
    avatarContainer:{
        backgroundColor:'#D9D9D9',
        borderRadius:100,
        height:89,
        width:89,
        justifyContent:'center',
        alignItems: 'center',
        margin:10,
    },
    listHeader:{
        height:55,
        alignItems:'center',
        justifyContent: 'center'
    },
    seperator: {
        height: 1,
        width: '100%',
        backgroundColor: '#CCC', 
    }
})