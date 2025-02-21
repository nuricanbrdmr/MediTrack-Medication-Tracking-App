import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/FirebaseConfig';
import Toast from 'react-native-toast-message';
import { setLocalStorage } from '../../service/Storeage';


const SingIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const OnSignIn = () => {
        if (email === '' || password === '') {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Please fill all fields',
                visibilityTime: 3000,
            });
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await setLocalStorage('userDetail', user);
                setEmail("");
                setPassword("");
                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: `Welcome back ${user.displayName}`,
                    visibilityTime: 3000,
                });
                router.replace('(tabs)');
            }).catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/invalid-credential') {
                    Toast.show({
                        type: 'error',
                        position: 'bottom',
                        text1: 'Invalid email or password',
                        visibilityTime: 3000,
                    });
                }
            });
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Let's Sing You In</Text>
            <Text style={styles.subtitle}>Welcome Back!</Text>
            <Text style={styles.subtitle}>You've been Missed!</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} onSubmitEditing={OnSignIn} keyboardType='email-address' placeholder='Email' onChangeText={setEmail} />
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} onSubmitEditing={OnSignIn} secureTextEntry={true} placeholder='Password' onChangeText={setPassword} />
            </View>
            <TouchableOpacity style={styles.button} onPress={OnSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('login/singUp')} style={styles.buttonCreate}>
                <Text style={styles.buttonTextCreate}>Create Account</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: Colors.BLACK,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '400',
        color: Colors.GRAY,
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.BLACK,
        marginBottom: 5,
        marginLeft: 4,
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.DARK_GRAY,
        borderRadius: 10,
        paddingLeft: 10,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 10,
        marginTop: 25,
    },
    buttonCreate: {
        backgroundColor: Colors.WHITE,
        borderColor: Colors.PRIMARY,
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        marginTop: 25,
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonTextCreate: {
        color: Colors.PRIMARY,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})

export default SingIn