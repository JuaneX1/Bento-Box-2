import {NavigationContainer} from '@react-navigation/native';
import HomeStack from '../Navigation/HomeStack';
import StartStack from '../Navigation/StartStack';
import { useAuth } from './AuthContext';


export const Router = () => {
//More explanations about "authData" below
const { authData } = useAuth();
  return (
    <NavigationContainer>
      {authData ? < HomeStack/> : <StartStack />}
    </NavigationContainer>
  );
};