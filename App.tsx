import type React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import {
  ApplicationProvider,
  Modal,
  Card,
  Button,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

interface Account {
  id: string;
  name: string;
  username: string;
  password: string;
}

const generatePassword = () => {
  const length = 15;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

const App: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // アプリ起動時にSecureStoreからデータを取得
    SecureStore.getItemAsync("accounts").then((data) => {
      if (data) {
        setAccounts(JSON.parse(data));
      }
    });
  }, []);

  const saveAccount = async () => {
    const newAccount: Account = {
      id: uuidv4(),
      name,
      username,
      password,
    };
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    // SecureStoreにデータを保存
    try {
      await SecureStore.setItemAsync(
        "accounts",
        JSON.stringify(updatedAccounts)
      );
      console.log("Account saved successfully");
      setName("");
      setUsername("");
      setPassword("");
      setAddVisible(false);
    } catch (error) {
      console.log("Error saving account:", error);
    }
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={styles.accountItem}
      onPress={() => {
        setSelectedAccount(item);
        setEditVisible(true);
      }}
    >
      <Text style={styles.accountName}>{item.name}</Text>
      <Ionicons
        name="chevron-forward"
        size={24}
        color="#999"
      />
    </TouchableOpacity>
  );

  const deleteAccount = async () => {
    if (selectedAccount) {
      const updatedAccounts = accounts.filter(
        (account) => account.id !== selectedAccount.id
      );
      setAccounts(updatedAccounts);
      try {
        await SecureStore.setItemAsync(
          "accounts",
          JSON.stringify(updatedAccounts)
        );
        console.log("Account deleted successfully");
        setSelectedAccount(null);
        setEditVisible(false);
      } catch (error) {
        console.log("Error deleting account:", error);
      }
    }
  };

  const handleGeneratePassword = () => {
    const generatedPassword = generatePassword();
    setPassword(generatedPassword);
  };

  return (
    <ApplicationProvider
      {...eva}
      theme={eva.light}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>パスワード管理</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddVisible(true)}
          >
            <Ionicons
              name="add"
              size={24}
              color="#007AFF"
            />
          </TouchableOpacity>

          <Modal
            visible={addVisible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setAddVisible(false)}
            style={styles.modal}
          >
            <Card disabled={true}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAddVisible(false)}
              >
                <AntDesign
                  name="close"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>アカウント追加</Text>
              <TextInput
                style={styles.input}
                placeholder="アカウント名"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="メールアドレス"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="パスワード"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button
                style={styles.generateButton}
                onPress={handleGeneratePassword}
              >
                パスワード生成
              </Button>
              <Button onPress={saveAccount}>保存</Button>
            </Card>
          </Modal>
        </View>
        <FlatList
          data={accounts}
          renderItem={renderAccountItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.accountList}
        />
        <Modal
          visible={editVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setEditVisible(false)}
          style={styles.modal}
        >
          <Card disabled={true}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setEditVisible(false)}
            >
              <AntDesign
                name="close"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            {selectedAccount && (
              <>
                <Text style={styles.modalTitle}>{selectedAccount.name}</Text>
                <Text>メールアドレス: {selectedAccount.username}</Text>
                <Text>パスワード: {selectedAccount.password}</Text>
                <Button
                  style={styles.deleteButton}
                  onPress={deleteAccount}
                >
                  <AntDesign
                    name="delete"
                    size={24}
                    color="white"
                  />
                </Button>
              </>
            )}
          </Card>
        </Modal>
      </View>
    </ApplicationProvider>
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
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
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
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "80%",
    maxWidth: 400,
    minHeight: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 20,
    marginTop: 10,
    alignSelf: "flex-end",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
  },
  generateButton: {
    marginBottom: 10,
  },
});

export default App;
