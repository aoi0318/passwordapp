import type React from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Account {
  id: string;
  name: string;
  username: string;
  password: string;
}

const App: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "1", name: "Account 1", username: "user1", password: "password1" },
    { id: "2", name: "Account 2", username: "user2", password: "password2" },
  ]);

  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity style={styles.accountItem}>
      <Text style={styles.accountName}>{item.name}</Text>
      <Ionicons
        name="chevron-forward"
        size={24}
        color="#999"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>パスワード管理</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons
            name="add"
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={accounts}
        renderItem={renderAccountItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.accountList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 35,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  accountList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  accountName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
