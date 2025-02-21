import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const AddMedicationHeader = () => {
    const router = useRouter();
    return (
        <View>
            <Image source={require('../assets/images/consult.png')} style={styles.image} />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="black" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 250,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 15,
    }
})

export default AddMedicationHeader