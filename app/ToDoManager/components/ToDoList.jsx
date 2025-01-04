import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const ToDoList = ({
  listData,
  isSearchEnabled,
  searchQuery,
  RenderFlatListView,
  AddItemButton,
  enableSearch,
  NewListItemField,
}) => {
  return (
    <View style={styles.body}>
      <View style={styles.bodyTitleSection}>
        <View style={styles.bodyTitleSectionLeftSection}>
          <Text style={styles.bodyTitle}>Items</Text>
        </View>
      </View>
      <View style={styles.bodyList}>
        {isSearchEnabled && (
          <View style={styles.searchBar}>
            <TextInput
              autoFocus
              placeholderTextColor="#fff"
              style={styles.serchField}
              placeholder="Search Items"
              value={searchQuery}
              onChangeText={enableSearch}
            />
          </View>
        )}
        {RenderFlatListView}
        {NewListItemField && <NewListItemField />}
        <AddItemButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 0.9,
  },
  bodyTitleSection: {
    width: "100%",
    height: 50,
    marginBottom: 10,
    paddingRight: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bodyTitleSectionLeftSection: {
    width: "100%",
    display: "flex",
    flex: 0.9,
  },
  bodyTitle: {
    fontSize: 35,
    marginLeft: 20,
    fontWeight: 700,
    marginTop: 15,
    height: 50,
    paddingTop: 5,
    color: "black",
  },
  searchBar: {
    width: "100%",
    height: 50,
    marginTop: -20,
    padding: 10,
    marginBottom: 5,
  },
  serchField: {
    width: "100%",
    height: 35,
    backgroundColor: "#333333",
    paddingLeft: 10,
    borderRadius: 10,
    color: "white",
  },
  bodyList: {
    flex: 1,
  },
});

export default ToDoList;
