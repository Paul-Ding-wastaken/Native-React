import 'react-native-reanimated';
import { Image } from 'expo-image';
import { Text, View, Platform, Pressable, StyleSheet, ScrollView } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Animated, { SharedValue, useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { useRef, useState, useEffect } from 'react';
import MainBackground from '@/components/main-background';
import Settings from './settings';

export default function testPage() {
    //Extra System Comps
    const curTime = new Date();
    const hours = curTime.getHours();
    const minutes = curTime.getMinutes();
    const seconds = curTime.getSeconds();


    //Core System Comps
    const offset = useSharedValue(0);
    const [enableSecondaryButton, setEnableSecondaryButton] = useState(true);
    const [enableMainButton, setEnableMainButton] = useState(true);
    const [systemActive, setSystemActive] = useState(false);
    const [systemText, setSystemText] = useState("System Off");
    const [systemTextColor, setSystemTextColor] = useState("red");
    const indexRef = useSharedValue(10);
    const mainSystemTextInterval = useRef<number | null>(null);
    const systemStateColor = useSharedValue(0);
    const secondaryButtonSelection = useSharedValue(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function secondaryButtonOnStart(axis: "x" | "y", distance: number, chosen: number) {
        return useAnimatedStyle(() => ({
            zIndex: secondaryButtonSelection.value == chosen ? 2 : -1,
            transform: [
                axis === "x"
                    ? { translateX: withDelay(250 + Math.pow(16, 1 - distance), withTiming(offset.value * 125 * distance, { duration: 500, easing: Easing.out(Easing.exp) })) }
                    : { translateY: withDelay(125 + Math.pow(16, 1 - distance), withTiming(offset.value * 125 * distance, { duration: 500, easing: Easing.out(Easing.exp) })) },
                { scale: withTiming(chosen == secondaryButtonSelection.value ? 2.1 : 1, { duration: 250, easing: Easing.out(Easing.exp) }) }
            ],
        }));
    }


    

    function clearSystemText(newText?: string, newTextColor?: string) {
        if (mainSystemTextInterval.current) clearInterval(mainSystemTextInterval.current);

        indexRef.value = systemText.length; // start from current text
        mainSystemTextInterval.current = setInterval(() => {
            indexRef.value -= 1;
            setSystemText((prev) => prev.slice(0, indexRef.value) + "_");

            if (indexRef.value <= 0) {
                setSystemText("");
                indexRef.value = 0;
                clearInterval(mainSystemTextInterval.current!);
                mainSystemTextInterval.current = null;
                changeSystemText(newText || ""); // start typing new text
                setSystemTextColor(newTextColor || "white");
            }
        }, 25) as unknown as number;
    }

    function changeSystemText(newText?: string) {
        if (mainSystemTextInterval.current) clearInterval(mainSystemTextInterval.current);

        indexRef.value = 0; // start from empty text
        mainSystemTextInterval.current = setInterval(() => {
            indexRef.value += 1;
            setSystemText(newText.slice(0, indexRef.value) + "_");

            if (indexRef.value >= newText.length) {
                setSystemText(newText);
                clearInterval(mainSystemTextInterval.current!);
                mainSystemTextInterval.current = null;
            }
        }, 25) as unknown as number;
    }


    function mainButtonOnStart() {
        return useAnimatedStyle(() => ({
            transform: [
                { scale: withTiming(1 + offset.value * 0.1, { duration: 300, easing: Easing.out(Easing.exp) }) },

            ],
        }));
    }

    function turnOnSystem() {
        offset.value = 1;
        systemStateColor.value = 1;
        setSystemActive(true);
        setEnableSecondaryButton(false);
        setTimeout(() => {
            setEnableSecondaryButton(true);
        }, 250);
        setEnableMainButton(false);
        setTimeout(() => {
            setEnableMainButton(true);
        }, 750);
        setSystemActive(true);
        clearSystemText("System On", 'rgba(28, 230, 61, 1)');
    }

    function shutOffSystem() {
        systemStateColor.value = 0;
        setEnableMainButton(false);
        setTimeout(() => {
            setEnableMainButton(true);
        }, 750);
        offset.value = 0;
        setEnableSecondaryButton(false);
        clearSystemText("System Off", "red");
        setSystemActive(false);
    }

    //Secondary button functions
    function onSettingPress() {
        if (secondaryButtonSelection.value == 0) {
            secondaryButtonSelection.value = 2;
            offset.value = 0;
            clearSystemText("Settings Opened", "yellow");
        } else {
            secondaryButtonSelection.value = 0;
            turnOnSystem();
        }
    }

    function onButton1Press() {
        if (secondaryButtonSelection.value == 0) {
            secondaryButtonSelection.value = 1;
            offset.value = 0;
            clearSystemText("Section_1 opened", "black");
        } else {
            secondaryButtonSelection.value = 0;
            turnOnSystem();
        }
    }
    function onButton3Press() {
        if (secondaryButtonSelection.value == 0) {
            secondaryButtonSelection.value = 3;
            offset.value = 0;
            clearSystemText("Section_3 Opened", "black");
        } else {
            secondaryButtonSelection.value = 0;
            turnOnSystem();
        }
    }
    function onButton4Press() {
        if (secondaryButtonSelection.value == 0) {
            secondaryButtonSelection.value = 4;
            offset.value = 0;
            clearSystemText("Section_4 Opened", "black");
        } else {
            secondaryButtonSelection.value = 0;
            turnOnSystem();
        }
    }

    //Color scheme for background
    let backGroundColors: [string, string] = ['#770c0cff', '#000'];
    let circleColor: [string, string] = ['rgba(243, 8, 8, 0)', 'rgba(0,0,0,1)'];
    let circleSize1: number = 200;
    switch (systemStateColor.value) {
        case 0:
            backGroundColors = ['#770c0cff', '#000'];
            circleColor = ['rgba(243, 8, 8, 0)', 'rgba(0,0,0,1)'];
            circleSize1 = 200;
            break;
        case 1:
            backGroundColors = ['#04c2f1ff', '#024b7cff'];
            circleColor = ['#1b88bbff', '#85dbfdff'];
            circleSize1 = 250;
            break;
        case 2:
            backGroundColors = ['#0044ff', '#222324ff'];
            break;
        default: // for erroring out
            backGroundColors = ['#000', '#000'];
            break;
    }

    return (
        <ScrollView
            bounces={false}          
            overScrollMode="never"   
            style={{ flex: 1 }}
            contentContainerStyle={{ height: secondaryButtonSelection.value == 0 ? '100%' : '200%' }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={100}
            scrollEnabled={secondaryButtonSelection.value != 0}
        >
            <MainBackground
                backgroundColors={backGroundColors}
                circleColors={circleColor}
                circleSize={circleSize1}
                isExtended={secondaryButtonSelection.value != 0}
            />
            <View style={[styles.mainContainer, { height: secondaryButtonSelection.value == 0 ? '100%' : '50%' }]}>

                <View style={styles.mainSystemTextContainer}>
                    <Text style={{ ...styles.mainSystemText, color: systemTextColor }}> {systemText} </Text>
                </View>


                <View style={styles.mainCenteredButtonContainer}>

                    <Animated.View style={[{ justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 1 }, mainButtonOnStart()]}>
                        <Pressable style={[styles.mainCenteredButton, { backgroundColor: systemActive ? 'white' : '#1e3470ff', }]} disabled={!enableMainButton || secondaryButtonSelection.value != 0} onPress={() => { systemActive ? shutOffSystem() : turnOnSystem(); }}>
                            <IconSymbol size={56} name="power" color={systemActive ? "green" : "red"} />
                        </Pressable>
                    </Animated.View>
                    <Animated.View
                        style={[styles.secondaryCenteredButtonAnimation, secondaryButtonOnStart("x", 1, 1)]}>
                        <Pressable disabled={!enableSecondaryButton || !isLoggedIn} style={[styles.secondaryCenterdButtons, {opacity: isLoggedIn? 1 : 0.5}]} onPress={() => onButton1Press()}>

                        </Pressable>
                    </Animated.View>
                    <Animated.View style={[styles.secondaryCenteredButtonAnimation, secondaryButtonOnStart("y", 1, 2)]}>
                        <Pressable disabled={!enableSecondaryButton} style={[styles.secondaryCenterdButtons]} onPress={() => { onSettingPress() }}>
                            <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                                <IconSymbol size={48} name="gear" color="white" />
                            </View>
                        </Pressable>
                    </Animated.View>
                    <Animated.View style={[styles.secondaryCenteredButtonAnimation, secondaryButtonOnStart("x", -1, 3)]}><Pressable disabled={!enableSecondaryButton} style={styles.secondaryCenterdButtons} onPress={() => onButton3Press()}></Pressable></Animated.View>
                    <Animated.View style={[styles.secondaryCenteredButtonAnimation, secondaryButtonOnStart("y", -1, 4)]}><Pressable disabled={!enableSecondaryButton} style={styles.secondaryCenterdButtons} onPress={() => onButton4Press()}></Pressable></Animated.View>

                </View >
            </View>
            <View style={[styles.settingContainer, { zIndex: secondaryButtonSelection.value == 1 ? 2 : -11 }]}>
                <View>
                    <Text>Section_1</Text>
                </View>
            </View>
            <View style={[styles.settingContainer, { zIndex: secondaryButtonSelection.value == 2 ? 2 : -11 }]}>
                   <Settings 
                   isActive = {secondaryButtonSelection.value == 2}
                   onLogin = {(val: boolean) => setIsLoggedIn(val)}
                   /> 
            </View>
            <View style={[styles.settingContainer, { zIndex: secondaryButtonSelection.value == 3 ? 2 : -11 }]}>
                <View>
                    <Text>Section_3</Text>
                </View>
            </View>
            <View style={[styles.settingContainer, { zIndex: secondaryButtonSelection.value == 4 ? 2 : -11 }]}>
                <View>
                    <Text>Section_4</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        top: 0,
        height: "100%",
        width: "100%",
    },
    mainSystemText: {
        textAlign: "center",
        width: "100%",
        fontSize: 24,
        fontWeight: '600',
    },
    mainSystemTextContainer: {
        position: 'absolute',
        width: '100%',
        height: '25%',
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainCenteredButton: {
        width: 120,
        height: 120,
        borderRadius: 120,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    mainCenteredButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
    },
    secondaryCenterdButtons: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#34C759',
        alignContent: 'center',
        justifyContent: 'center',
        zIndex: -1,
    },
    secondaryCenteredButtonAnimation: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        pointerEvents: 'box-none',
        zIndex: -1,
    },
    //Secondary sections here. Backgrounds take zIndex of 2 and all elements are ordered in index + 2
    settingContainer: {
        height: '50%',
        width: '100%',
        top: '50%',
        zIndex: -11,
        position: 'absolute'

    }
});