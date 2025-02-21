import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { GetPrevDateRangeToDisplay } from '../../service/ConvertDateTime';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { getLocalStorage } from '../../service/Storeage';
import { auth, db } from '../../config/FirebaseConfig';
import Toast from 'react-native-toast-message';
import { collection, getDocs, query, where } from 'firebase/firestore';
import EmptyState from '../../components/EmptyState';
import MedicationCardItem from '../../components/MedicationCardItem';

export default function History() {
  const router = useRouter();
  const [medList, setMedList] = useState([]);
  const [dateRangeList, setDateRangeList] = useState();
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  const GetMedicationList = async (selectedDate) => {
    setSelectedDate(selectedDate);
    try {
      const userDetail = await getLocalStorage('userDetail');
      if (!userDetail || !userDetail.email) {
        throw new Error('User details not found');
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

      // Aktif ilaçları al
      const activeMedsQuery = query(
        collection(db, 'medications'), 
        where('userEmail', '==', userDetail.email), 
        where('dates', 'array-contains', selectedDate)
      );
      
      // Geçmiş ilaçları al
      const historyMedsQuery = query(
        collection(db, 'historyMedications'), 
        where('userEmail', '==', userDetail.email), 
        where('dates', 'array-contains', selectedDate)
      );

      // Her iki sorguyu paralel çalıştır
      const [activeMedsSnapshot, historyMedsSnapshot] = await Promise.all([
        getDocs(activeMedsQuery),
        getDocs(historyMedsQuery)
      ]);

      const medicationList = [];

      // Aktif ilaçları ekle
      activeMedsSnapshot.forEach((doc) => {
        medicationList.push({
          ...doc.data(),
          isHistory: false
        });
      });

      // Geçmiş ilaçları ekle
      historyMedsSnapshot.forEach((doc) => {
        medicationList.push({
          ...doc.data(),
          isHistory: true
        });
      });

      setMedList(medicationList);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Veriler yüklenirken bir hata oluştu',
        position: 'bottom',
      });
    }
  }

  const GetDateRangeList = () => {
    const dateRange = GetPrevDateRangeToDisplay();
    setDateRangeList(dateRange);
  }

  useEffect(() => {
    GetDateRangeList();
    GetMedicationList(selectedDate);
  }, []);


  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/med-history.png')} style={styles.image} />
      <View style={styles.dateList}>
        <FlatList data={dateRangeList} horizontal showsHorizontalScrollIndicator={false} renderItem={({ item }) => (
          <TouchableOpacity style={[styles.dateContainer, { borderColor: item.formattedDate === selectedDate ? Colors.PRIMARY : Colors.GRAY }]} onPress={() => GetMedicationList(item.formattedDate)}>
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
                type: JSON.stringify({ icon: item.type.icon, name: item.type.name })
              }
            })}>
              <MedicationCardItem item={{
                ...item,
                isDeleted: false
              }} />
            </TouchableOpacity>
          )} /> :
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Medications Found</Text>
          </View>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 15
  },
  image: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 15,
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