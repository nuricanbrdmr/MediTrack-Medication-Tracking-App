import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import Colors from '../constant/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';

const AddMedicationInput = ({ title, icon, placeholder, onChangeText, value }) => {
    return (
        <>
            <Text style={styles.formTitle}>{title}</Text>
            <View style={styles.formContainer}>
                <Ionicons name={icon} size={24} color={Colors.PRIMARY} style={styles.icon} />
                <TextInput style={styles.formInput} placeholder={placeholder} onChangeText={(value) => onChangeText(value)} value={value} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 14,
        color: Colors.GRAY,
        marginTop: 10,
        marginLeft: 3,
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY_BORDER,
        borderRadius: 10,
        padding: 10,
        paddingVertical: 3,
        marginTop: 5,
    },
    formInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.BLACK,
    },
    icon: {
        borderRightWidth: 1,
        borderRightColor: Colors.LIGHT_GRAY_BORDER,
        paddingRight: 10,
    },
})

export default AddMedicationInput