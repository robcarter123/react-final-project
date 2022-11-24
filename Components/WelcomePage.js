import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground
} from "react-native";
import { fetchUsers } from "../utils";

const WelcomePage = ({ navigation }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [warningOpacity, setWarningOpacity] = useState(0);

  const passwordRef = useRef();

  const pressHandler = () => {
    setWarningOpacity(0);
    setIsLoading(true);

    fetchUsers()
      .then(data => {
        data.forEach(u => {
          console.log(u.username === user, u.password === password);
          if (u.username === user && u.password === password) {
            console.log("yay!");
            navigation.navigate("Get the ball rolling...", { user });
            setIsLoading(false);
            setWarningOpacity(0);
          }
        });
      })
      .catch(() => {
        setWarningOpacity(100);
        setIsLoading(false);
        setUser("");
      });
  };

  const renderLogin = (
    <View>
      <ImageBackground
        source={require("./background.png")}
        resizeMode="stretch"
        style={styles.img}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.page}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Image style={styles.image} source={require("./logo-square.png")} />

            <StatusBar style="auto" />
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Username"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current.focus()}
                onChangeText={user => setUser(user)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Password"
                ref={passwordRef}
                secureTextEntry
                returnKeyType="done"
                onChangeText={password => setPassword(password)}
              />
            </View>

            <TouchableOpacity>
              <Text style={styles.forgot_button}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={pressHandler}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <Text style={{ color: "red", opacity: warningOpacity }}>
              unable to log in, please try again
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>
    </View>
  );
  return (
    <SafeAreaView>
      {isLoading ? <ActivityIndicator /> : renderLogin}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },

  image: {
    marginBottom: 20,
    width: 300,
    height: 300
  },

  inputView: {
    backgroundColor: "#f7eab7",
    //backgroundColor: "#fff",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 10,
    alignItems: "center"
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20
  },

  forgot_button: {
    height: 30
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#1E792C"
  },
  loginText: {
    fontWeight: "bolder",
    color: "#fff"
  }
});

export default WelcomePage;
