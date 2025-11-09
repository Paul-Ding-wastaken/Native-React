import 'react-native-reanimated';
import { Text, View, Platform,Linking, Pressable, StyleSheet, ScrollView } from 'react-native';
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

export default function Info() {
    const links = [
        { label: 'Google Doc', url: 'https://docs.google.com/document/d/12Ph8rFbk_k5gqFsgwxp-1-DtDdKvHO0gQvFNGGX2aEs/edit?pli=1&tab=t.0' },
        { label: 'Ready.gov Info', url: 'https://www.ready.gov/be-informed' },
        { label: 'Weather Updates', url: 'https://www.weather.gov/' },
        { label: 'Flood Info', url: 'https://pinellas.gov/flood-information/' },
        { label: 'Canada Emergency Prep', url: 'https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared.html?utm_source' },
        { label: 'Red Cross Emergencies', url: 'https://www.redcross.ca/how-we-help/emergencies-and-disasters-in-canada/types-of-emergencies' },
    ];
    return (
        <View style={[, { left: '10%', height: '100%', width: '80%', alignItems: 'center' }]}>
            <Text style={[styles.infoText, { top: '0%' }]}>To activate the emergency system, hold the main button.</Text>
            <Text style={styles.infoText}>For information on what to do during a disaster, see the links below:</Text>
            {links.map((link, index) => (
                <Pressable key={index} onPress={() => Linking.openURL(link.url)}>
                    <Text style={styles.linkText}>{link.label}</Text>
                </Pressable>
            ))}
            <Text style={styles.title}>About this App</Text>
            <Text style={styles.infoText}>Version: 1.0.0</Text>
            <Text style={styles.infoText}>Developed by: HelpMy Team</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
    },
    linkText: {
        fontSize: 16,
        color: 'blue',
        alignItems: 'center',
        textDecorationLine: 'underline',
        marginBottom: 10,

    },
});