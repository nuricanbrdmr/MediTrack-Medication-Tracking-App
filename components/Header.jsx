import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const Header = ({ user }) => {
  if (!user) return null;
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={require('../assets/images/smiley.png')} style={{ width: 45, height: 45 }} />
        <Text style={styles.title}>Hello {user.displayName} {'👋'}</Text>
      </View>
      <TouchableOpacity onPress={() => router.push('/add-new-medication')}>
        <Ionicons name="medkit-outline" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY_BORDER
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: Colors.BLACK
  }
});

export default Header