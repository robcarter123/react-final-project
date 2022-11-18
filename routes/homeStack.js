import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import PositiveCollectForm from '../Components/PositiveCollectForm';
import NegativeCollectForm from '../Components/NegativeCollectForm';
import Swipe from '../Components/Swipe';


const screens = {

    PositiveCollectForm: {
        screen: PositiveCollectForm
    },
    NegativeCollectForm: {
        screen: NegativeCollectForm
        },
    Swipe: {
        screen: Swipe
    }
    
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);