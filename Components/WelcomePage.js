import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import { fetchUsers } from "../utils";

const WelcomePage = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const pressHandler = () => {
    //setErrorMessage("");
    //setIsLoading(true);
    console.log(user);
    console.log(password);

    fetchUsers()
      .then(data => {
        console.log(data);
        data.forEach(u => {
          console.log(u.username === user, u.password === password);
          if (u.username === user && u.password === password) {
            console.log("yay!");
            //setUser(username);
            navigation.navigate("PositiveCollectForm", { user });
            //setIsLoading(false);
          }
        });
      })
      .catch(() => {
        setErrorMessage("Unable to log in, please try again");
        setIsLoading(false);
        setUser("");
      });
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("./logo-square.png")} />

      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Username."
          placeholderTextColor="#003f5c"
          onChangeText={user => setUser(user)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={pressHandler}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  }
});

export default WelcomePage;

// import "./styles.css";

// import { useState, useContext } from "react";
// import { fetchUsers } from "../utils";

// import LoadingSpinner from "./LoadingSpinner";
// import UserLoginContext from "../context/UserLoginContext"

// const Login = () => {
//   const {user, setUser } = useContext(UserLoginContext);

//   const [username, setUsername] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleSubmit = event => {
//     event.preventDefault();
//     setErrorMessage("");
//     setIsLoading(true);
//     fetchUsers()
//       .then(data => {
//         data.map(user => {
//           if (user.username === username) {
//             setUser(username);
//             setSuccessMessage(`You are now logged in as ${username}`);
//             setUsername("");
//             setIsLoading(false);
//             return user;
//           }
//         });
//       })
//       .catch(() => {
//         setErrorMessage("Unable to log in, please try again");
//         setIsLoading(false);
//         setUsername("");
//       });
//   };

//   const renderLogin = (
//     <div className="loginForm">
//       <form onSubmit={handleSubmit}>
//         <label>
//           Username:
//           <input
//             required
//             name="username"
//             value={username}
//             onChange={event => setUsername(event.target.value)}
//           />
//         </label>
//         <button type="submit">Login</button>
//       </form>
//       <p className="success">{successMessage}</p>
//     </div>
//   );
//   return (
//     <div className="loginPoster">
//       {isLoading ? <LoadingSpinner /> : renderLogin}
//       {errorMessage && <div className="error">{errorMessage}</div>}
//     </div>
//   );
// };

// export default Login;
