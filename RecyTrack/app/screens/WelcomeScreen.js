import React, {useState} from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';

//import { NativeStackScreenProps } from '@react-navigation/native-stack';





function WelcomeScreen({navigation}) {

    const {height} = useWindowDimensions();

        return (
        <View>
            <View style={styles.root}>
               <Image 
               style={[styles.logo, {height: height*0.3}]}
               resizeMode='contain'
               source={require("../assets/recycleicon.png")}/>

            </View>
               <View style={styles.padding}>
                   <Text style={styles.text}>
                       Welcome to RecyTrack
                   </Text>
               </View>
               <View style={styles.login}>
                   <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate("Login")}>
                       <Text style={styles.textLogin}>
                           Login
                       </Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate("Register")}>
                       <Text style={styles.textRegister}>
                           Register
                       </Text>
                   </TouchableOpacity>
               </View>
        </View>
     
   
       );
       
    }
    
    const styles = StyleSheet.create({
    logo: {
        width: '50%',
        maxWidth: 300,
        maxHeight: 300,
    },
        
    root: {
        padding: 20,
        alignItems: "center",
    },

    buttonLogin: {
        backgroundColor: "green",
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: "48%",
        borderRadius: 10,
        shadowColor: "green",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10
    }, 

    buttonRegister: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: "48%",
        borderRadius: 10
    },

    login: {
        paddingHorizontal: 20,
        paddingTop: 190,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    
    padding: {
        paddingHorizontal: 40,
        paddingTop: 40,
    },
    
    text: {
        fontSize: 35,
        color: "green",
        fontFamily: "poppins-bold",
        textAlign: "center"
    },

    textLogin: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        fontFamily: "poppins-semibold",
    },

    textRegister: {
        color: "black",
        fontSize: 20,
        textAlign: "center",
        fontFamily: "poppins-semibold",
    },

})

export default WelcomeScreen;