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
import {
  IconButton,
  Menu,
  Title,
  Card,
  Divider,
  PaperProvider,
  Checkbox,
} from "react-native-paper";
import {
  useRouter,
  useLocalSearchParams,
  useNavigation,
  useFocusEffect,
} from "expo-router";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import { getLocalStorageItem } from ".././util/helper";
import { updateNotesData } from "../firebase/controller/notesController";
import ToDoRecommendation from "./components/ToDoRecommendation";
import { useIsFocused } from "@react-navigation/native";
const ToDoManager = () => {
  //router
  const router = useRouter();
  const isFocused = useIsFocused();
  const searchParams = useLocalSearchParams();
  const itemsData = searchParams.item;

  //hooks
  const [listData, setListData] = useState(null);
  const [suggestionList, setSuggestionList] = useState([]);
  const [isEditModeOn, setEditModeOn] = useState(false);
  //state
  const [myList, setMyList] = useState([]);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  //Search
  const [isSearchEnabled, setIsSerchEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setListData(JSON.parse(itemsData));
  }, [itemsData]);

  //Add Suggestion List to Main List
  useEffect(() => {
    const getSuggestionSelectedList = async () => {
      let suggestionSelectedList = await AsyncStorage.getItem("suggestionList");
      if (suggestionSelectedList !== null && listData) {
        //Add suggestion selected items to all items list
        let listMetaData = listData;
        let listArray =
          typeof listData.data == "string"
            ? JSON.parse(listData.data)
            : listData.data;

        let suggestionSelectedArray = JSON.parse(suggestionSelectedList);
        let combinedList = [...listArray, ...suggestionSelectedArray];

        let combineListString = JSON.stringify(combinedList);
        //Update the List in Local
        setListData((listData) => ({
          ...listData,
          data: combineListString,
        }));

        //Update the List in Cloud
        await setToLocalStorage(combineListString, listMetaData);
        await AsyncStorage.removeItem("suggestionList");
      }
    };
    getSuggestionSelectedList();
  }, [isFocused]);

  //Controller functions
  const addItems = () => {
    setIsAddFieldOpen(!isAddFieldOpen);
  };

  //Search
  const enableSearch = () => {
    setIsSerchEnabled(!isSearchEnabled);
  };

  const SearchBar = () => {
    return (
      <View style={styles.searchBar}>
        <TextInput
          autoFocus
          placeholderTextColor="#fff"
          style={styles.serchField}
          placeholder="Search Items"
          value={searchQuery}
          onChangeText={(value) => setSearchQuery(value)}
        />
      </View>
    );
  };

  //Components
  //Floating Add Item Button
  const AddItemButton = () => {
    return (
      <TouchableOpacity onPress={addItems} style={styles.addItemButton}>
        <Text style={styles.addItemIcon}>+</Text>
      </TouchableOpacity>
    );
  };

  //List Items
  const [isSelectionOn, setIsSectionOn] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const FlatListItem = ({ item }) => {
    const { uid, title, description, favourite, category, author } = item;
    const [itemTitle, setItemTitle] = useState(title);
    const [itemDescription, setItemDescription] = useState(description);
    const [isFieldsEditable, setisFieldsEditable] = useState(false);
    const [isItemFavourite, setIsItemFavourite] = useState(
      favourite !== undefined ? favourite : true
    );
    const [itemCategory, setItemCategory] = useState(
      category !== undefined ? category : "No Category"
    );
    const [itemAuthor, setItemAuthor] = useState(author);
    const [checked, setChecked] = useState(selectedItems.includes(item));
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
      setEditMode(isEditModeOn);
    }, [isEditModeOn]);

    //Add all items to separate list
    const addAllItemsToList = () => {
      let allItemsTemp = allItems;
      allItemsTemp.push(item);
      setAllItems(allItemsTemp);
    };
    useEffect(() => {
      addAllItemsToList();
    }, []);

    const editSaveToggle = () => {
      setisFieldsEditable(!isFieldsEditable);
    };

    const saveItem = (uid) => {
      try {
        // Find the this item from the items and update the details
        let existingitems = listData;
        if (existingitems !== null && existingitems !== undefined) {
          let listItems = existingitems.data;
          if (typeof existingitems.data === "string") {
            listItems = JSON.parse(existingitems.data);
          }

          let thisItem = listItems.find((items) => items.uid === uid);
          thisItem.title = itemTitle;
          thisItem.description = itemDescription;
          thisItem.category = itemCategory;

          //Get index of this item in the list
          const findObject = (listItem) => {
            return listItem === thisItem;
          };
          let indexOfSelectedList = listItems.findIndex(findObject);
          listItems[indexOfSelectedList] = thisItem;

          listItems = JSON.stringify(listItems);

          //Save to Local Storage
          setToLocalStorage(listItems, existingitems);
          editSaveToggle();
        }
      } catch (err) {
        console.log("Save Item Err - ", err);
      }
    };

    const deleteItem = (uid) => {
      try {
        let existingItems = listData;
        if (existingItems !== null && existingItems !== undefined) {
          let listItems;
          if (typeof existingItems.data === "string") {
            listItems = JSON.parse(existingItems.data);
          } else {
            listItems = existingItems.data;
          }

          if (listItems.length == 1) {
            setListData((listData) => ({ ...listData, data: [] }));
          } else {
            let thisItem = listItems.find((items) => items.uid === uid);
            //Get index of this item in the list
            const findObject = (listItem) => {
              return listItem === thisItem;
            };
            let indexOfSelectedItem = listItems.findIndex(findObject);

            listItems.splice(indexOfSelectedItem, 1);
            setListData((listData) => ({ ...listData, data: listItems }));
          }
          listItems = JSON.stringify(listItems);
          setToLocalStorage(listItems, listData);
        }
      } catch (err) {
        console.log("Deleting Item err - ", err);
      }
    };

    const setFavouriteItem = (uid) => {
      setIsItemFavourite(!isItemFavourite);

      // Find the this item from the items and update the details
      let allItems = listData;
      let existingitems = allItems.data;
      if (typeof existingitems === "string") {
        existingitems = JSON.parse(existingitems);
      }
      let thisItem = existingitems.find((items) => items.uid === uid);
      thisItem.favourite = !isItemFavourite;

      //Get index of this item in the list
      const findObject = (listItem) => {
        return listItem === thisItem;
      };
      let indexOfSelectedList = existingitems.findIndex(findObject);
      existingitems[indexOfSelectedList] = thisItem;

      existingitems = JSON.stringify(existingitems);
      //Save to Local Storage
      setToLocalStorage(existingitems, allItems);
    };

    const onLongPress = () => {
      if (isSelectionOn == false) {
        setIsSectionOn(true);
      }
    };

    const selectItem = (item) => {
      let templist = selectedItems;
      let tempCheck = !checked;
      if (tempCheck) {
        templist.push(item);
      } else {
        //Get this list index from all lists
        const findObject = (listItem) => {
          return listItem === item;
        };
        let indexOfSelectedList = templist.findIndex(findObject);
        templist.splice(indexOfSelectedList, 1);
      }
      setSelectedItems(templist);
      setChecked(!checked);
    };

    return (
      <Pressable onLongPress={onLongPress}>
        <View
          style={[
            styles.listItemWrapper,
            isFieldsEditable
              ? styles.listItemEditable
              : styles.listItemUnEditable,
            isFieldsEditable ? styles.onEditlistItem : "",
          ]}
        >
          {isSelectionOn ? (
            <View style={styles.selectionSection}>
              <Checkbox
                color="#007BFF"
                status={checked ? "checked" : "unchecked"}
                onPress={() => selectItem(item)}
              />
            </View>
          ) : null}
          <View style={styles.textSection}>
            <TextInput
              style={[styles.listItemTitle]}
              editable={isFieldsEditable}
              value={itemTitle}
              onChangeText={setItemTitle}
            />
            {itemDescription?.length !== 0 ? (
              <TextInput
                style={[styles.listItemDescription]}
                editable={isFieldsEditable}
                value={itemDescription}
                onChangeText={setItemDescription}
              />
            ) : null}
            {itemAuthor?.length !== 0 ? (
              <Text style={styles.authorTitle}>
                Author - {itemAuthor?.length == 0 ? "unknown" : itemAuthor}
              </Text>
            ) : null}
            {isFieldsEditable ? (
              <View style={styles.categoryContainer}>
                <Image
                  style={styles.labelIcon}
                  source={require("../../assets/images/tag.png")}
                />
                <TextInput
                  style={[styles.listCategoryTitle]}
                  editable={isFieldsEditable}
                  placeholder={itemCategory}
                  value={itemCategory}
                  onChangeText={setItemCategory}
                />
              </View>
            ) : null}
          </View>
          <View
            style={[
              styles.actionsSection,
              isSelectionOn ? styles.nonSelectable : "",
            ]}
          >
            <TouchableOpacity
              onPress={() => setFavouriteItem(uid)}
              style={styles.editIconWrapper}
            >
              {isItemFavourite ? (
                <Image
                  style={styles.editIcon}
                  source={require("../../assets/images/starFilled.png")}
                />
              ) : (
                <Image
                  style={[styles.editIcon, styles.unFilledStar]}
                  source={require("../../assets/images/starUnFilled.png")}
                />
              )}
            </TouchableOpacity>
            {editMode ? (
              <View style={styles.editDeleteActionContainer}>
                <TouchableOpacity
                  onPress={() => deleteItem(uid)}
                  style={styles.editIconWrapper}
                >
                  <Image
                    style={styles.editIcon}
                    source={require("../../assets/images/delete.png")}
                  />
                </TouchableOpacity>
                {!isFieldsEditable ? (
                  <TouchableOpacity
                    onPress={() => editSaveToggle()}
                    style={styles.editIconWrapper}
                  >
                    <Image
                      style={styles.editIcon}
                      source={require("../../assets/images/pencil.png")}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => saveItem(uid)}
                    style={styles.editIconWrapper}
                  >
                    <Image
                      style={styles.editIcon}
                      source={require("../../assets/images/tick.png")}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  };
  const groupCategory = (list) => {
    let groupedObjects = {};
    Object.values(list).forEach((list) => {
      if (!groupedObjects[list.category]) {
        groupedObjects[list.category] = [];
      }
      groupedObjects[list.category].push(list);
    });
    return groupedObjects;
  };
  //Flat List Component
  const RenderFlatListView = useMemo(() => {
    let listDataObject = listData;
    if (listDataObject !== null && listDataObject !== undefined) {
      let listItems = null;
      if (typeof listDataObject.data === "string") {
        listItems = JSON.parse(listDataObject.data);
      } else {
        listItems = listDataObject.data;
      }
      let groupedItems = groupCategory(listItems);
      if (Object.keys(groupedItems).length !== 0) {
        return Object.entries(groupedItems).map((item, index) => {
          let key = item[0];
          let value = item[1];
          return (
            <View key={index}>
              <Text style={styles.categoryTitle}>{key}</Text>
              {value
                .filter((items) => {
                  for (let key in items) {
                    if (key === "title") {
                      if (
                        items[key]
                          .toLowerCase()
                          .includes(searchQuery.toLocaleLowerCase())
                      ) {
                        return true;
                      }
                    }
                  }
                  return false;
                })
                .map((item, index) => {
                  return <FlatListItem key={index} item={item} />;
                })}
            </View>
          );
        });
      } else {
        return (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>No Items in the List</Text>
          </View>
        );
      }
    } else {
      return <Text style={styles.emptyListText}>No Items in the list.</Text>;
    }
  }, [listData, isSelectionOn, selectedItems, isEditModeOn, searchQuery]);

  const NewListItemField = () => {
    const [itemTitle, onTitleChange] = useState("");
    const [itemDescription, onDescriptionChange] = useState("");
    const [itemAuthor, setItemAuthor] = useState("");
    const isFieldValid = () => {
      if (itemTitle.length !== 0) {
        return true;
      } else {
        return false;
      }
    };

    const getAuthor = async () => {
      const user = await AsyncStorage.getItem("user");
      let userObject = JSON.parse(user);
      setItemAuthor(userObject.email);
    };

    getAuthor();

    const addItem = (title, description) => {
      try {
        if (isFieldValid()) {
          let itemObject = {
            uid: Date.now().toString(),
            title: title,
            description: description,
            favourite: false,
            category: "others",
            author: itemAuthor,
          };
          let existingListCopy = listData.data;
          if (typeof existingListCopy === "string") {
            existingListCopy = JSON.parse(existingListCopy);
          }
          existingListCopy.push(itemObject);
          existingListCopy = JSON.stringify(existingListCopy);
          setListData((listData) => ({
            ...listData,
            data: existingListCopy,
          }));
          setToLocalStorage(existingListCopy, listData);
        }
      } catch (err) {
        console.log("err", err);
      }
    };

    return (
      <View style={styles.listModalContainer}>
        <View style={styles.fieldsSection}>
          <TextInput
            style={[styles.modalInputField, styles.modalInputFieldTitle]}
            placeholder="Title"
            value={itemTitle}
            onChangeText={onTitleChange}
          />
          <TextInput
            style={[styles.modalInputField, styles.modalInputFieldDescription]}
            value={itemDescription}
            placeholder="Description"
            onChangeText={onDescriptionChange}
          />
        </View>
        <View style={styles.validateSection}>
          <Pressable
            onPress={() => addItem(itemTitle, itemDescription)}
            style={styles.modalSubmitButton}
          >
            {isFieldValid() ? (
              <Image
                source={require("../../assets/images/tick.png")}
                style={styles.submitIcon}
              />
            ) : (
              <Image
                source={require("../../assets/images/delete.png")}
                style={styles.submitIcon}
              />
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  //Share
  const ListShare = () => {
    return (
      <View style={styles.shareContainer}>
        <Image
          source={require("../../assets/images/share.png")}
          style={styles.shareContainerImage}
        />
        <Text style={styles.shareContainerText}>Share, Email List</Text>
      </View>
    );
  };

  const ListMenu = () => {
    //List Options
    const [visibleMenu, setVisibleMenu] = useState(null);
    const openMenu = (uid) => {
      setVisibleMenu(uid);
    };

    const closeMenu = () => {
      setVisibleMenu(null);
    };

    const deleteAllItems = async () => {
      setListData((listData) => ({ ...listData, data: [] }));
      setToLocalStorage([], listData);
    };

    const enableEditMode = () => {
      setEditModeOn(!isEditModeOn);
    };

    const cancelSelection = () => {
      setIsSectionOn(false);
    };

    const selectAllItems = () => {
      setSelectedItems(allItems);
    };

    const unSelectAllItems = () => {
      setSelectedItems([]);
    };

    const invertSelection = () => {
      let allItemsTemp = allItems;
      let allSelectedItemsTemp = selectedItems;

      allSelectedItemsTemp.forEach((item) => {
        const findObject = (listItem) => {
          return listItem === item;
        };
        let indexOfSelectedList = allItemsTemp.findIndex(findObject);
        if (indexOfSelectedList) {
          allSelectedItemsTemp.splice(indexOfSelectedList, 1);
        }
      });

      setSelectedItems(allSelectedItemsTemp);
    };

    const deleteSelectedItems = () => {
      //Dont delete any items for now.
      let allItemsTemp = allItems;
      let allSelectedItemsTemp = selectedItems;

      allItemsTemp = allItemsTemp.filter(
        (itemA) =>
          !allSelectedItemsTemp.find((itemB) => itemA.title === itemB.title)
      );

      let noDuplicateList = [...new Set(allItemsTemp)];
      setListData((listData) => ({ ...listData, data: noDuplicateList }));
      let existingitems = listData;
      setToLocalStorage(noDuplicateList, existingitems);
    };

    return (
      <Menu
        visible={visibleMenu === listData.uid}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            iconColor="#000000"
            icon="dots-vertical"
            onPress={() => openMenu(listData.uid)}
          />
        }
      >
        {!isSelectionOn ? (
          <>
            <Menu.Item onPress={() => deleteAllItems()} title="Delete All" />
            <Menu.Item
              onPress={() => enableEditMode()}
              title={!isEditModeOn ? "Edit" : "Cancel"}
            />
          </>
        ) : (
          <>
            {selectedItems.length !== 0 ? (
              <Menu.Item onPress={deleteSelectedItems} title="Delete" />
            ) : null}
            <Menu.Item onPress={selectAllItems} title="Select All" />
            <Menu.Item onPress={unSelectAllItems} title="UnSelect All" />
            {/* <Menu.Item
              onPress={invertSelection}
              title="Invert Selection"
            /> */}
            <Divider />
            <Menu.Item onPress={cancelSelection} title="Cancel" />
          </>
        )}
      </Menu>
    );
  };

  //Cloud Actions
  const saveNoteToCloud = async (data, listMetaData) => {
    try {
      let updatePayload = {
        uid: listMetaData.uid,
        data: JSON.stringify(data),
      };
      let updateToCloudObject = await updateNotesData(updatePayload);
    } catch (err) {
      console.log("Saving to cloud Err -", err);
    }
  };

  //Local Storage
  //Set to Local Storage
  const setToLocalStorage = async (list, listMetaData) => {
    // console.log("list", typeof list, "meta data", listMetaData);
    try {
      list = JSON.parse(list);
      //All Lists
      const storedTodos = await AsyncStorage.getItem("todos");
      let parsedAllData = JSON.parse(storedTodos);

      //this list meta data
      const { uid } = listMetaData;

      //Find "this" list from all lists
      let selectedData = parsedAllData.find((item) => item.uid === uid);

      //Set the current items to list
      selectedData.data = list;

      //Get this list index from all lists
      const findObject = (listItem) => {
        return listItem === selectedData;
      };
      let indexOfSelectedList = parsedAllData.findIndex(findObject);
      parsedAllData[indexOfSelectedList] = selectedData;

      await saveNoteToCloud(
        parsedAllData[indexOfSelectedList].data,
        listMetaData
      );
      await AsyncStorage.setItem("todos", JSON.stringify(parsedAllData));
      console.log("Saved to local!");
    } catch (err) {
      console.log("Set to local storage Err - ", err);
    }
  };

  return listData ? (
    <View style={styles.toDoContainer}>
      <View style={styles.header}>
        <View style={styles.navSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>{"Back"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{listData.title}</Text>
        </View>
        <View style={styles.optionsSection}>
          <Text style={styles.optionsText}>O</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyTitleSection}>
          <View style={styles.bodyTitleSectionLeftSection}>
            <Title style={styles.bodyTitle}>Items</Title>
          </View>
          <View style={styles.bodyTitleSectionRightSection}>
            {!isSelectionOn ? (
              <Pressable
                onPress={() => enableSearch()}
                style={styles.searchButton}
              >
                <Image
                  source={require("../../assets/images/search.png")}
                  style={styles.searchIcon}
                />
              </Pressable>
            ) : null}
            <ListMenu />
          </View>
        </View>
        <View style={styles.bodyList}>
          {/* <ListShare /> */}
          <ScrollView style={styles.bodyScrollViewStyles}>
            {isSearchEnabled ? <SearchBar /> : null}
            {RenderFlatListView}
            {isAddFieldOpen ? <NewListItemField /> : null}
            <ToDoRecommendation />
          </ScrollView>
        </View>
      </View>
      <View style={styles.footer}></View>
      <AddItemButton />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  toDoContainer: {
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
  bodyTitleSectionRightSection: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.1,
  },
  searchButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginTop: 5,
    marginBottom: 15,
  },
  searchBar: {
    width: "100%",
    height: 50,
    marginTop: -10,
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
  bodyTitle: {
    fontSize: 35,
    marginLeft: 20,
    fontWeight: 700,
    marginTop: 15,
    height: 50,
    paddingTop: 5,
    color: "black",
  },
  listItemEditable: {
    width: "93%",
    // height: 85,
  },
  listItemUnEditable: {
    width: "93%",
    // height: 55,
  },
  authorTitle: {
    fontSize: 10,
    marginBottom: 5,
  },
  listItemWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "start",
    justifyContent: "space-between",
    marginLeft: 15,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 2,
    paddingLeft: 15,
  },
  onEditlistItem: {
    borderWidth: 1,
    borderStyle: "dashed",
  },
  editIcon: {
    width: 25,
    height: 25,
  },
  unFilledStar: {
    opacity: 0.3,
  },
  selectionSection: {
    flex: 0.1,
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  textSection: {
    flex: 0.6,
    height: "100%",
  },
  actionsSection: {
    flex: 0.4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 10,
  },
  nonSelectable: {
    userSelect: "none",
    opacity: 0,
  },
  editIconWrapper: {
    width: 35,
    height: 35,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editDeleteActionContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  listItemTitle: {
    color: "black",
    fontWeight: "700",
    fontSize: 18,
    height: 30,
  },
  listItemDescription: {
    color: "grey",
    fontSize: 14,
    marginTop: -5,
  },
  listCategoryTitle: {
    color: "grey",
    fontSize: 14,
    marginTop: -3,
    marginLeft: 10,
  },
  categoryContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  labelIcon: {
    width: 25,
    height: 25,
  },
  shareContainer: {
    width: "100%",
    height: 40,
    backgroundColor: "#80808030",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  shareContainerImage: {
    width: 20,
    height: 20,
  },
  shareContainerText: {
    fontSize: 16,
    color: "#007BFF",
    marginLeft: 10,
  },
  footer: {
    flex: 0.05,
  },
  addItemButton: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 100,
    position: "absolute",
    bottom: 70,
    right: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addItemIcon: {
    fontSize: 35,
    fontWeight: "400",
    marginBottom: 4,
    color: "#007BFF",
  },
  listModalWrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "#00000030",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  listModalContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D3D3D360",
    marginLeft: 20,
    marginTop: 15,
    paddingBottom: 5,
    borderRadius: 10,
  },
  fieldsSection: {
    flex: 0.9,
    marginLeft: 20,
  },
  validateSection: {
    flex: 0.1,
    marginRight: 10,
  },
  emptyListText: {
    textAlign: "center",
  },
  categoryTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    textAlign: "left",
    marginLeft: 20,
    marginBottom: 2,
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  submitIcon: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
  discardIcon: {
    height: 25,
    width: 25,
  },
  modalSubmitButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubmiteButtonDisabled: {
    width: 90,
    height: 30,
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
  },
  listModalTitle: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "500",
    color: "black",
  },
  modalInputField: {
    width: "80%",
    marginBottom: -5,
  },
  modalInputFieldTitle: {
    fontWeight: "500",
  },
  modalSubmitButtonText: {
    color: "white",
    fontWeight: "600",
    elevation: 2,
  },
  options: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 5,
  },
  flatListStyles: {
    overflow: "hidden",
    // backgroundColor: "white",
    alignItems: "center",
  },
  bodyList: {
    flex: 1,
  },
  bodyScrollViewStyles: {
    flex: 1,
  },
});

export default ToDoManager;
