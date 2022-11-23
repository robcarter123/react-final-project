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
  TouchableOpacity
} from "react-native";
import { fetchItemsFromEbay, postWordToModel } from "../api.js";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Swipe = ({ navigation }) => {
  let likesArr = navigation.state.params.positiveCategories;

  const [positiveArr, setPositiveArr] = useState(
    likesArr.map(word => {
      return [word, 0.02];
    })
  );

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
    ["wig", 0.6287851929664612]
  ];

  const [count, setCount] = useState(0);
  const [modelCount, setModelCount] = useState(0);
  const [Users, setUsers] = useState([
    {
      itemId: "v1|155258419210|0",
      title:
        "Yankee Candle Gift Set (5 Piece) - Birthdays|Anniversary's|Christmas|Mothers Day",
      categories: [
        {
          categoryId: "46782",
          categoryName: "Candles & Tea Lights"
        },
        {
          categoryId: "11700",
          categoryName: "Home, Furniture & DIY"
        },
        {
          categoryId: "262975",
          categoryName: "Candles & Home Fragrance"
        }
      ],
      image: {
        imageUrl:
          "https://i.ebayimg.com/thumbs/images/g/sQsAAOSwMThjE2nG/s-l225.jpg"
      },
      price: {
        value: "16.99",
        currency: "GBP"
      },
      thumbnailImage: [
        {
          imageUrl: "https://i.ebayimg.com/images/g/sQsAAOSwMThjE2nG/s-l500.jpg"
        }
      ],
      shippingOptions: [
        {
          shippingCostType: "FIXED",
          shippingCost: {
            value: "0.00",
            currency: "GBP"
          }
        }
      ],
      buyingOptions: ["FIXED_PRICE"],
      itemWebUrl:
        "https://www.ebay.co.uk/itm/155258419210?hash=item24261f780a:g:sQsAAOSwMThjE2nG&amdata=enc%3AAQAHAAAA8H0A9hsnnX3dkJA%2BRZPcb6X%2FpnTaLQ3ZTSxBctJt3IPevNrNtt1fU%2FVoh52DvroLJyuPK6Lyh7%2F9FW6fqL1L6YMaAfkoP9jPdBVtHHNDaYMXzZtfGzvViMCSs54si81GLmElMyd%2BK6VglDoAmdrcRfTtnNSaAhJulqjVVAhk%2F79dC03EdHjzGSHwIqLGaXJtWpbqRrO5R1mRvRvZ%2BQ%2BkuZdlLpy%2FyU8eMyj8FFOVzUsS84gQIvECjKW1LaAEcupod7dYASCYi5hP12CVOgaZWjrIZPja1qDgeadKPq2EsxbeDm%2F4TGsHy57vHVNBU8sf%2Bg%3D%3D",
      additionalImages: [
        {
          imageUrl:
            "https://origin-galleryplus.ebayimg.com/ws/web/155258419210_2_0_1/225x225.jpg"
        },
        {
          imageUrl:
            "https://origin-galleryplus.ebayimg.com/ws/web/155258419210_3_0_1/225x225.jpg"
        },
        {
          imageUrl:
            "https://origin-galleryplus.ebayimg.com/ws/web/155258419210_4_0_1/225x225.jpg"
        },
        {
          imageUrl:
            "https://origin-galleryplus.ebayimg.com/ws/web/155258419210_5_0_1/225x225.jpg"
        },
        {
          imageUrl:
            "https://origin-galleryplus.ebayimg.com/ws/web/155258419210_6_0_1/225x225.jpg"
        },
        {
          imageUrl:
            "https://origin-galleryplus.ebayimg.com/ws/web/155258419210_7_0_1/225x225.jpg"
        }
      ],
      adultOnly: false,
      keyword: "candles+tea+lights"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const positiveForm = [["candles", 0.5]];
  let negativeArr = navigation.state.params.negativeCategories;

  const [position, setPosition] = useState(new Animated.ValueXY());
  const [rotate, setRotate] = useState(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp"
    })
  );
  const [rotateAndTranslate, setRotateAndTranslate] = useState({
    transform: [
      {
        rotate: rotate
      },
      ...position.getTranslateTransform()
    ]
  });
  const [likeOpacity, setLikeOpacity] = useState(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: "clamp"
    })
  );
  // useEffect(() => {
  //   if (modelCount === 3) {
  //     postWordToModel(likesArr, negativeArr).then((data) => {
  //       likesArr.push(...data.keywords);
  //     });
  //   }
  // }, [modelCount]);

  useEffect(() => {
    setIsLoading(true);
    fetchItemsFromEbay(positiveArr).then(items => {
      setUsers(current => [...current, ...items]);
      setCount(current => current + 1);
      setIsLoading(false);
      setState({
        currentIndex: 0,
        keyword: items[0]["keyword"],
        image: items[0].image.imageUrl,
        slug: items[0]["slug"]
      });
    });
  }, []);

  useEffect(() => {
    console.log("in useEffect");
    console.log(modelCount, "modelcount in useffect");
    // if (count === 0) {
    //   console.log("in if block", count);

    //   console.log(Users, "users");
    //   // setCount((current) => current + 1);
    // }
    if (count === 4) {
      setIsLoading(true);
      fetchItemsFromEbay(preferences).then(items => {
        setUsers(current => {
          const newArr = [...current];
          setCount(current => 1);
          return [...newArr, ...items];
        });
        setIsLoading(false);
      });
    }
  }, [count]);
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: "clamp"
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: "clamp"
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 0],
    extrapolate: "clamp"
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
          useNativeDriver: true
        }).start(() => {
          updateData();
        });
      } else if (gestureState.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
          useNativeDriver: true
        }).start(() => {
          updateNegativeData();
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: true
        }).start();
      }
    }
  });

  const updateData = () => {
    console.log(state);
    setModelCount(current => current + 1);
    console.log(Users, "<<<<<USers");
    setCount(current => current + 1);
    setState(state => {
      //trying optional chaining to avoid error when cards gone
      // let count = 1;
      for (let i = 0; i < positiveArr.length; i++) {
        if (positiveArr[i][0] === state["keyword"]) {
          positiveArr[i][1] = positiveArr[i][1] + 0.02;
          break;
        } else {
          // count++;
        }
      }
      if (count === positiveArr.length + 1) {
        console.log(state, "<<<<<<<<<<<<<<");
        positiveArr.push([state["keyword"], 0.02]);
        console.log(positiveArr);
      }
      setHistoryState(current => [
        ...current,
        { keyword: state.keyword, image: state.image, slug: state.slug }
      ]);
      return {
        currentIndex: state?.currentIndex + 1,
        keyword: Users?.[state?.currentIndex + 1]?.["keyword"],
        image: Users?.[state?.currentIndex + 1]?.image.imageUrl,
        slug: Users?.[state?.currentIndex + 1]?.["slug"]
      };
    });
    position.setValue({ x: 0, y: 0 });
    setPosition(position);
  };

  const updateNegativeData = () => {
    console.log(modelCount, "modelcount in updatedata");

    setState(state => {
      let count = 1;
      for (let i = 0; i < positiveArr.length; i++) {
        if (positiveArr[i][0] === state["keyword"]) {
          positiveArr[i][1] = positiveArr[i][1] - 0.01;
          break;
        } else {
          // count++;
        }
      }
      if (count === positiveArr.length + 1) {
        positiveArr.push([state["keyword"], -0.01]);
      }
      return {
        currentIndex: state?.currentIndex + 1,
        keyword: Users?.[state?.currentIndex + 1]?.["keyword"],
        image: Users?.[state?.currentIndex + 1]?.image.imageUrl,
        slug: Users?.[state?.currentIndex + 1]?.["slug"]
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
                  position: "absolute"
                }
              ]}
            >
              <Animated.View
                style={{
                  opacity: likeOpacity,
                  transform: [{ rotate: "-30deg" }],
                  position: "absolute",
                  top: 50,
                  left: 40,
                  zIndex: 1000
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
                  zIndex: 1000
                }}
              >
                <Text style={styles.textDislike}>NOPE</Text>
              </Animated.View>
              <View style={styles.card}>
                <Text
                  style={styles.textTitle}
                  onPress={() => Linking.openURL(item.itemWebUrl)}
                >
                  {`${item.title.substring(0, 30)}...`}
                </Text>
                <Text style={styles.textPrice}>£{item.price.value}</Text>
                <Image
                  style={styles.image}
                  source={{
                    uri: item.image.imageUrl
                  }}
                />
              </View>
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
                  position: "absolute"
                }
              ]}
            >
              <Image
                style={styles.image}
                source={{
                  uri: item.image.imageUrl
                }}
              />
            </Animated.View>
          );
        }
      }).reverse()
    );
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ height: 0 }}></View>
      <View style={styles.container}>{renderUsers()}</View>
      <View style={{ height: 0 }}></View>
      <TouchableOpacity style={styles.submitBtn} onPress={pressHandler}>
        <Text style={styles.submitText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    display: "flex",
    flex: 1,
    backgroundColor: "#F7EAB7",
    borderRadius: 10
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "600",
    alignItems: "center",
    margin: 20
  },
  textPrice: {
    fontSize: 20,
    fontWeight: "600",
    alignItems: "center",
    marginHorizontal: 20
  },
  image: {
    alignSelf: "center",
    marginVertical: 20,
    height: "66%",
    width: "66%"
  },
  textLike: {
    borderWidth: 1,
    borderColor: "green",
    color: "green",
    fontSize: 32,
    fontWeight: "800",
    padding: 10
  },
  textDislike: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
    fontSize: 32,
    fontWeight: "800",
    padding: 10
  },
  submitBtn: {
    display: "flex",
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 5,
    backgroundColor: "#1E792C"
  }
});

export default Swipe;
