import 'react-native-reanimated';
import { Image } from 'expo-image';
import { Text, View, TextInput, Platform, Pressable, StyleSheet, ScrollView } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Animated, { SharedValue, useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { useRef, useState, useEffect } from 'react';
import MainBackground from '@/components/main-background';

type SettingsProps = {
  isActive?: boolean;
  onLogin: (value: boolean) => void
};

export default function Settings({isActive, onLogin}: SettingsProps){
    const [isLoggedIn, setIsLoggedIn] = useState(false) //Main access for debug <= dont use index's

    function fadeIn(is_first_button: boolean){
        return useAnimatedStyle(()=>({
            opacity: withTiming( isActive? ( is_first_button ? 1 : (isLoggedIn? 0 : 1)) : 0 , {duration: 500})
        }))
    }

    useEffect(() => {
        onLogin(isLoggedIn)
    }, [isLoggedIn]);

    //Complete these functions before comp (High Prio)

    function log_in(){

    }

    function log_out(){

    }

    function check_is_logged_in(){

    }

    function sign_up(){

    }

    function update_data(){

    }


    return (
        <View style={styles.mainContainer} >
            <Animated.View style={[styles.login,{}, fadeIn(true)]}>
                <Pressable style={[,{height: '100%'}]} onPress={() => setIsLoggedIn(true)}>
                    <Text style={[styles.loginText]}>{isLoggedIn? "Log out" : "Log in"}</Text>
                </Pressable>
            </Animated.View>
            <Animated.View style={[styles.login,{top: '-27%'}, fadeIn(false)]}>
                <Pressable style={[,{height: '100%'}]} onPress={() => alert("hi")}>
                    <Text style={[styles.loginText]}>Sign up</Text>
                </Pressable>
            </Animated.View>
            
            <Text style={[styles.inputTitle, {}]}>Your name</Text>
            <TextInput id="myInput" placeholder="Enter something" value ="Paul" style={[styles.inputField, {}]}/>
            <TextInput id="myInput" placeholder="Enter something" value ="Paul" style={[styles.inputField, {}]}/>
            <TextInput id="myInput" placeholder="Enter something" value ="Paul" style={[styles.inputField, {}]}/>
            <TextInput id="myInput" placeholder="Enter something" editable = {false} value ="Paul" style={[styles.inputField, {opacity : 0.5}]}/>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        marginTop: '15%',
        height: '100%',
        width: '100%',
    },
    inputField:{
        width: '80%',
        left: '10%',
        height: '6%',
        backgroundColor: 'green',
        borderWidth: 10,
        borderRadius: 5,
        borderColor: 'green',
        color: 'black',
        marginTop: '3%',
        marginBottom: '5%',
        fontSize: 20,
        fontFamily: ''
    },
    inputTitle:{
        left: '10%',
        fontSize: 15
    },
    login: {
        top: '-35%',
        position: 'absolute',
        alignSelf: 'center',
        height: 40,
        width: '50%',
        left: '25%',
        backgroundColor: 'white',
        borderRadius: 25
    },
    loginText: {
        fontWeight: '600',
        fontSize: 30,
        textAlign: 'center',
        height: '100%',
    }


})