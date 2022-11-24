import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
  Linking,
} from "react-native";
import Card from "./shared/Card";
import React from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-navigation-stack";

export default function History({ navigation }) {
  const itemHistory = navigation.state.params.historyState;
  const recipient = navigation.state.params.recipient;
  console.log(recipient);

  const present = [
    {
      id: 1,
      name: "PresentOneAndAlotofotherwords and letter and stuff",
      slug: "PresentOne Slug",
      image: require("../assets/present.jpeg"),
      price: 5,
    },
    {
      id: 2,
      name: "PresentOneAndAlotofotherwords and letter and stuff",
      slug: "PresentTwo Slug",
      image: require("../assets/present2.jpeg"),
      price: 5,
    },
    {
      id: 3,
      name: "PresentThree",
      slug: "PresentThree Slug",
      image: require("../assets/present3.jpeg"),
      price: 5,
    },
    {
      id: 4,
      name: "PresentFour",
      slug: "PresentFour Slug",
      image: require("../assets/present4.jpeg"),
      price: 5,
    },
    {
      id: 5,
      name: "PresentFive",
      slug: "PresentFive Slug",
      image: require("../assets/present5.jpeg"),
      price: 5,
    },
  ];

  console.log(itemHistory[0].itemWebUrl);

  const onePresent = ({ item }) => (
    <Card>
      <View style={styles.item}>
        <View style={styles.avatarContainer}>
          <Image source={item.image} style={styles.avatarContainer} />
        </View>
        <View style={styles.textContainer}>
          <Text
            numberOfLines={2}
            style={styles.name}
            onPress={() => Linking.openURL(item.itemWebUrl)}
          >
            {item.name}
          </Text>
          <Text style={styles.price}>£{item.price}</Text>
        </View>
      </View>
    </Card>
  );

  const headerComponent = () => {
    return <Text style={styles.listHeadline}>Presents for {recipient}</Text>;
  };

  const itemSeperator = () => {
    return <View style={styles.seperator} />;
  };

  return (
    <View style={styles.page}>
      <FlatList
        ListHeaderComponentStyle={styles.listHeader}
        ListHeaderComponent={headerComponent}
        data={itemHistory}
        renderItem={onePresent}
        ItemSeperatorComponent={itemSeperator}
        ListEmptyComponent={<Text>Empty</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    // backgroundColor: "#D84D43",
  },
  textContainer: {
    alignItems: "left",
    // backgroundColor: "green",
    height: "100%",
    width: "68%",
    padding: "5px",
  },
  price: {
    // transform: [{ translateX: -100 }],
    // alignContent: 'center',
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1",
    fontSize: 19,
  },
  name: {
    // transform: [{ translateY: -30 }, { translateX: 10 }],
    fontSize: 20,
    marginBottom: "5%",
  },
  listHeadline: {
    color: "#E93629",
    fontSize: 21,
    fontWeight: "bold",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },
  avatarContainer: {
    borderRadius: 100,
    height: 89,
    width: 89,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  listHeader: {
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  seperator: {
    height: 1,
    width: "100%",
    backgroundColor: "#CCC",
  },
});
