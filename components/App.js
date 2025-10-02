import React, { useState, useContext, createContext } from "react";
import {
  SafeAreaView,View,Text,TextInput, Button,FlatList,StyleSheet,Image, Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker"; 

const MenuContext = createContext();

function MenuProvider({ children }) {
  const [menu, setMenu] = useState([
    { id: "1", name: "Chicken Wings", course: "Starters", price: 80 },
    { id: "2", name: "Beef Steak", course: "Mains", price: 150 },
    { id: "3", name: "Chocolate Cake", course: "Dessert", price: 60 },
  ]);

  const addItem = (item) => {
    setMenu((prev) => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const removeItem = (id) => {
    setMenu((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <MenuContext.Provider value={{ menu, addItem, removeItem }}>
      {children}
    </MenuContext.Provider>
  );
}

function useMenu() {
  return useContext(MenuContext);
}

function HomeScreen({ navigation }) {
  const { menu } = useMenu();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri: "https://img.icons8.com/color/100/restaurant.png",
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>Menu</Text>
      <Text style={styles.sub}>Total items: {menu.length}</Text>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.dish}>{item.name}</Text>
            <Text style={styles.course}>{item.course}</Text>
            <Text style={styles.price}>R {item.price}</Text>
          </View>
        )}
      />

      <View style={styles.row}>
        <Button title="Manage Menu" onPress={() => navigation.navigate("Manage")} />
        <Button title="Filter Menu" onPress={() => navigation.navigate("Filter")} />
      </View>
    </SafeAreaView>
  );
}
