import { StatusBar } from "expo-status-bar";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import NegativeCollectForm from "./Components/NegativeCollectForm";
import PositiveCollectForm from "./Components/PositiveCollectForm";
import Swipe from "./Components/Swipe";
import Navigator from "./routes/homeStack";

export default function App() {
  return <Navigator />;
}
