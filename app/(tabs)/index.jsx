import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../config/FirebaseConfig'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { getLocalStorage, removeLocalStorage } from '../../service/Storeage'
import Header from '../../components/Header'
import { useRouter } from 'expo-router'
import EmptyState from '../../components/EmptyState'
import Colors from '../../constant/Colors'
import MedicationList from '../../components/MedicationList'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Toast from 'react-native-toast-message'
import { useFocusEffect } from '@react-navigation/native'
import eventEmitter, { REFRESH_MEDICATION_LIST } from '../../service/EventEmitter'

const index = () => {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState(null);
  const [medicationList, setMedicationList] = useState([]);

  const GetMedicationList = async () => {
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

      const q = query(collection(db, 'medications'), where('userEmail', '==', userDetail.email));
      const querySnapshot = await getDocs(q);
      const medicationList = [];
      querySnapshot.forEach((doc) => {
        medicationList.push(doc.data());
      });
      setMedicationList(medicationList);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Veriler yüklenirken bir hata oluştu',
        position: 'bottom',
      });
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      }
    });

    // Event listener'ı ekle
    eventEmitter.on(REFRESH_MEDICATION_LIST, GetMedicationList);

    return () => {
      unsubscribe();
      // Event listener'ı temizle
      eventEmitter.removeListener(REFRESH_MEDICATION_LIST, GetMedicationList);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const GetUserDetail = async () => {
        try {
          const data = await getLocalStorage('userDetail');
          if (data) {
            setUserDetail(data);
          } else {
            router.replace('/login');
          }
        } catch (error) {
          router.replace('/login');
        }
      };

      GetUserDetail();
      GetMedicationList();

      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <Header user={userDetail} />
      {medicationList.length === 0 ? <EmptyState /> : <MedicationList medicationList={medicationList} />}
    </View>
  )
}

export default index