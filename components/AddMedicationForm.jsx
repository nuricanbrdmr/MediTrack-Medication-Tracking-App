import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constant/Colors';
import { TypeList, WhenToTake } from './../constant/Options';
import AddMedicationInput from './AddMedicationInput';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { FormatDate, FormatDateForText, FormatTime, getDatesRange } from '../service/ConvertDateTime';
import Toast from 'react-native-toast-message';
import { getLocalStorage } from '../service/Storeage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import moment from 'moment';

const AddMedicationForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState();
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    const onHandleInputChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    }

    const SaveMedication = async () => {
        const docId = Date.now().toString();
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

        if (!(formData?.name && formData?.type && formData?.dose && formData?.when && formData?.startDate && formData?.endDate && formData?.time)) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Please fill all fields',
                visibilityTime: 3000,
            });
            return;
        }
        const dates = getDatesRange(formData?.startDate, formData?.endDate);

        const medicationData = {
            ...formData,
            userEmail: user?.email,
            userId: user?.uid,
            docId: docId,
            dates: dates,
            createdAt: new Date().toISOString(),
        };

        try {
            await setDoc(doc(db, 'medications', docId), medicationData);
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Medication added successfully',
                visibilityTime: 3000,
            });
            router.replace('/(tabs)');
            setFormData(null);
        } catch (error) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Failed to save medication. Please try again.',
                visibilityTime: 3000,
            });
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Medication</Text>
            {/* Medication Name */}
            <AddMedicationInput title='Medication Name' value={formData?.name} icon='medkit-outline' placeholder='Medication Name' onChangeText={(value) => onHandleInputChange('name', value)} />
            {/* Type */}
            <Text style={styles.formTitle}>Type</Text>
            <View style={styles.typeContainer}>
                <FlatList
                    data={TypeList}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.typeItem, { borderColor: item.name === formData?.type?.name ? Colors.PRIMARY : Colors.LIGHT_GRAY_BORDER }]} onPress={() => onHandleInputChange('type', { icon: item.icon, name: item.name })}>
                            <Text style={{ color: item.name === formData?.type?.name ? Colors.PRIMARY : Colors.BLACK }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            {/* Dose Input */}
            <AddMedicationInput title='Dose' icon='eyedrop-outline' value={formData?.dose} placeholder='Ex. 2,15 ml etc.' onChangeText={(value) => onHandleInputChange('dose', value)} />

            {/* When to take Dropdown */}
            <Text style={styles.formTitle}>When to take</Text>
            <View style={styles.formContainer}>
                <Ionicons name='time-outline' size={24} color={Colors.PRIMARY} style={styles.icon} />
                <Picker
                    selectedValue={formData?.when}
                    onValueChange={(value) => onHandleInputChange('when', value)}
                    style={styles.picker}
                >
                    {WhenToTake.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
            </View>

            {/* Start and End Date */}
            <View style={styles.dateInputGroup}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.formTitle}>Start Date</Text>
                    <TouchableOpacity style={styles.formContainer} onPress={() => setShowStartDate(true)}>
                        <Ionicons name='calendar-outline' size={24} color={Colors.PRIMARY} style={styles.icon} />
                        <Text style={styles.dateText}>{formData?.startDate ? FormatDateForText(formData?.startDate) : 'Select Start Date'}</Text>
                    </TouchableOpacity>
                    {showStartDate && <RNDateTimePicker
                        minimumDate={new Date()}
                        value={new Date(formData?.startDate) ?? new Date()}
                        onChange={(value, selectedDate) => {
                            setShowStartDate(false);
                            if (selectedDate) {
                                onHandleInputChange('startDate', FormatDate(selectedDate.toISOString()));
                            }
                        }}
                        style={styles.picker}

                    />}
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.formTitle}>End Date</Text>
                    <TouchableOpacity style={styles.formContainer} onPress={() => setShowEndDate(true)}>
                        <Ionicons name='calendar-outline' size={24} color={Colors.PRIMARY} style={styles.icon} />
                        <Text style={styles.dateText}>{formData?.endDate ? FormatDateForText(formData?.endDate) : 'Select End Date'}</Text>
                    </TouchableOpacity>
                    {showEndDate && <RNDateTimePicker
                        minimumDate={formData?.startDate ? new Date(formData?.startDate) : new Date()}
                        value={formData?.endDate ? new Date(formData?.endDate) : new Date()}
                        onChange={(value, selectedDate) => {
                            setShowEndDate(false);
                            if (selectedDate) {
                                onHandleInputChange('endDate', FormatDate(selectedDate.toISOString()));
                            }
                        }}
                        style={styles.picker}
                    />}
                </View>
            </View>

            {/* Set Reminder Input */}
            <View style={{ flex: 1 }}>
                <Text style={styles.formTitle}>Time</Text>
                <TouchableOpacity style={styles.formContainer} onPress={() => setShowTime(true)}>
                    <Ionicons name='timer-outline' size={24} color={Colors.PRIMARY} style={styles.icon} />
                    <Text style={styles.dateText}>{formData?.time ? formData?.time : 'Select Reminder Time'}</Text>
                </TouchableOpacity>
                {showTime && <RNDateTimePicker
                    mode='time'
                    value={formData?.time ? moment(formData.time, 'hh:mm A').toDate() : new Date()}
                    onChange={(event, selectedTime) => {
                        setShowTime(false);
                        if (event.type === 'set' && selectedTime) {
                            onHandleInputChange('time', FormatTime(selectedTime));
                        }
                    }}
                    style={styles.picker}
                />}
            </View>

            {/* Add Medication Button */}
            <TouchableOpacity onPress={SaveMedication} style={styles.addMedicationButton}>
                <Text style={styles.addMedicationButtonText}>Add Medication</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.BLACK
    },
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
        paddingVertical: 0,
        marginTop: 5,
    },
    icon: {
        borderRightWidth: 1,
        borderRightColor: Colors.LIGHT_GRAY_BORDER,
        paddingRight: 10,
    },
    typeContainer: {
        height: 40,
        marginTop: 5,
    },
    typeItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY_BORDER,
        borderRadius: 10,
        marginRight: 10,
        height: 40,
    },
    picker: {
        flex: 1,
        marginLeft: -10,
    },
    dateInputGroup: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },
    dateText: {
        padding: 10,
        paddingLeft: 0,
    },
    addMedicationButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    addMedicationButtonText: {
        color: Colors.WHITE,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})

export default AddMedicationForm