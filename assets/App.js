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

function ManageScreen({ navigation }) {
  const { menu, addItem, removeItem } = useMenu();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [course, setCourse] = useState("Starters");

  const handleAdd = () => {
    if (name.trim() === "" || price.trim() === "") {
      Alert.alert("Error", "All fields must be filled in!");
      return;
    }
    addItem({ name, course, price: Number(price) });
    setName("");
    setPrice("");
    setCourse("Starters");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Menu</Text>

      {/* Add new dish */}
      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Picker
        selectedValue={course}
        style={styles.input}
        onValueChange={(itemValue) => setCourse(itemValue)}
      >
        <Picker.Item label="Starters" value="Starters" />
        <Picker.Item label="Mains" value="Mains" />
        <Picker.Item label="Dessert" value="Dessert" />
      </Picker>

      <Button title="Add Dish" onPress={handleAdd} />

      <Text style={styles.sub}>Current Menu</Text>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.rowCard}>
            <Text>{item.name} • {item.course} • R {item.price}</Text>
            <Button title="Delete" onPress={() => removeItem(item.id)} />
          </View>
        )}
      />

      <Button title="Go to Filter" onPress={() => navigation.navigate("Filter")} />
    </SafeAreaView>
  );
}

function FilterScreen({ navigation }) {
  const { menu } = useMenu();
  const [course, setCourse] = useState("Starters");

  const filtered = menu.filter((item) => item.course === course);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Filter Menu</Text>

      <Picker
        selectedValue={course}
        style={styles.input}
        onValueChange={(itemValue) => setCourse(itemValue)}
      >
        <Picker.Item label="Starters" value="Starters" />
        <Picker.Item label="Mains" value="Mains" />
        <Picker.Item label="Dessert" value="Dessert" />
      </Picker>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.dish}>{item.name}</Text>
            <Text style={styles.course}>{item.course}</Text>
            <Text style={styles.price}>R {item.price}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No items in {course}</Text>}
      />

      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Manage" component={ManageScreen} />
          <Stack.Screen name="Filter" component={FilterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
              backgroundColor: "#fdf6f0",
               padding: 16 },
  logo: { width: 100, 
         height: 100, 
         alignSelf: "center", 
         marginBottom: 10 },
  title: { fontSize: 22,
           fontWeight: "bold", 
           textAlign: "center", 
           marginBottom: 10 },
  sub: { textAlign: "center",
         marginVertical: 10 },
  row: { flexDirection: "row", 
         justifyContent: "space-around",
          marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  rowCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    elevation: 2,
  },
  dish: { fontSize: 18, 
          fontWeight: "600" },
  course: { color: "#333",
            fontSize: 14, 
            marginTop: 2 },
  price: { color: "#007BFF",
            fontWeight: "bold", 
            marginTop: 2 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
});
