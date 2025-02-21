import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import Colors from '../constant/Colors'
import ConstantString from '../constant/ConstantString'
const EmptyState = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
        <Image source={require('../assets/images/medicine.png')} style={{width: 100, height: 100}}/>
        <Text style={styles.title}>{ConstantString.NoMedication}</Text>
        <Text style={styles.subtitle}>{ConstantString.MedicationSubText}</Text>
        <TouchableOpacity onPress={() => router.push('/add-new-medication')} style={styles.button}>
            <Text style={styles.buttonText}>{ConstantString.AddNewMediciationBtn}</Text>
        </TouchableOpacity>
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 50,
        gap: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.BLACK
    },
    subtitle: {
        fontSize: 14,
        color: Colors.DARK_GRAY
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        width: '100%'
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 16,
        textAlign: 'center',
    }
})

export default EmptyState