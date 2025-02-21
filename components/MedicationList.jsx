import { View,ScrollView, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GetDateRangeToDisplay } from '../service/ConvertDateTime';
import Colors from '../constant/Colors';
import moment from 'moment';
import MedicationCardItem from './MedicationCardItem';
import EmptyState from './EmptyState';
import { useRouter } from 'expo-router';

const MedicationList = ({ medicationList }) => {
    const router = useRouter();
    const [medList, setMedList] = useState(medicationList);
    const [dateRangeList, setDateRangeList] = useState();
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const GetDateRangeList = () => {
        const dateRange = GetDateRangeToDisplay();
        setDateRangeList(dateRange);
    }

    useEffect(() => {
        GetDateRangeList();
    }, []);

    useEffect(() => {
        if (medicationList) {
            GetDateMedicationList(selectedDate);
        }
    }, [medicationList]);

    const GetDateMedicationList = (selectedDate) => {
        setSelectedDate(selectedDate);
        const filteredList = medicationList.filter(item => item.dates.includes(selectedDate));
        setMedList(filteredList);
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/medication.jpeg')} style={styles.image} />
            <View style={styles.dateList}>
                <FlatList data={dateRangeList} horizontal showsHorizontalScrollIndicator={false} renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.dateContainer, { borderColor: item.formattedDate === selectedDate ? Colors.PRIMARY : Colors.GRAY }]} onPress={() => GetDateMedicationList(item.formattedDate)}>
                        <Text style={[styles.dayText, { color: item.formattedDate === selectedDate ? Colors.PRIMARY : Colors.BLACK }]}>{item.day}</Text>
                        <Text style={[styles.dateText, { color: item.formattedDate === selectedDate ? Colors.PRIMARY : Colors.BLACK }]}>{item.date}</Text>
                    </TouchableOpacity>
                )} />
            </View>
            <View>
                {medList.length !== 0 ?
                    <FlatList data={medList} renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.push({ 
                            pathname: 'action-modal',
                            params: {
                                ...item,
                                selectedDate: moment(selectedDate).format('DD/MM/YYYY'),
                                type: JSON.stringify({icon: item.type.icon, name: item.type.name})
                            }
                        })}>
                            <MedicationCardItem item={item} selectedDate={selectedDate}/>
                        </TouchableOpacity>
                    )} /> :
                    <EmptyState />
                }
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        marginTop: 25,
        paddingHorizontal: 15
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 15
    },
    dateList: {
        marginTop: 10,
        marginBottom: 10
    },
    dateContainer: {
        padding: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dayText: {
        fontSize: 20,
        color: Colors.BLACK
    },
    dateText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.BLACK
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    emptyText: {
        fontSize: 18,
        color: Colors.GRAY
    }
})

export default MedicationList