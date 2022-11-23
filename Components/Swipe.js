import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-navigation-stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import {
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  Linking,
} from "react-native";
import { Button } from "react-native";
import { fetchItemsFromEbay, postWordToModel } from "../api.js";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Swipe = ({ navigation }) => {
  let likesArr = navigation.state.params.positiveCategories;

  const [positiveArr, setPositiveArr] = useState(
    likesArr.map((word) => {
      return [word, 0.5];
    })
  );
  // [
  //   ["doll", 0.7578607797622681],
  //   ["shoe", 0.7505601048469543],
  //   ["dolls", 0.7128548622131348],
  //   ["handbag", 0.6836262941360474],
  //   ["boots", 0.6653067469596863],
  //   ["shoes", 0.6612709760665894],
  //   ["candy", 0.6533358693122864],
  //   ["jewelry", 0.6434913277626038],
  //   ["denim", 0.6392609477043152],
  //   ["wig", 0.6287851929664612],
  //   ["test", 0.9],
  // ]

  const [historyState, setHistoryState] = useState([]);

  const [state, setState] = useState({});

  const [count, setCount] = useState(0);
  const [modelCount, setModelCount] = useState(0);
  const [Users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const positiveForm = [["candles", 0.5]];
  let negativeArr = navigation.state.params.negativeCategories;

  const [position, setPosition] = useState(new Animated.ValueXY());
  const [rotate, setRotate] = useState(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp",
    })
  );
  const [rotateAndTranslate, setRotateAndTranslate] = useState({
    transform: [
      {
        rotate: rotate,
      },
      ...position.getTranslateTransform(),
    ],
  });
  const [likeOpacity, setLikeOpacity] = useState(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    })
  );
  useEffect(() => {
    if (modelCount === 3) {
      postWordToModel(positiveArr).then(({ keywords: [one, two] }) => {
        setPositiveArr((current) => {
          let newArr = [...current];
          for (let i = 0; i < newArr.length; i++) {
            console.log(two);
            if (newArr[i][1] < two[1]) {
              newArr.splice(i, 0, two);
              break;
            }
          }
          return newArr;
        });

        setModelCount(0);
      });
    }
  }, [modelCount]);

  useEffect(() => {
    setIsLoading(true);
    fetchItemsFromEbay(positiveArr).then((items) => {
      setUsers((current) => [...current, ...items]);
      setCount((current) => current + 1);
      setIsLoading(false);
      setState({
        currentIndex: 0,
        keyword: items[0]["keyword"],
        image: items[0].image.imageUrl,
        slug: items[0]["slug"],
      });
    });
  }, []);

  useEffect(() => {
    // if (count === 0) {
    //   console.log("in if block", count);

    //   console.log(Users, "users");
    //   // setCount((current) => current + 1);
    // }
    if (count === 4) {
      setIsLoading(true);
      fetchItemsFromEbay(positiveArr).then((items) => {
        setUsers((current) => {
          const newArr = [...current];
          setCount((current) => 1);
          return [...newArr, ...items];
        });
        setIsLoading(false);
      });
    }
  }, [count]);
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: "clamp",
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 0],
    extrapolate: "clamp",
  });

  const pressHandler = () => {
    navigation.navigate("History", { historyState });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
      setPosition(position);
    },
    onPanResponderRelease: (evt, gestureState) => {
      //Potential for logical coding
      if (gestureState.dx > 120) {
        Animated.spring(position, {
          toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
          useNativeDriver: true,
        }).start(() => {
          updateData();
        });
      } else if (gestureState.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
          useNativeDriver: true,
        }).start(() => {
          updateNegativeData();
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const checkIfGreaterOrLessThan = (i, arr) => {
    let start = false;
    let end = false;
    if (i === 0) start = true;
    if (i === arr.length - 1) end = true;
    console.log(arr);

    if (!start && arr[i][1] > arr[i - 1][1]) {
      setPositiveArr((current) => {
        const newArr = [...current];
        newArr[i] = newArr.splice(i - 1, 1, newArr[i]).flat();
        if (!checkIfGreaterOrLessThan(i - 1, newArr)) return newArr;
      });
    } else if (!end && arr[i][1] < arr[i + 1][1]) {
      setPositiveArr((current) => {
        const newArr = [...current];
        console.log(newArr[i]);
        newArr[i] = newArr.splice(i + 1, 1, newArr[i]).flat();
        if (!checkIfGreaterOrLessThan(i + 1, newArr)) return newArr;
      });
    } else return false;
  };

  const updateData = () => {
    console.log(positiveArr);
    setModelCount((current) => current + 1);
    setCount((current) => current + 1);
    setState((state) => {
      //trying optional chaining to avoid error when cards gone
      let count = 1;
      for (let i = 0; i < positiveArr.length; i++) {
        if (positiveArr[i][0] === state["keyword"]) {
          positiveArr[i][1] = positiveArr[i][1] + 0.1;
          checkIfGreaterOrLessThan(i, positiveArr);
          break;
        } else {
          count++;
        }
      }
      if (count === positiveArr.length + 1) {
        setPositiveArr((current) => {
          let newArr = [...current];
          for (let i = 0; i < newArr.length; i++) {
            if (newArr[i][1] > 0.2) {
              newArr.splice(i + 1, 0, [state["keyword"], 0.2]);
              break;
            }
          }
          console.log(newArr);
          return newArr;
        });
        // checkIfGreaterOrLessThan(0, [[state.keyword, 0.2], ...positiveArr]);
      }
      setHistoryState((current) => [
        ...current,
        { keyword: state.keyword, image: state.image, slug: state.slug },
      ]);
      return {
        currentIndex: state?.currentIndex + 1,
        keyword: Users?.[state?.currentIndex + 1]?.["keyword"],
        image: Users?.[state?.currentIndex + 1]?.image.imageUrl,
        slug: Users?.[state?.currentIndex + 1]?.["slug"],
      };
    });
    position.setValue({ x: 0, y: 0 });
    setPosition(position);
  };

  const updateNegativeData = () => {
    setModelCount((current) => current + 1);

    let count = 1;
    for (let i = 0; i < positiveArr.length; i++) {
      if (positiveArr[i][0] === state["keyword"]) {
        positiveArr[i][1] = positiveArr[i][1] - 0.1;
        checkIfGreaterOrLessThan(i, positiveArr);
        break;
      } else {
        count++;
      }
    }
    if (count === positiveArr.length + 1) {
      setPositiveArr((current) => {
        let newArr = [...current];
        for (let i = 0; i < newArr.length; i++) {
          if (newArr[i][1] > -0.2) {
            newArr.splice(i, 0, [state["keyword"], -0.2]);
            break;
          }
        }
        console.log(newArr);
        return newArr;
      });
    }
    setState((state) => {
      return {
        currentIndex: state?.currentIndex + 1,
        keyword: Users?.[state?.currentIndex + 1]?.["keyword"],
        image: Users?.[state?.currentIndex + 1]?.image.imageUrl,
        slug: Users?.[state?.currentIndex + 1]?.["slug"],
      };
    });
    position.setValue({ x: 0, y: 0 });
    setPosition(position);
  };

  const renderUsers = () => {
    return isLoading ? (
      <ActivityIndicator />
    ) : (
      Users.map((item, i) => {
        if (i < state.currentIndex) {
          return null;
        } else if (i == state.currentIndex) {
          return (
            <Animated.View
              {...panResponder.panHandlers}
              key={item.id}
              style={[
                rotateAndTranslate,
                {
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: "absolute",
                },
              ]}
            >
              <Animated.View
                style={{
                  opacity: likeOpacity,
                  transform: [{ rotate: "-30deg" }],
                  position: "absolute",
                  top: 50,
                  left: 40,
                  zIndex: 1000,
                }}
              >
                <Text style={styles.textLike}>LIKE</Text>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: dislikeOpacity,
                  transform: [{ rotate: "30deg" }],
                  position: "absolute",
                  top: 50,
                  right: 40,
                  zIndex: 1000,
                }}
              >
                <Text style={styles.textDislike}>NOPE</Text>
              </Animated.View>

              <Text
                style={styles.text}
                onPress={() => Linking.openURL(item.itemWebUrl)}
              >
                {item.title}
              </Text>
              <Text style={styles.text}>£{item.price.value}</Text>
              <Image
                style={styles.image}
                source={{
                  uri: item.image.imageUrl,
                }}
              />
            </Animated.View>
          );
        } else {
          return (
            <Animated.View
              key={item.id}
              style={[
                {
                  opacity: nextCardOpacity,
                  transform: [{ scale: nextCardScale }],
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: "absolute",
                },
              ]}
            >
              <Image
                style={styles.image}
                source={{
                  uri: item.image.imageUrl,
                }}
              />
            </Animated.View>
          );
        }
      }).reverse()
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 0 }}></View>
      <View style={styles.container}>{renderUsers()}</View>
      <View style={{ height: 0 }}></View>
      <Button onPress={pressHandler} title="confirm"></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#f7eab7",

    height: 0,
  },

  text: {
    color: "black",
    height: 10,
    flex: 0.2,
    padding: 0.1,
    bold: { fontWeight: "bold" },
    fontSize: 18,
    fontWeight: "600",
  },
  textLike: {
    borderWidth: 1,
    borderColor: "green",
    color: "green",
    fontSize: 32,
    fontWeight: "800",
    padding: 10,
  },
  textDislike: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
    fontSize: 32,
    fontWeight: "800",
    padding: 10,
  },

  image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: "contain",
    borderRadius: 40,
  },
});

export default Swipe;
