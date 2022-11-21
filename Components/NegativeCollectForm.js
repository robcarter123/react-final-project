import { StyleSheet, Text, View, Button } from "react-native";
import React, {useState} from 'react';
import { TouchableOpacity } from "react-native";
//import positiveCategories from './PositiveCollectForm';
import Swipe from "./Swipe";
import { useRoute } from "@react-navigation/native";

const NegativeCollectForm = ( { navigation }) => {
  const [negativeCategories, setNegativeCategories] = useState([])
  const [warningOpacity, setWarningOpacity] = useState(0);
  const [warningMessage, setWarningMessage] = useState('Please select 1 disliked category')

  const positiveML = navigation.state.params.positiveCategories;

  const pressHandler = () => {
    if(negativeCategories.length > 0 && negativeCategories.length < 2){
      navigation.navigate('Swipe', {negativeCategories, positiveML});
      setWarningOpacity(0);
    } else if (negativeCategories.length > 1) {
      setWarningMessage('Please only select 1 dislike');
  } else if (negativeCategories.length === 0){
      setWarningOpacity(100);
    }
  }

  const option = [
    "Electronics", "Garden Furniture","Candles","Sports Equipment", "Board Games"
  ]

  function pickCategories(selectedCategories){

    if(negativeCategories.includes(selectedCategories)){
      setNegativeCategories(negativeCategories.filter(Categories => Categories !== selectedCategories))
      return;
    }

    setNegativeCategories(Categories=>Categories.concat(selectedCategories))

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your least favourite Category</Text>
      <View style={styles.options}>
        {
          option.map(option =>
            <View key = {option} style={styles.Categories}>
          <TouchableOpacity style={styles.checkBox} onPress={() => pickCategories(option)}>
           {negativeCategories.includes(option) && <Text style={styles.check}>🎅</Text> }
          </TouchableOpacity>
          <Text style={styles.categoryName}>{option}</Text>
          </View>
          
        )}
        <Button style={styles.submitBtn} title='submit' onPress={pressHandler}></Button>
         <Text style={{color: 'red', opacity: warningOpacity}}>{warningMessage}</Text>
      </View>
    
    </View>
  );
};

export default NegativeCollectForm;

const styles = StyleSheet.create({
  submitBtn: {
    backgroundColor: 'red',
  },
  check: {
    alignSelf: 'center',
  },
  categoryName: {
    textTransform: 'capitalize',
    fontSize: 16,
  },
  checkBox: {
    width:25,
    height:25,
    borderWidth:2,
    borderColor: 'lightgreen',
    marginRight:5
  },
  Categories: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  options: {
    alignSelf: 'flex-start',
    marginLeft: 50,
    // textDecorationLine: 'line-through',

  },
  title: {
    fontSize: 18,
    fontWeight: '600'
  },
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});