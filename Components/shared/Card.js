import React from "react";
import { StyleSheet, View } from "react-native";

export default function Card(props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "#fff",
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpactiy: 0.3,
    // shadowRadius: 2,
    // shadowColor: "#8EDA38",
    marginHorizontal: 4,
    marginVertical: 6,
    borderBottomColor: "#1E792C",
    borderBottomWidth: "2px",
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 10,
  },
});
