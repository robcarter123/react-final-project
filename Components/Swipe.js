import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-navigation-stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, ImageBackground } from "react-native";
import {
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  Linking,
  TouchableOpacity,
  Button,
} from "react-native";
import { fetchItemsFromEbay, postWordToModel } from "../api.js";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Swipe = ({ navigation }) => {
  let likesArr = navigation.state.params.positiveCategories;
  const recipient = navigation.state.params.recipient;

  const [positiveArr, setPositiveArr] = useState(
    likesArr.map((word) => {
      return [word, 0.5];
    })
  );

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
  // useEffect(() => {
  //   if (modelCount === 3) {
  //     postWordToModel(positiveArr).then(({ keywords: [one, two] }) => {
  //       setPositiveArr((current) => {
  //         let newArr = [...current];
  //         for (let i = 0; i < newArr.length; i++) {
  //           console.log(two);
  //           if (newArr[i][1] < two[1]) {
  //             newArr.splice(i, 0, two);
  //             break;
  //           }
  //         }
  //         return newArr;
  //       });

  //       setModelCount(0);
  //     });
  //   }
  // }, [modelCount]);

  useEffect(() => {
    setIsLoading(true);
    fetchItemsFromEbay(positiveArr).then((items) => {
      setUsers((current) => [...current, ...items]);
      setCount((current) => current + 1);
      setIsLoading(false);
      setState({
        currentIndex: 0,
        keyword: items[0]["keyword"],
        name: items[0].title,
        image: items[0].image.imageUrl,
        price: items[0].price.value,
        itemWebUrl: items[0].itemWebUrl,
      });
    });
  }, []);

  useEffect(() => {
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
    navigation.navigate("History", { historyState, recipient });
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
    // console.log(Users[0].itemWebUrl);
    setModelCount((current) => current + 1);
    setCount((current) => current + 1);
    setState((state) => {
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
      }
      setHistoryState((current) => {
        console.log(state);
        return [
          ...current,
          {
            keyword: state.keyword,
            name: state.name,
            image: state.image,
            price: state.price,
            itemWebUrl: state.itemWebUrl,
          },
        ];
      });
      console.log(historyState, "<<<<<<<<<<<<<history");
      return {
        currentIndex: state?.currentIndex + 1,
        keyword: Users?.[state?.currentIndex + 1]?.["keyword"],
        name: Users?.[state?.currentIndex + 1]?.title,
        image: Users?.[state?.currentIndex + 1]?.image.imageUrl,
        price: Users?.[state?.currentIndex + 1]?.price.value,
        itemWebUrl: Users?.[state?.currentIndex + 1]?.itemWebUrl,
      };
    });
    position.setValue({ x: 0, y: 0 });
    setPosition(position);
  };

  const updateNegativeData = () => {
    setModelCount((current) => current + 1);
    setCount((current) => current + 1);

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
        return newArr;
      });
    }
    setState((state) => {
      return {
        currentIndex: state?.currentIndex + 1,
        keyword: Users?.[state?.currentIndex + 1]?.["keyword"],
        name: Users?.[state?.currentIndex + 1]?.title,
        image: Users?.[state?.currentIndex + 1]?.image.imageUrl,
        price: Users?.[state?.currentIndex + 1]?.price.value,
        itemWebUrl: Users?.[state?.currentIndex + 1]?.itemWebUrl,
      };
    });
    position.setValue({ x: 0, y: 0 });
    setPosition(position);
  };

  const renderUsers = () => {
    return isLoading ? (
      <ActivityIndicator />
    ) : (
      Users.map((item, i) =>
        i === state.currentIndex ? (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.price.value}
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
                left: -100,
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
                right: -120,
                zIndex: 1000,
              }}
            >
              <Text style={styles.textDislike}>NOPE</Text>
            </Animated.View>
            <View style={styles.card}>
              <Text
                style={styles.textTitle}
                onPress={() => Linking.openURL(item.itemWebUrl)}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text style={styles.textPrice}>£{item.price.value}</Text>
              <Image
                style={styles.image}
                source={
                  {
                    uri: item.image.imageUrl,
                  }
                }
              />
            </View>
          </Animated.View>
        ) : null
      ).reverse()
    );
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      {/* <ImageBackground
        source={require("../images/background.jpg")}
        resizeMode="cover"
      >
        <View> */}
      <View style={{ height: 0 }}></View>
      <View style={styles.container}>{renderUsers()}</View>
      <View style={{ height: 0 }}></View>
      <TouchableOpacity style={styles.submitBtn} onPress={pressHandler}>
        <Text style={styles.submitText}>View Your Liked Items</Text>
      </TouchableOpacity>
      {/* </View>
      </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#F7EAB7",
    borderWidth: "5px",
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "600",
    alignItems: "center",
    margin: 20,
  },
  textPrice: {
    fontSize: 20,
    fontWeight: "600",
    alignItems: "center",
    marginHorizontal: 20,
  },
  image: {
    alignSelf: "center",
    marginVertical: 20,
    height: "66%",
    width: "66%",
    resizeMode: "contain",
    borderRadius: 13,
    // borderWidth: "2px",
    backgroundColor: "#fff",
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
  submitBtn: {
    display: "flex",
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 5,
    backgroundColor: "#1E792C",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bolder",
  },
});

export default Swipe;
