import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import ListMenu from "./ListMenu";

const RenderTodoItem = ({ item, onEdit, onDelete, onShare, onPress }) => {
  const listData = item.item;

  return (
    <Card style={styles.card} onPress={() => onPress(listData)}>
      <View style={styles.cardContent}>
        <Text style={styles.todoText}>{listData.title}</Text>
        <ListMenu
          listData={listData}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    height: 60,
    backgroundColor: "white",
    margin: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 5,
  },
  todoText: {
    fontSize: 18,
  },
});
RenderTodoItem.propTypes = {
  item: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default RenderTodoItem;
