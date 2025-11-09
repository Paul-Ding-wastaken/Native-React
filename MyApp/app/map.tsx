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
import { Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function Map() {

    const [tick, setTick] = useState(0);
    const numOfPoints = useRef(3);
    const API_BASE =
        "https://magnolia-wearier-unsuccessfully.ngrok-free.dev";

    async function fetchCSVasDictArray() {
        console.log("\n📥 Fetching CSV data...");
        const res = await fetch(`${API_BASE}/first-aid/csv`);
        const csvText = await res.text();

        if (!res.ok) {
            throw new Error(`❌ Failed to fetch CSV (status ${res.status})`);
        }

        // Split lines, remove header
        const lines = csvText.trim().split("\n");
        const header = lines.shift(); // "longitude,latitude"

        // Convert each line into a dictionary
        lines.forEach(line => {
            const [lon, lat] = line.split(",").map(x => Number(x.trim()));
            setPoints(prev => [...prev, { id: prev.length + 1, lat, lon }]);
        });


    }



    function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371000; // meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function projectPoint(baseLat: number, baseLon: number, lat: number, lon: number, mapWidth: number, mapHeight: number) {
        // distance in meters
        const dy = distanceMeters(baseLat, baseLon, lat, baseLon);
        const dx = distanceMeters(baseLat, baseLon, baseLat, lon);

        // Determine direction
        const yDir = lat < baseLat ? 1 : -1;
        const xDir = lon < baseLon ? -1 : 1;

        const maxDist = 50;

        const pxX = (dx / maxDist) * (mapWidth / 2) * xDir;
        const pxY = (dy / maxDist) * (mapHeight / 2) * yDir;

        // Shift to center of box
        return {
            x: mapWidth / 2 + pxX,
            y: mapHeight / 2 + pxY
        };
    }
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [points, setPoints] = useState([
        { id: 1, lat: 43.265549 - 0.0005 , lon: -79.918054 - 0.0005 },
        { id: 2, lat: 43.265549 - 0.001 , lon: -79.918054 + 0.0004 },
        { id: 3, lat: 43.265549 + 0.0002 , lon: -79.918054 + 0.0008 },
        { id: 4, lat: 0, lon: 0 },
    ]);



    useEffect(() => {
        fetchLocation();
        const id = setInterval(() => {
            fetchLocation();
            fetchCSVasDictArray();
            setTick((tick) => tick + 1);
        }, 2000);

        return () => clearInterval(id);
    }, []);

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
    //location.coords.latitude, location.coords.longitude
    const [mapSize, setMapSize] = useState<{ width: number; height: number } | null>(null);
    return (
        <View style={[, { height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }]}>
            <View
                style={[styles.map, { position: 'relative' }]}
                onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    setMapSize({ width, height });
                }}
            >
                {location && mapSize && points.map(point => {
                    const dist = distanceMeters(
                        location.coords.latitude,
                        location.coords.longitude,
                        point.lat,
                        point.lon
                    );
                    if (dist > 50) return null;

                    const pos = projectPoint(
                        location.coords.latitude,
                        location.coords.longitude,
                        point.lat,
                        point.lon,
                        mapSize.width,
                        mapSize.height
                    );

                    return (
                        <View
                            key={point.id}
                            style={{
                                position: 'absolute',
                                width: 12,
                                height: 12,
                                backgroundColor: 'red',
                                borderRadius: 6,
                                left: pos.x - 6,
                                top: pos.y - 6
                            }}
                        />
                    );
                })}

                {/* Draw user in the center */}
                {location && mapSize && (
                    <View
                        style={{
                            position: 'absolute',
                            width: 16,
                            height: 16,
                            backgroundColor: 'blue',
                            borderRadius: 8,
                            left: mapSize.width / 2 - 8,
                            top: mapSize.height / 2 - 8,
                        }}
                    />
                )}
            </View>

            <View style={[, { width: '100%', justifyContent: 'center', alignItems: 'center' }]}><Text style={[, { margin: 30, fontSize: 30, fontWeight: 'bold', color: 'red' }]}>You current location:</Text></View>
            {location ? (
                <Text style={[, { margin: 30, fontSize: 30, fontWeight: 'bold', color: 'red' }]}>Latitude: {location.coords.latitude} Longitude: {location.coords.longitude}</Text>
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    test: {
        backgroundColor: 'red',
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        backgroundColor: 'white',
        height: '50%',
        width: '80%',
    }
});