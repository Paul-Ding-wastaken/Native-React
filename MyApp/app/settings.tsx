import 'react-native-reanimated';
import { Image } from 'expo-image';
import { Text, View, TextInput, Platform, Pressable, StyleSheet, ScrollView } from 'react-native';
import Animated, { SharedValue, useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { useRef, useState, useEffect, useContext } from 'react';
import { auth, googleProvider } from '@/firebase';
import { GoogleAuthProvider, signInWithCredential, getAuth } from "firebase/auth";
import { db } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import UserContext from "./user";

type SettingsProps = {
    isActive?: boolean;
    onLogin: (value: boolean) => void
};

export default function Settings({ isActive, onLogin }: SettingsProps) {
    const user = useContext(UserContext);



    const [isLoggedIn, setIsLoggedIn] = useState(true) //Main access for debug <= dont use index's
    const isLoginPage = useSharedValue(0);
    const isSignUpPage = useSharedValue(0);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signUpName, setSignUpName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpPasswordVer, setSignUpPasswordVer] = useState("");

    function fadeIn(is_first_button: boolean) {
        return useAnimatedStyle(() => ({
            opacity: withTiming(isActive ? (is_first_button ? 1 : (isLoggedIn ? 0 : 1)) : 0, { duration: 500 })
        }))
    }

    function loginIn() {
        return useAnimatedStyle(() => ({
            opacity: withTiming(isLoginPage.value * 1, { duration: 250, easing: Easing.inOut(Easing.ease) })
        }))
    }

    function signinIn() {
        return useAnimatedStyle(() => ({
            opacity: withTiming(isSignUpPage.value * 1, { duration: 250, easing: Easing.inOut(Easing.ease) })
        }))
    }

    async function signUp(email: string, password: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            user.setUser(userCredential.user);
            setIsLoggedIn(true);
            isSignUpPage.value = 0;
        } catch (error: any) {
            console.error("Signup error:", error.message);
        }
    }

    async function logIn(loginEmail: string, loginPassword: string) {

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );

            user.setUser(userCredential.user);
            setIsLoggedIn(true);
            isLoginPage.value = 0;
        } catch (error: any) {
            alert("Login error: " + error.message);
        }

    }


    useEffect(() => {
        onLogin(isLoggedIn)
    }, [isLoggedIn]);


    function log_in(x: number) {
        if (x == 1) {
            logIn(loginEmail, loginPassword);
        } else if (x == 2) {

        }
    }

    function log_out() {
        user.setUser(null);
        isLoggedIn ? setIsLoggedIn(false) : null;
    }

    function check_is_logged_in() {
       if(user.user != null) {
        setIsLoggedIn(true);
        isLoginPage.value = 0;
       }
    }

    function sign_up(x: number) {
        if (x == 1) {
            signUp(signUpEmail, signUpPassword);
        } else if (x == 2) {

        }
    }

    function update_data() {

    }


    return (
        <View style={styles.mainContainer} >
            <Animated.View style={[styles.login, {}, fadeIn(true)]}>
                <Pressable style={[, { height: '100%' }]} onPress={() => { isLoggedIn ? log_out() : isLoginPage.value = 1; }}>
                    <Text style={[styles.loginText]}>{isLoggedIn ? "Log out" : "Log in"}</Text>
                </Pressable>
            </Animated.View>
            <Animated.View style={[styles.login, { top: '-27%' }, fadeIn(false)]}>
                <Pressable style={[, { height: '100%' }]} onPress={() => { isSignUpPage.value = 1; }}>
                    <Text style={[styles.loginText]}>Sign up</Text>
                </Pressable>
            </Animated.View>

            <Animated.View style={[styles.loginPage, { top: '-90%' }, loginIn()]}>
                <TextInput onChangeText={(newtext) => setLoginEmail(newtext)} id="loginEmail" placeholder="Email" style={[styles.loginInput,]} />
                <TextInput onChangeText={(newtext) => setLoginPassword(newtext)} id="loginPassword" placeholder="Password" style={[styles.loginInput, {}]} secureTextEntry={true} />
                <Pressable onPress={() => {check_is_logged_in(); log_in(1)}} style={[styles.loginInput, { backgroundColor: 'transparent', height: '5%', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>Submit</Text>
                </Pressable>
                <View style={[styles.loginInput, { top: '10%', gap: 10, borderWidth: 0, backgroundColor: 'transparent', height: '5%', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={[{}]}> --- or sign in with ---</Text>
                    <Pressable onPress={() => log_in(2)}>
                        <Image source={require('@/assets/images/googleSignInButton1.png')} style={{ width: 200, height: 50, borderRadius: 10 }} />
                    </Pressable>
                </View>
                <Pressable style={[, { position: 'absolute', bottom: '5%', height: '5%', justifyContent: 'center', alignItems: 'center' }]} onPress={() => { isLoginPage.value = 0; }}>
                    <Text style={[, { textDecorationLine: "underline", fontSize: 20, color: 'gray' }]}>Back</Text>
                </Pressable>
            </Animated.View>

            <Animated.View style={[styles.loginPage, { top: '-90%' }, signinIn()]}>
                <TextInput onChangeText={(newText) => setSignUpName(newText)} id="Name" placeholder="Name" style={[styles.loginInput,]} />
                <TextInput onChangeText={(newText) => setSignUpEmail(newText)} id="signUpEmail" placeholder="Email" style={[styles.loginInput,]} />
                <TextInput onChangeText={(newText) => setSignUpPassword(newText)} id="signUpPassword" placeholder="Password" style={[styles.loginInput, {}]} secureTextEntry={true} />
                <TextInput onChangeText={(newText) => setSignUpPasswordVer(newText)} id="signUpPasswordVer" placeholder="Re-enter Password" style={[styles.loginInput, {}]} secureTextEntry={true} />
                <Pressable onPress={() => { sign_up(1) }} style={[styles.loginInput, { backgroundColor: 'transparent', height: '5%', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>Submit</Text>
                </Pressable>
                <View style={[styles.loginInput, { top: '10%', gap: 10, borderWidth: 0, backgroundColor: 'transparent', height: '5%', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={[{}]}> --- or sign up with ---</Text>
                    <Pressable onPress={() => log_in(2)}>
                        <Image source={require('@/assets/images/googleSignInButton1.png')} style={{ width: 200, height: 50, borderRadius: 10 }} />
                    </Pressable>
                </View>
                <Pressable style={[, { position: 'absolute', bottom: '5%', height: '5%', justifyContent: 'center', alignItems: 'center' }]} onPress={() => { isSignUpPage.value = 0; }}>
                    <Text style={[, { textDecorationLine: "underline", fontSize: 20, color: 'gray' }]}>Back</Text>
                </Pressable>


            </Animated.View>
        {/* 
            <Text style={[styles.inputTitle, {}]}>Your name</Text>
            <TextInput id="myInput" placeholder="Enter something" value="Paul" style={[styles.inputField, {}]} />
            <TextInput id="myInput" placeholder="Enter something" editable={false} value="Paul" style={[styles.inputField, { opacity: 0.5 }]} />
        */}
            </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: '15%',
        height: '100%',
        width: '100%',
    },
    inputField: {
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
    inputTitle: {
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
    },
    loginPage: {
        height: '70%',
        width: '80%',
        left: '10%',
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
    },
    loginInput: {
        height: '6%',
        width: '80%',
        marginTop: '5%',
        backgroundColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'gray',
        color: 'black',
        paddingHorizontal: 10,
        fontSize: 16,
        top: '5%'
    }


})