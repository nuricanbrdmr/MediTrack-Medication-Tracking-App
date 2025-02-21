import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../../config/FirebaseConfig';
import { getLocalStorage, removeLocalStorage } from '../../service/Storeage';
import { useRouter } from 'expo-router';
import Colors from '../../constant/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

const Profile = () => {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const GetUserDetail = async () => {
      const userDetail = await getLocalStorage('userDetail');
      setUserDetail(userDetail);
    }
    GetUserDetail();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.userContainer}>
        <Image source={require('../../assets/images/smiley.png')} style={styles.userImage} />
        <Text style={styles.userName}>{userDetail?.displayName} {'👋'}</Text>
        <Text style={styles.userEmail}>{userDetail?.email}</Text>
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => {
        router.push('/add-new-medication');
      }}>
        <View style={styles.buttonIcon}>
          <AntDesign name="pluscircle" size={24} color={Colors.PRIMARY} />
        </View>
        <Text style={styles.buttonText}>Add New Medication</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => {
        router.push('/(tabs)');
      }}>
        <View style={styles.buttonIcon}>
          <Ionicons name="medkit" size={24} color={Colors.PRIMARY} />
        </View>
        <Text style={styles.buttonText}>My Medications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => {
        router.push('/(tabs)/History');
      }}>
        <View style={styles.buttonIcon}>
          <AntDesign name="clockcircle" size={24} color={Colors.PRIMARY} />
        </View>
        <Text style={styles.buttonText}>History</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.buttonContainer} onPress={() => {
        signOut(auth);
        removeLocalStorage();
        router.replace('/login');
      }}>
        <View style={styles.buttonIcon}>
          <Ionicons name="exit" size={24} color={Colors.PRIMARY} />
        </View>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 15
  },
  title: {
    fontSize: 24,
    color: Colors.BLACK,
    marginBottom: 15
  },
  userContainer: {
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userImage: {
    width: 70,
    height: 70,
  },
  userName: {
    fontSize: 20,
    textTransform: 'capitalize',
    marginTop: 10,
    color: Colors.BLACK,
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 2
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 25,
    paddingHorizontal: 15
  },
  buttonIcon: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 10,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: 'bold'
  }
})

export default Profile