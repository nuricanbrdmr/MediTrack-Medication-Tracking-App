import { View,Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router';
const  index = () => {
  const router = useRouter();
    return (
      <View>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/images/login.png')} style={styles.image}/>
        </View>
        <View
        style={styles.titleContainer}
        >
          <Text style={styles.title}>Stay on Track, Stay Healthy!</Text>
          <Text style={styles.subtitle}>Track your meds, take control of your health. Stay consitent, stay confident.</Text>
          <TouchableOpacity onPress={() => router.push('login/singIn')} style={styles.button}>
            <Text style={styles.buttonText}>
              Continue
            </Text>
          </TouchableOpacity>
        <Text style={styles.note}>Note: By Clicking Continue, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text></Text>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    width: 210,
    height: 450,
    borderRadius: 23,
  },
  titleContainer: {
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    height: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    marginTop: 20,
    fontWeight: '400',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    borderRadius: 99,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: '400',
    color: Colors.WHITE,
    textAlign: 'center',
  },
});

export default index