import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  StatusBar,
  TextInput
} from "react-native";
import React, { useState } from "react";
//import NegativeCollectForm from "./NegativeCollectForm";
//import { useRoute } from "@react-navigation/native";

const PositiveCollectForm = ({ navigation }) => {
  let negativeArr = [];

  const [recipient, setRecipient] = useState("");

  const pressHandler = () => {
    if (positiveCategories.length === 3) {
      navigation.navigate("Swipe", { positiveCategories, negativeArr });
      console.log(positiveCategories);
      setWarningOpacity(0);
      setRecipient(recipient);
    } else if (positiveCategories.length !== 3) {
      setWarningOpacity(100);
      setRecipient("");
    }
  };

  const [positiveCategories, setPositiveCategories] = useState([]);
  const [warningOpacity, setWarningOpacity] = useState(0);

  const option = [
    "Electronics",
    "Garden Furniture",
    "Candles",
    "Sports Equipment",
    "Board Games"
  ];

  function pickCategories(selectedCategories) {
    if (positiveCategories.includes(selectedCategories)) {
      setPositiveCategories(
        positiveCategories.filter(
          Categories => Categories !== selectedCategories
        )
      );
      return;
    }

    setPositiveCategories(Categories => Categories.concat(selectedCategories));
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>Who are you shopping for?</Text>
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter a name or nickname here"
          placeholderTextColor="#003f5c"
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
                <Text style={styles.check}>⭐</Text>
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
    backgroundColor: "#f7eab7",
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
    backgroundColor: "#f7eab7",
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
