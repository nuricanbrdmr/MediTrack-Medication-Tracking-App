import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from '../config/FirebaseConfig';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import eventEmitter, { REFRESH_MEDICATION_LIST } from '../service/EventEmitter';
import moment from 'moment';
import { getLocalStorage } from '../service/Storeage';

const MedicationCardItem = ({ item, style, selectedDate }) => {
    const router = useRouter();
    const CheckStatus = () => {
        if (item.action && item.action.length !== 0) {
            // Seçili tarihe ait tüm action'ları filtrele
            const selectedDateActions = item.action.filter(
                action => action.date === moment(selectedDate).format('DD/MM/YYYY')
            );

            // Seçili tarih için action varsa, en sonuncusunun durumunu kontrol et
            if (selectedDateActions.length > 0) {
                const lastActionForDate = selectedDateActions[selectedDateActions.length - 1];
                return lastActionForDate.status === 'taken';
            }
        }
        return false;
    }

    const DeleteMedication = async () => {
        try {
            const user = await getLocalStorage('userDetail');
            if (!user?.email) {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Please login first',
                    visibilityTime: 3000,
                });
                router.replace('/(login)');
                return;
            }
            // Önce history koleksiyonuna ekle
            const medicationWithDeleteDate = {
                ...item,
                deletedAt: moment().format('DD/MM/YYYY')
            };
            await setDoc(doc(db, 'historyMedications', item.docId), medicationWithDeleteDate);

            // Sonra medications'dan sil
            await deleteDoc(doc(db, 'medications', item.docId));

            Toast.show({
                type: 'success',
                text1: 'İlaç geçmişe taşındı',
                position: 'bottom',
            });
            eventEmitter.emit(REFRESH_MEDICATION_LIST);
            router.replace('/(tabs)');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'İlaç taşınırken bir hata oluştu',
                position: 'bottom',
            });
        }
    }
    return (
        <View style={[styles.container, style]}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.type.icon }} style={styles.image} />
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.when}>{item.when}</Text>
                    <Text style={styles.frequency}>{item.dose} {item.type.name}</Text>
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <View style={styles.timeContainer}>
                    <Ionicons name='timer-outline' size={22} color={Colors.DARK_GRAY} style={styles.icon} />
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                {item?.isDeleted !== false ?
                    <TouchableOpacity onPress={DeleteMedication}>
                        <AntDesign name="delete" size={24} color={Colors.RED} />
                    </TouchableOpacity>
                    :
                    ""
                }
            </View>

            {item?.action !== undefined &&
                <View style={styles.actionContainer}>
                    {CheckStatus() ?
                        <AntDesign name="checkcircle" size={20} color={Colors.GREEN} />
                        :
                        <AntDesign name="closecircle" size={20} color={Colors.RED} />
                    }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    imageContainer: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderRadius: 10,
        padding: 10,
    },
    image: {
        width: 50,
        height: 50,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: "capitalize"
    },
    when: {
        fontSize: 12,
    },
    frequency: {
        fontSize: 12,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
    },
    timeContainer: {
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
    },
    time: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.BLACK,
    },
    actionContainer: {
        position: 'absolute',
        left: 5,
        top: 5,
    }
})

export default MedicationCardItem;