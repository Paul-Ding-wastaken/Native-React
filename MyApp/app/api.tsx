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
import { useRef, useState, useEffect, useContext } from 'react';
import MainBackground from '@/components/main-background';
import { auth, googleProvider } from '@/firebase';
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential, getAuth } from "firebase/auth";
import { db } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import UserContext from "./user";
import IndexScreen from '@/components/graph';

function DataSet({ data1, data2 }) {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.dataText, { right: "5%", position: 'absolute' }]}>{data1}</Text>
            <Text style={[styles.dataText, { left: "-3%", position: 'absolute' }]}>  | </Text>
            <Text style={[styles.dataText, { left: "4%", position: 'absolute' }]}>{data2}</Text>
            <Text></Text>
        </View>
    );
}

export default function API() {
    const [dataSets, setDataSets] = useState([
    { data1: "Antartica", data2: "1" },
]);

function setData(data: {label: string[], values: number[]}) {
    for (let i = 0; i < data.label.length; i++) {
        setDataSets((prevDataSets) => [
            ...prevDataSets,
            { data1: data.label[i], data2: data.values[i].toString() },
        ]);
    }
}

    return (
        <View style={{ height: '100%', width: '100%' }}>
            <View style={styles.graphContainer}>
                <IndexScreen 
                    onNewData={(value: {label: string[], values: number[] }) => {
                        console.log("New data received in API component:", value);
                        setData(value);
                    }}
                />
            </View>

            <View style={styles.textdataContainer}>
                <DataSet data1="Region" data2="Injured" />

                <Text style={styles.dataText}>----------------</Text>

                {dataSets.map((item, index) => (
                    <DataSet key={index} data1={item.data1} data2={item.data2} />
                ))}

                <Text style={styles.dataText}>...</Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    graphContainer: {
        marginTop: '15%',
        width: '80%',
        left: '10%',
        height: '35%',
        backgroundColor: 'red',
        position: 'absolute',
        borderRadius: 20,
    },
    bargraphContainer: {
        width: '30%',
        left: '10%',
        height: '35%',
        backgroundColor: 'red',
        top: '45%',
        position: 'absolute',
        borderRadius: 20,
    },
    textdataContainer: {
        width: '80%',
        left: '10%',
        height: '35%',
        top: '45%',
        backgroundColor: 'red',
        position: 'absolute',
        borderRadius: 20,
        alignContent: 'center',
        alignItems: 'center',
        padding: 10,
        overflow: 'hidden'
    },
    dataText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
});