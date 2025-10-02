
import React, { useState, useContext, createContext } from "react";
import {
  SafeAreaView,View,Text,TextInput, Button,FlatList,StyleSheet,Image, Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker"; 