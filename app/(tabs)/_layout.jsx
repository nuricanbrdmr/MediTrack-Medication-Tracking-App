import React, { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getLocalStorage } from '../../service/Storeage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/FirebaseConfig';
import Toast from 'react-native-toast-message';

const _layout = () => {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const userDetail = await getLocalStorage('userDetail');
            if (!userDetail) {
                router.replace('/login');
                return;
            }

            if (!auth.currentUser) {
                Toast.show({
                    type: 'info',
                    text1: 'Oturum yenileniyor...',
                    position: 'bottom',
                });
                router.replace('/login');
                return;
            }

            router.replace('(tabs)');
        } catch (error) {
            router.replace('/login');
        }
    }

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={
                {
                    tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    )
                }
            } />
            <Tabs.Screen name="History" options={
                {
                    tabBarLabel: 'History', tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="history" size={size} color={color} />
                    )
                }
            } />
            <Tabs.Screen name="Profile" options={
                {
                    tabBarLabel: 'Profile', tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    )
                }
            } />
        </Tabs>
    )
}

export default _layout