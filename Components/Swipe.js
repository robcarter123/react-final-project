import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder,
} from "react-native";
import { fetchItemsFromEbay } from "../api.js";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

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

const Swipe = ({ navigation }) => {
  const [count, setCount] = useState(0);

  const [Users, setUsers] = useState([
    // { id: "1", uri: require("../assets/present.jpeg"), keyword: "present1" },
    // { id: "2", uri: require("../assets/present2.jpeg"), keyword: "present2" },
    // { id: "3", uri: require("../assets/present3.jpeg"), keyword: "present3" },
    // { id: "4", uri: require("../assets/present4.jpeg"), keyword: "present4" },
    // { id: "5", uri: require("../assets/present5.jpeg"), keyword: "present5" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const positiveForm = [["candles", 0.5]];
  let positiveArr = navigation.state.params.positiveML;
  let negativeArr = navigation.state.params.negativeCategories;

  const [state, setState] = useState({
    // currentIndex: 0,
    // keyword: Users[0]["keyword"],
  });
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
  const [positive, setPositive] = useState(false);
  const [negative, setNegative] = useState(false);

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
    setState((state) => {
      positiveArr.push("gift " + state["keyword"]);
      //trying optional chaining to avoid error when cards gone
      return {
        currentIndex: state?.currentIndex + 1,
        keyword: Users?.[state?.currentIndex + 1]?.["keyword"],
      };
    });
    position.setValue({ x: 0, y: 0 });
    setPosition(position);
  };

  const updateNegativeData = () => {
    setState((state) => {
      negativeArr.push("gift " + state["keyword"]);
      return {
        currentIndex: state?.currentIndex + 1,
        keyword: Users?.[state?.currentIndex + 1]?.["keyword"],
      };
    });
    position.setValue({ x: 0, y: 0 });
    setPosition(position);
  };

  useEffect(() => {
    if (count === 0) {
      setIsLoading(true);
      fetchItemsFromEbay(positiveForm).then((items) => {
        setUsers((current) => {
          const newArr = [...current];
          console.log(newArr);
          setCount((current) => current + 1);
          return [...newArr, ...items];
        });
        setIsLoading(false);
        console.log(Users);
        setState({ currentIndex: 0, keyword: items[0]["keyword"] });
      });
    }
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
  });

  const renderUsers = () => {
    return Users.map((item, i) => {
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

            <Image
              style={{
                flex: 1,
                height: null,
                width: null,
                resizeMode: "cover",
                borderRadius: 20,
              }}
              source={item.uri}
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
              source={item.uri || item.image.imageUrl}
            />
          </Animated.View>
        );
      }
    }).reverse();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60 }}></View>
      <View style={{ flex: 1 }}>{renderUsers()}</View>
      <View style={{ height: 60 }}></View>
    </View>
  );
};

export default Swipe;
