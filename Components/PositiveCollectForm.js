import { StyleSheet, Text, View, Button, TouchableOpacity, KeyboardAvoidingView, StatusBar, TextInput } from "react-native";
import React, { useState } from "react";


//import NegativeCollectForm from "./NegativeCollectForm";
import { useRoute } from "@react-navigation/native";

const PositiveCollectForm = ({ navigation }) => {
  let negativeArr = [];
  const [recipient, setRecipient] = useState("")
  const [positiveCategories, setPositiveCategories] = useState([]);
  const [warningOpacity, setWarningOpacity] = useState(0);

  const pressHandler = () => {   

    if (positiveCategories.length >= 1) {
      navigation.navigate("Swipe", { positiveCategories, negativeArr });
      console.log(positiveCategories);
      setWarningOpacity(0);
      setRecipient(recipient)
    } else if (positiveCategories.length < 1) {
      setWarningOpacity(100);
      setRecipient("")
    }
  };  

  const option = [
    "Electronics",
    "Garden Furniture",
    "Candles",
    "Sports Equipment",
    "Board Games",
  ];

  function pickCategories(selectedCategories) {
    if (positiveCategories.includes(selectedCategories)) {
      setPositiveCategories(
        positiveCategories.filter(
          (Categories) => Categories !== selectedCategories
        )
      );
      return;
    }

    setPositiveCategories((Categories) =>
      Categories.concat(selectedCategories)
    );
  }

  return (
<KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>Who are you shopping for?</Text>
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter a name or nickname here"
          placeholderTextColor="#003F5C"
          onChangeText={recipient => setRecipient(recipient)}
        />
      </View>
      <Text style={styles.title}>
        Choose the three starter categories from this list:
      </Text>
      <View style={styles.options}>
        {option.map(option => (
          <View key={option} style={styles.Categories}>
            <TouchableOpacity
              style={styles.checkBox}
              onPress={() => pickCategories(option)}
            >
              {positiveCategories.includes(option) && (
                <Text style={styles.check}>⭐r</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.categoryName}>{option}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.submitBtn} onPress={pressHandler}>
        <Text style={styles.submitText}>Next</Text>
      </TouchableOpacity>
      <Text style={{ color: "red", opacity: warningOpacity }}>
        Please select 3 options to get started
      </Text>
    </KeyboardAvoidingView>
  );
};


export default PositiveCollectForm;

const styles = StyleSheet.create({
  inputView: {
    display: "flex",
    marginVertical: 10,
    width: "70%",
    padding: 10,
    backgroundColor: "#F7EAB7",
    borderRadius: 10
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20
  },
  submitBtn: {
    display: "flex",
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#1E792C"
  },
  check: {
    alignSelf: "center"
  },
  categoryName: {
    textTransform: "capitalize",
    fontSize: 16
  },
  checkBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 5
  },
  Categories: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 20,
    minWidth: "70%",
    backgroundColor: "#F7EAB7",
    borderRadius: 10
  },
  options: {
    display: "flex",
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: "600"
  },
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    marginVertical: 10
  }
});

// const styles = StyleSheet.create({
//   submitBtn: {
//     backgroundColor: "red",
//   },
//   check: {
//     alignSelf: "center",
//   },
//   categoryName: {
//     textTransform: "capitalize",
//     fontSize: 16,
//   },
//   checkBox: {
//     width: 25,
//     height: 25,
//     borderWidth: 2,
//     borderColor: "lightgreen",
//     marginRight: 5,
//   },
//   Categories: {
//     flexDirection: "row",
//     marginVertical: 10,
//   },
//   options: {
//     alignSelf: "flex-start",
//     marginLeft: 50,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
