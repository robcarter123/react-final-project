import React from 'react'
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

let positiveArr = []
let negativeArr = []

const Users = [
  {id:"1", uri: require('./assets/present.jpeg'), keyword: 'present1'},
  {id:"2", uri: require('./assets/present2.jpeg'), keyword: 'present2'},
  {id:"3", uri: require('./assets/present3.jpeg'), keyword: 'present3'},
  {id:"4", uri: require('./assets/present4.jpeg'), keyword: 'present4'},
  {id:"5", uri: require('./assets/present5.jpeg'), keyword: 'present5'}
]

export default class App extends React.Component {

    constructor(){
      super()

      this.position = new Animated.ValueXY()
      
      this.state = {
        currentIndex: 0,
        keyword: Users[0]['keyword']
      }

      this.rotate = this.position.x.interpolate({
        inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
        outputRange:['-10deg','0deg','10deg'],
        extrapolate: 'clamp',
      })

      this.rotateAndTranslate = {
        transform:[{
          rotate: this.rotate
        },
      ...this.position.getTranslateTransform()
        ]
      }

      this.likeOpacity = this.position.x.interpolate({
        inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
        outputRange:[0,0,1],
        extrapolate: 'clamp',
      })

      this.dislikeOpacity = this.position.x.interpolate({
        inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
        outputRange:[1,0,0],
        extrapolate: 'clamp',
      })

      this.nextCardOpacity = this.position.x.interpolate({
          inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
          outputRange:[1,0,1],
          extrapolate: 'clamp',
      })

      this.nextCardScale = this.position.x.interpolate({
        inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
        outputRange:[1,0.8,1],
        extrapolate: 'clamp',
    })

    }

    componentWillMount(){
      this.PanResponder = PanResponder.create({
        
        onStartShouldSetPanResponder:(evt,gestureState) => true,
        onPanResponderMove:(evt,gestureState) => {
          this.position.setValue({x:gestureState.dx,y: gestureState.dy})
        },
        onPanResponderRelease:(evt,gestureState) => {
          //Potential for logical coding
          if(gestureState.dx>120){
            Animated.spring(this.position,{toValue:{x:SCREEN_WIDTH+100,y:gestureState.dy}
            }).start(()=>{
              this.setState({currentIndex:this.state.currentIndex+1,keyword: Users[this.state.currentIndex]['keyword']},()=>{
                positiveArr.push('gift '+ this.state['keyword'])
                console.log(positiveArr)
                this.position.setValue({x:0,y:0})
              })
            })
          }
          else if(gestureState.dx < -120){
            Animated.spring(this.position,{toValue:{x:-SCREEN_WIDTH-100,y:gestureState.dy}
            }).start(()=>{
              this.setState({currentIndex:this.state.currentIndex+1,keyword: Users[this.state.currentIndex]['keyword']},()=>{
                negativeArr.push('gift ' + this.state['keyword'])
                console.log(negativeArr)
                this.position.setValue({x:0,y:0})
              })
            })
          }
          else{
            Animated.spring(this.position,{
              toValue:{x:0,y:0},
              friction:4
            }).start()
          }
        }
      })
    }

  renderUsers = () => {
    return Users.map((item,i) => {

      if(i < this.state.currentIndex)
      {
        return null
      } else if(i == this.state.currentIndex) {
      return (
        <Animated.View 
        {...this.PanResponder.panHandlers}
        key={item.id} style={[this.rotateAndTranslate,
          { height:SCREEN_HEIGHT-120, width:SCREEN_WIDTH, 
          padding:10, position:'absolute'}]}>

            <Animated.View style={{opacity:this.likeOpacity, transform:[{rotate: '-30deg'}], position: 'absolute', top:50,left:40,zIndex:1000}}>
              <Text style = {{borderWidth:1,borderColor:'green',
            color:'green',fontSize:32, fontWeight:'800', padding:10}}
            >LIKE</Text>
            </Animated.View>

            <Animated.View style={{opacity:this.dislikeOpacity,transform:[{rotate: '30deg'}], position: 'absolute', top:50,right:40,zIndex:1000}}>
              <Text style = {{borderWidth:1,borderColor:'red',
            color:'red',fontSize:32, fontWeight:'800', padding:10}}
            >NOPE</Text>
            </Animated.View>

            <Image
              style={{flex:1, height: null, width:null, resizeMode: 'cover',
              borderRadius:20}}
              source={item.uri} />
            
          </Animated.View>
      )
    }
    else {
      return (
        <Animated.View 
        key={item.id} style={[{opacity:this.nextCardOpacity,transform:[{scale:this.nextCardScale}],
          height:SCREEN_HEIGHT-120, width:SCREEN_WIDTH, 
          padding:10, position:'absolute'}]}>

            <Image
              style={{flex:1, height: null, width:null, resizeMode: 'cover',
              borderRadius:20}}
              source={item.uri} />
            
          </Animated.View>
      )
    }
  }).reverse()
}

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{height:60}}>

        </View>
        <View style={{flex:1}}>
          {this.renderUsers()}
        </View>
        <View style={{height:60}}>

        </View>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});