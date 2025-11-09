import 'react-native-reanimated';
import { Text, View, Platform, Pressable, StyleSheet, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Animated, { SharedValue, useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { useRef, useState, useEffect, useContext } from 'react';
import MainBackground from '@/components/main-background';
import Settings from './settings';
import UserContext from './user';
import API from './api';
import Entypo from '@expo/vector-icons/Entypo';
import Map from './map';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserContextProvider } from './userContextProvider';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import Info from './info';

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
    const user = useContext(UserContext);
    const [isEmergency, setIsEmergency] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

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

    async function requestPermissions() {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission not granted for notifications');
        }
    }

    async function sendNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🚨 Emergency Alert!",
                body: "This is a test notification",
                data: { info: "extra data here" },
            },
            trigger: null, 
        });
    }

    useEffect(() => {
        requestPermissions();
    }, []);

    const API_BASE = "https://magnolia-wearier-unsuccessfully.ngrok-free.dev"; // or your ngrok URL if deployed


    const fetchLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let locationData = await Location.getCurrentPositionAsync({});
            setLocation(locationData);
        } catch (error) {
            alert('Error fetching location');
        }
    };
    type FirstAidPayload = {
        latitude: number;
        longitude: number;
    };

    useEffect(() => {
        fetchLocation();
        const id = setInterval(() => {
            fetchLocation();
        }, 60000);

        return () => clearInterval(id);
    }, []);





    async function sendFirstAidReport(payload: FirstAidPayload): Promise<void> {
        try {
            const response = await fetch(`${API_BASE}/first-aid/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            console.log("HTTP status:", response.status);

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Report sent:", data);
        } catch (err) {
            console.error("❌ Failed to send report:", err);
        }
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

    function onAPIPress() {
        if (secondaryButtonSelection.value == 0) {
            secondaryButtonSelection.value = 1;
            offset.value = 0;
            clearSystemText("API opened", "#15efffff");
        } else {
            secondaryButtonSelection.value = 0;
            turnOnSystem();
        }
    }
    function onButton3Press() {
        if (secondaryButtonSelection.value == 0) {
            secondaryButtonSelection.value = 3;
            offset.value = 0;
            clearSystemText("What to do?", "red");
        } else {
            secondaryButtonSelection.value = 0;
            turnOnSystem();
        }
    }
    function onButton4Press() {
        if (secondaryButtonSelection.value == 0) {
            secondaryButtonSelection.value = 4;
            offset.value = 0;
            clearSystemText("Rescue Map", "black");
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
            backGroundColors = ['rgba(255, 252, 65, 1)', '#c57e13ff'];
            circleColor = ['rgba(255, 252, 65, 1)', '#c57e13ff'];
            circleSize1 = 300;
            break;
        default: // for erroring out
            backGroundColors = ['#000', '#000'];
            break;
    }

    function onEmergencyPress() {
        if (isEmergency) {
            setIsEmergency(false);
            shutOffSystem();
        } else {
            turnOnSystem();
            sendFirstAidReport({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            offset.value = 0;
            setIsEmergency(true);
            systemStateColor.value = 2;
            setEnableSecondaryButton(false);
            setTimeout(() => {
                setEnableSecondaryButton(true);
            }, 250);
            setEnableMainButton(false);
            setTimeout(() => {
                setEnableMainButton(true);
            }, 750);
            setSystemActive(true);
            clearSystemText("Help called", 'rgba(255, 0, 0, 1)');
        }


    }

    return (

        <UserContextProvider>
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#000', paddingTop: 0, paddingBottom: 0 }}>
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
                                    <Pressable onLongPress={() => { onEmergencyPress() }} style={[styles.mainCenteredButton, { backgroundColor: systemActive ? 'white' : '#1e3470ff', }]} disabled={!enableMainButton || secondaryButtonSelection.value != 0} onPress={() => { systemActive ? shutOffSystem() : turnOnSystem(); }}>
                                        <IconSymbol size={56} name="power" color={systemActive ? "green" : "red"} />
                                    </Pressable>
                                </Animated.View>
                                <Animated.View
                                    style={[styles.secondaryCenteredButtonAnimation, secondaryButtonOnStart("x", 1, 1)]}>
                                    <Pressable disabled={!enableSecondaryButton || !isLoggedIn} style={[styles.secondaryCenterdButtons, { opacity: isLoggedIn ? 1 : 0.5 }]} onPress={() => onAPIPress()}>
                                        <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                                            <IconSymbol size={48} name="wrench" color="white" />
                                        </View>
                                    </Pressable>
                                </Animated.View>
                                <Animated.View style={[styles.secondaryCenteredButtonAnimation, secondaryButtonOnStart("y", 1, 2)]}>
                                    <Pressable disabled={!enableSecondaryButton} style={[styles.secondaryCenterdButtons]} onPress={() => { onSettingPress() }}>
                                        <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                                            <IconSymbol size={48} name="gear" color="white" />
                                        </View>
                                    </Pressable>
                                </Animated.View>
                                <Animated.View style={[styles.secondaryCenteredButtonAnimation, secondaryButtonOnStart("x", -1, 3)]}>
                                    <Pressable disabled={!enableSecondaryButton} style={styles.secondaryCenterdButtons} onPress={() => onButton3Press()}>
                                        <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                                            <IconSymbol size={48} name="car" color="white" />
                                        </View>
                                    </Pressable>
                                </Animated.View>
                                <Animated.View style={[styles.secondaryCenteredButtonAnimation, secondaryButtonOnStart("y", -1, 4)]}>
                                    <Pressable disabled={!enableSecondaryButton || !isLoggedIn} style={[styles.secondaryCenterdButtons, { opacity: isLoggedIn ? 1 : 0.5 }]} onPress={() => onButton4Press()}>
                                        <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                                            <Entypo size={48} name="arrow-bold-up" color="white" />
                                        </View>
                                    </Pressable>
                                </Animated.View>
                            </View >
                        </View>
                        <View style={[styles.settingContainer, { zIndex: secondaryButtonSelection.value == 1 ? 2 : -11 }]}>
                            <API />
                        </View>
                        <View style={[styles.settingContainer, { zIndex: secondaryButtonSelection.value == 2 ? 2 : -11 }]}>
                            <Settings
                                isActive={secondaryButtonSelection.value == 2}
                                onLogin={(val: boolean) => setIsLoggedIn(val)}
                            />
                        </View>
                        <View style={[styles.settingContainer, { zIndex: secondaryButtonSelection.value == 3 ? 2 : -11 }]}>
                            <View>
                                <Info />
                            </View>
                        </View>
                        <View style={[styles.settingContainer, { zIndex: secondaryButtonSelection.value == 4 ? 2 : -11 }]}>
                            <View>
                                <Map />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
        </UserContextProvider>
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