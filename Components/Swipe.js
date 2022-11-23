import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-navigation-stack";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
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
  let positiveArr = navigation.state.params.positiveCategories;

  let newPosArr = [
    [positiveArr[0], 0.02],
    [positiveArr[1], 0.02],
    [positiveArr[2], 0.02],
  ];

  const [historyState, setHistoryState] = useState([]);
  console.log(historyState, "historyState");

  const [state, setState] = useState({});

  const preferences = [
    ["doll", 0.7578607797622681],
    ["shoe", 0.7505601048469543],
    ["dolls", 0.7128548622131348],
    ["handbag", 0.6836262941360474],
    ["boots", 0.6653067469596863],
    ["shoes", 0.6612709760665894],
    ["candy", 0.6533358693122864],
    ["jewelry", 0.6434913277626038],
    ["denim", 0.6392609477043152],
    ["wig", 0.6287851929664612],
  ];

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
  const [dislikeOpacity, setdislikeOpacity] = useState(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: "clamp",
    })
  );
  const [nextCardOpacity, setNextCardOpacity] = useState(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: "clamp",
    })
  );
  const [nextCardScale, setNextCardScale] = useState(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 0],
      extrapolate: "clamp",
    })
  );

  const pressHandler = () => {
    navigation.navigate("History", { historyState });
  };

  const [panResponder, setPanResponder] = useState(
    PanResponder.create({
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
    })
  );

  const updateData = () => {
    setCount((current) => current + 1);
    setModelCount((current) => current + 1);
    setState((state) => {
      //trying optional chaining to avoid error when cards gone
      let count = 1;
      for (let i = 0; i < newPosArr.length; i++) {
        if (newPosArr[i][0] === state["keyword"]) {
          newPosArr[i][1] = newPosArr[i][1] + 0.02;
          console.log(newPosArr);
          break;
        } else {
          count++;
        }
      }
      if (count === newPosArr.length + 1) {
        newPosArr.push([state["keyword"], 0.02]);
        console.log(newPosArr);
      }
      setHistoryState((current) => [
        ...current,
        { keyword: state.keyword, image: state.image, slug: state.slug },
      ]);
      console.log(Users, "currentIndex");
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
    setState((state) => {
      let count = 1;
      for (let i = 0; i < newPosArr.length; i++) {
        if (newPosArr[i][0] === state["keyword"]) {
          newPosArr[i][1] = newPosArr[i][1] - 0.01;
          console.log(newPosArr);
          break;
        } else {
          count++;
        }
      }
      if (count === newPosArr.length + 1) {
        newPosArr.push([state["keyword"], -0.01]);
        console.log(newPosArr);
      }
      console.log(state.currentIndex, "currentIndex");
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

  useEffect(() => {
    if (modelCount === 3) {
      postWordToModel(positiveArr, negativeArr).then((data) => {
        positiveArr.push(...data.keywords);
        console.log(positiveArr);
      });
    }
  }, [modelCount]);

  useEffect(() => {
    setIsLoading(true);
    fetchItemsFromEbay(positiveArr).then((items) => {
      setUsers((current) => items);
      setCount((current) => current + 1);
      setIsLoading(false);
      console.log(Users, "Users");
      setState({
        currentIndex: 0,
        keyword: items[0]["keyword"],
        image: items[0].image.imageUrl,
        slug: items[0]["slug"],
      });
    });
  }, []);

  useEffect(() => {
    // console.log(count);
    // if (count === 0) {
    //   console.log("in if block", count);

    //   console.log(Users, "users");
    //   // setCount((current) => current + 1);
    // }
    if (count === 4) {
      setIsLoading(true);
      fetchItemsFromEbay(preferences).then((items) => {
        setUsers((current) => {
          const newArr = [...current];
          setCount((current) => 1);
          return [...newArr, ...items];
        });
        setIsLoading(false);
      });
    }
  }, [count]);

  const renderUsers = () => {
    return isLoading ? (
      <Text>hello</Text>
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
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: "green",
                    color: "green",
                    fontSize: 32,
                    fontWeight: "800",
                    padding: 10,
                  }}
                >
                  LIKE
                </Text>
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
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: "red",
                    color: "red",
                    fontSize: 32,
                    fontWeight: "800",
                    padding: 10,
                  }}
                >
                  NOPE
                </Text>
              </Animated.View>
              <Text
                style={{ color: "blue" }}
                onPress={() => Linking.openURL(item.itemWebUrl)}
              >
                {item.title}
              </Text>
              <Text>£{item.price.value}</Text>
              <Image
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  resizeMode: "cover",
                  borderRadius: 20,
                }}
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
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  resizeMode: "cover",
                  borderRadius: 20,
                }}
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
      <View style={{ height: 60 }}></View>
      <View style={{ flex: 1 }}>{renderUsers()}</View>
      <View style={{ height: 60 }}></View>
      <Button onPress={pressHandler} title="hello">
        Hello
      </Button>
    </View>
  );
};

export default Swipe;
