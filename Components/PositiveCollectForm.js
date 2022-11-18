import { StyleSheet, Text, View, Button } from "react-native";
import React, {useState} from 'react';
import { TouchableOpacity } from "react-native-web";

const PositiveCollectForm = () => {
  const [categories, setCategories] = useState([])
  const [warningOpacity, setWarningOpacity] = useState(0);
  
  const option = [
    "Electronics", "Garden Furniture","Candles","Sports Equipment", "Board Games"
  ]

  function pickCategories(selectedCategories){

    if(categories.includes(selectedCategories)){
      setCategories(categories.filter(Categories => Categories !== selectedCategories))
      return;
    }

    setCategories(Categories=>Categories.concat(selectedCategories))

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your favourite Categories (up to 3)</Text>
      <View style={styles.options}>
        {
          option.map(option =>
            <View key = {option} style={styles.Categories}>
          <TouchableOpacity style={styles.checkBox} onPress={() => pickCategories(option)}>
           {categories.includes(option) && <Text style={styles.check}>🎅</Text> }
          </TouchableOpacity>
          <Text style={styles.categoryName}>{option}</Text>
          </View>
          
        )}
        <Button style={styles.submitBtn} title='submit' onPress={()=>{
          if(categories.length > 0 && categories.length < 4){
            console.log(categories)
            setWarningOpacity(0);
          } else if (categories.length === 0){
            console.log('please select at least 1 like')
            setWarningOpacity(100);
          }
        }}></Button>
         <Text style={{color: 'red', opacity: warningOpacity}}>Please select at least 1 Like</Text>
      </View>
    
    </View>
  );
};

export default PositiveCollectForm;

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