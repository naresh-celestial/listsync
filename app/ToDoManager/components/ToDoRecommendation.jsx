import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  Image,
  TextInput,
  ToastAndroid,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { recommendedItems } from "../../util/constants";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/Colors";

const sampleList = [{ title: "Veggies" }, { title: "Fruits" }, { title: "" }];

const ToDoRecommendation = () => {
  return (
    <View style={styles.recommendationContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recommendation</Text>
      </View>
      <View style={styles.body}>
        {recommendedItems.map((item, index) => {
          return <RecommendationCard key={index} index={index} item={item} />;
        })}
      </View>
    </View>
  );
};

const RecommendationCard = ({ item, index }) => {
  const router = useRouter();
  const getCardIndex = (index) => {
    if (index === 0) {
      return styles.firstCardIndex;
    } else if (index === recommendedItems.length - 1) {
      return styles.lastCardindex;
    } else {
      return "";
    }
  };
  const openCategory = () => {
    router.push(
      `/ToDoManager/components/RecommendationSelector?item=${JSON.stringify(
        item
      )}`
    );
  };
  return (
    <Pressable
      onPress={openCategory}
      style={[styles.cardContainer, getCardIndex(index)]}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <AntDesign name="caretright" size={14} color="white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  recommendationContainer: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 30,
  },
  header: {
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    width: "100%",
    paddingTop: 10,
  },
  cardTitle: {
    color: "white",
  },
  cardContainer: {
    padding: 15,
    borderBottomColor: "grey",
    backgroundColor: Colors.light.buttonBackground,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

export default ToDoRecommendation;
