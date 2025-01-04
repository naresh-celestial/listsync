import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../../constants/Colors";

const RecommendationSelector = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const itemsData = searchParams.item; // Access id directly if available

  const [items, setItems] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (itemsData) {
      // let sortedItems = JSON.parse(itemsData).sort((first, second) => {
      //   first.localeCompare(second);
      // });
      setItems(JSON.parse(itemsData));
    }
  }, [itemsData]);

  //Components
  const CardItem = ({ item, index }) => {
    const [itemAuthor, setItemAuthor] = useState("");
    const [isSelected, setIsSelected] = useState(false);
    const getCardIndex = (index) => {
      if (items.data.length == 1 && index == 0) {
        return styles.firstCardIndex;
      } else if (index === 0) {
        return styles.firstCardIndex;
      } else if (index === items.data.length - 1) {
        return styles.lastCardindex;
      } else {
        return "";
      }
    };
    const getAuthor = async () => {
      const user = await AsyncStorage.getItem("user");
      let userObject = JSON.parse(user);
      setItemAuthor(userObject.email);
    };
    getAuthor();

    const selectItem = () => {
      let existingSelectedItemsList = selectedItems;
      let itemObject = {
        uid: Date.now().toString(),
        title: item,
        description: "",
        favourite: false,
        category: items.title,
        author: itemAuthor,
      };
      if (existingSelectedItemsList.length === 0) {
        existingSelectedItemsList.push(itemObject);
        setSelectedItems(existingSelectedItemsList);
        setIsSelected(true);
      } else {
        let index = existingSelectedItemsList.findIndex(
          (listItem) => listItem.title === item
        );
        if (index == -1) {
          existingSelectedItemsList.push(itemObject);
          setSelectedItems(existingSelectedItemsList);
          setIsSelected(true);
        } else {
          existingSelectedItemsList.splice(index, 1);
          setIsSelected(false);
        }
      }
    };
    return (
      <Pressable
        key={index}
        onPress={selectItem}
        style={[
          styles.cardContainer,
          isSelected ? styles.cardSelected : styles.cardUnSelected,
          getCardIndex(index),
        ]}
      >
        <Text
          style={[
            isSelected ? styles.cardTitleSelected : styles.cardTitleUnSelected,
          ]}
        >
          {item}
        </Text>
      </Pressable>
    );
  };

  //Handlers
  const goBackWithSelectedList = () => {
    AsyncStorage.setItem("suggestionList", JSON.stringify(selectedItems));
    router.back();
  };

  return (
    items && (
      <SafeAreaView style={styles.selectorContainer}>
        <View style={styles.header}>
          <View style={styles.navSection}>
            <TouchableOpacity
              style={styles.backButton}
              //   onPress={() => router.back()}
              onPress={goBackWithSelectedList}
            >
              <Text style={styles.backButtonText}>{"Back"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerSection}>
            <Text style={styles.title}>{items.title}</Text>
          </View>
          <View style={styles.optionsSection}>
            <Text style={styles.optionsText}>O</Text>
          </View>
        </View>
        <ScrollView style={styles.body}>
          <>
            <Text style={styles.description}>From A-Z</Text>
            {items.data
              .sort((first, second) => first.localeCompare(second))
              .map((card, index) => {
                return <CardItem key={index} item={card} index={index} />;
              })}
          </>
        </ScrollView>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    width: "100%",
    height: "100%",
    marginTop: 35,
    display: "flex",
    backgroundColor: "#F5F5F5",
  },
  header: {
    flex: 0.05,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  navSection: {
    flex: 1,
  },
  title: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  headerSection: {
    flex: 1,
  },
  optionsSection: {
    flex: 1,
    marginRight: 10,
    color: "black",
    opacity: 0,
  },
  optionsText: {
    textAlign: "right",
  },
  backButtonText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "500",
    marginLeft: 20,
    marginTop: 3,
  },
  body: {
    flex: 0.8,
    width: "100%",
    height: "auto",
    padding: 20,
    marginTop: 10,
    paddingBottom: 300,
    marginBottom: 50,
  },
  description: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardContainer: {
    padding: 15,
    borderBottomColor: "grey",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardUnSelected: {
    backgroundColor: "white",
  },
  cardSelected: {
    backgroundColor: Colors.light.buttonBackground,
  },
  cardTitleUnSelected: {
    color: "black",
  },
  cardTitleSelected: {
    color: "white",
  },
  firstCardIndex: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastCardindex: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
export default RecommendationSelector;
