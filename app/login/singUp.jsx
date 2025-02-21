import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router';
import { auth } from "../../config/FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Toast from 'react-native-toast-message';
import { setLocalStorage } from './../../service/Storeage';

const singUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const emailRef = useRef();
    const passwordRef = useRef();

    const OnCreateAccount = () => {
        if (fullName === '' || email === '' || password === '') {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Please fill all fields',
                visibilityTime: 3000,
            });
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then(async(userCredential) => {
                const user = userCredential.user;
                await updateProfile(user, {
                    displayName: fullName,
                });
                await setLocalStorage('userDetail', user);
                setEmail("");
                setPassword("");
                setFullName("");
                router.push('/(tabs)');
                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: `Account ${user.email} created successfully`,
                    visibilityTime: 3000,
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/email-already-in-use') {
                    Toast.show({
                        type: 'error',
                        position: 'bottom',
                        text1: 'Email already exists',
                        visibilityTime: 3000,
                    });
                }
            });
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Your Account</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput 
                    style={styles.input} 
                    onChangeText={setFullName}
                    placeholder='Full Name'
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current.focus()}
                    blurOnSubmit={false}
                />
                <Text style={styles.label}>Email</Text>
                <TextInput 
                    ref={emailRef}
                    style={styles.input} 
                    keyboardType='email-address'
                    onChangeText={setEmail}
                    placeholder='Email'
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current.focus()}
                    blurOnSubmit={false}
                />
                <Text style={styles.label}>Password</Text>
                <TextInput 
                    ref={passwordRef}
                    style={styles.input} 
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    placeholder='Password'
                    returnKeyType="done"
                    onSubmitEditing={OnCreateAccount}
                />
            </View>
            <TouchableOpacity onPress={OnCreateAccount} style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('login/singIn')} style={styles.buttonCreate}>
                <Text style={styles.buttonTextCreate}>Already account? Sign In</Text>
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

export default singUp