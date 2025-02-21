import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import MedicationCardItem from '../../components/MedicationCardItem';
import AntDesign from '@expo/vector-icons/AntDesign';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import eventEmitter, { REFRESH_MEDICATION_LIST } from '../../service/EventEmitter';


export default function ActionModal() {
    const router = useRouter();
    const result = useLocalSearchParams();
    const typeObj = typeof result.type === 'string' ? JSON.parse(result.type) : result.type;

    const UpdateMedicationStatus = async (status) => {
        try {
            const docRef = doc(db, 'medications', result.docId);
            await updateDoc(docRef, {
                action: arrayUnion({
                    status: status,
                    time: moment().format('LT'),
                    date: result.selectedDate
                })
            });
            Toast.show({
                type: 'success',
                text1: 'Medication Status Updated',
                visibilityTime: 2000,
                position: 'bottom'
            });
            eventEmitter.emit(REFRESH_MEDICATION_LIST);
            router.replace('/(tabs)');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error Updating Medication Status: ' + error.message,
                visibilityTime: 2000,
                position: 'bottom'
            });
        }
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/notification.gif')} style={styles.image} />
            <Text style={styles.title}>{result.selectedDate}</Text>
            <Text style={styles.time}>{result.time}</Text>
            <Text style={styles.description}>It's time to take your medication</Text>
            <MedicationCardItem
                style={styles.medicationCard}
                item={{
                    name: result.name,
                    time: result.time,
                    dose: result.dose,
                    when: result.when,
                    type: typeObj,
                    action: undefined,
                    isDeleted: false
                }}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={() => UpdateMedicationStatus('missed')}>
                    <AntDesign name="close" size={24} color={Colors.RED} />
                    <Text style={styles.closeText}>Missed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.takenButton} onPress={() => UpdateMedicationStatus('taken')}>
                    <AntDesign name="check" size={24} color={Colors.WHITE} />
                    <Text style={styles.takenText}>Taken</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.skipButton}>
                <AntDesign name="closecircle" size={24} color={Colors.GRAY} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'cover'
    },
    title: {
        fontSize: 14,
        marginTop: 10
    },
    time: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 12,
    },
    medicationCard: {
        width: '90%',
        marginTop: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 10
    },
    closeButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.RED,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    takenButton: {
        padding: 10,
        borderWidth: 0.5,
        backgroundColor: Colors.GREEN,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeText: {
        color: Colors.RED,
        fontSize: 14,
        marginLeft: 5
    },
    takenText: {
        color: Colors.WHITE,
        fontSize: 14,
        marginLeft: 5
    },
    skipButton: {
        position: 'absolute',
        bottom: 25,
    }
})
