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
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import { getLocalStorageItem } from ".././util/helper";
import { updateNotesData } from "../firebase/controller/notesController";
const ToDoManager = () => {
  //router
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const itemsData = searchParams.item; // Access id directly if available
  //hooks
  const [listData, setListData] = useState(null);

  //state
  const [myList, setMyList] = useState([]);
  // {id: 1, title:'First List', description:'This is the first item in the list'},
  // {id: 2, title:'Second List', description:'This is the second item in the list'},
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  //Search
  const [isSearchEnabled, setIsSerchEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setListData(JSON.parse(itemsData));
  }, [itemsData]);

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
    const { id, title, description, favourite, category, author } = item;
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

    //Add all items to separate list
    const addAllItemsToList = () => {
      let allItemsTemp = allItems;
      allItemsTemp.push(item);
      setAllItems(allItemsTemp);
    };
    addAllItemsToList();

    const editSaveToggle = () => {
      setisFieldsEditable(!isFieldsEditable);
    };

    const saveItem = (id) => {
      // Find the this item from the items and update the details
      let existingitems = listData;
      if (existingitems !== null && existingitems !== undefined) {
        let listItems = null;
        if (typeof existingitems.data === "string") {
          listItems = JSON.parse(existingitems.data);
        } else {
          listItems = existingitems.data;
        }
        let thisItem = listItems.find((items) => items.id === id);
        thisItem.title = itemTitle;
        thisItem.description = itemDescription;
        thisItem.category = itemCategory;

        //Get index of this item in the list
        const findObject = (listItem) => {
          return listItem === thisItem;
        };
        let indexOfSelectedList = listItems.findIndex(findObject);
        listItems[indexOfSelectedList] = thisItem;

        //Save to Local Storage
        setToLocalStorage(listItems, existingitems);
        editSaveToggle();
      }
    };

    const deleteItem = (id) => {
      let existingItems = listData;
      if (existingItems !== null && existingItems !== undefined) {
        let listItems = null;
        if (typeof existingItems.data === "string") {
          listItems = JSON.parse(existingItems.data);
        } else {
          listItems = existingItems.data;
        }
        console.log("152", listItems);

        if (listItems.length == 1) {
          setListData((listData) => ({ ...listData, data: [] }));
        } else {
          let thisItem = listItems.find((items) => items.id === id);
          //Get index of this item in the list
          const findObject = (listItem) => {
            return listItem === thisItem;
          };
          let indexOfSelectedItem = listItems.findIndex(findObject);

          listItems.splice(indexOfSelectedItem, 1);
          setListData((listData) => ({ ...listData, data: listItems }));
        }
        setToLocalStorage(listItems, listData);
      }
    };

    const setFavouriteItem = (id) => {
      setIsItemFavourite(!isItemFavourite);

      // Find the this item from the items and update the details
      let existingitems = listData;
      let thisItem = existingitems.data.find((items) => items.id === id);
      thisItem.favourite = !isItemFavourite;

      //Get index of this item in the list
      const findObject = (listItem) => {
        return listItem === thisItem;
      };
      let indexOfSelectedList = existingitems.data.findIndex(findObject);
      existingitems.data[indexOfSelectedList] = thisItem;

      //Save to Local Storage
      setToLocalStorage(existingitems.data, existingitems);
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
      console.log("all item", templist);
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
            <TextInput
              style={[styles.listItemDescription]}
              editable={isFieldsEditable}
              value={itemDescription}
              onChangeText={setItemDescription}
            />
            <Text style={styles.authorTitle}>
              Author - {itemAuthor?.length == 0 ? "unknown" : itemAuthor}
            </Text>
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
              onPress={() => setFavouriteItem(id)}
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
            <TouchableOpacity
              onPress={() => deleteItem(id)}
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
                onPress={() => saveItem(id)}
                style={styles.editIconWrapper}
              >
                <Image
                  style={styles.editIcon}
                  source={require("../../assets/images/tick.png")}
                />
              </TouchableOpacity>
            )}
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
      return Object.entries(groupedItems).map((item, index) => {
        let key = item[0];
        let value = item[1];
        return (
          <View key={index}>
            <Text style={styles.categoryTitle}>{key}</Text>
            <FlatList
              data={value.filter((items) => {
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
              })}
              contentContainerStyle={styles.flatListStyles}
              renderItem={(item) => {
                return <FlatListItem key={index} item={item.item} />;
              }}
              keyExtractor={(item) => item.id}
              alwaysBounceVertical
            />
          </View>
        );
      });
    } else {
      return <Text style={styles.emptyListText}>No Items in the list.</Text>;
    }
  }, [listData, isSelectionOn, selectedItems]);

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
          let existingListCopy = [...listData.data];
          let itemObject = {
            id: Date.now().toString(),
            title: title,
            description: description,
            favourite: false,
            category: "others",
            author: itemAuthor,
          };
          existingListCopy.push(itemObject);
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
    const openMenu = (id) => {
      console.log("open menu");
      setVisibleMenu(id);
    };

    const closeMenu = () => {
      setVisibleMenu(null);
    };

    const deleteAllItems = async () => {
      setListData((listData) => ({ ...listData, data: [] }));
      setToLocalStorage([], listData);
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
        visible={visibleMenu === listData.id}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            iconColor="#000000"
            icon="dots-vertical"
            onPress={() => openMenu(listData.id)}
          />
        }
      >
        {!isSelectionOn ? (
          <Menu.Item onPress={() => deleteAllItems()} title="Delete All" />
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
        uid: listMetaData.id ? listMetaData.id : listMetaData.uid,
        data: JSON.stringify(data),
      };
      let updateToCloudObject = await updateNotesData(updatePayload);
      console.log("111", updateToCloudObject);
    } catch (err) {
      console.log("Saving to cloud Err -", err);
    }
  };

  //Local Storage
  //Set to Local Storage
  const setToLocalStorage = async (list, listMetaData) => {
    try {
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
      console.log(err);
    }
  };

  //Add Default Items to List
  // const addDefaultItems = () => {
  //   try {
  //     let itemAuthor = "";
  //     let user = getLocalStorageItem("user");
  //     if (user) {
  //       itemAuthor = user.email;
  //     }
  //     let existingListCopy = [...listData.data];
  //     let isListFresh = existingListCopy.length === 0 ? true : false;

  //     if (isListFresh) {
  //       let defaultItems = [
  //         {
  //           id: 1,
  //           title: "Carrot",
  //           description: "Rabbit Varient",
  //           favourite: true,
  //           category: "Grocery",
  //           author: itemAuthor,
  //         },
  //         {
  //           id: 2,
  //           title: "Tomato",
  //           description: "Apple Tomato",
  //           favourite: true,
  //           category: "Grocery",
  //           author: itemAuthor,
  //         },
  //         {
  //           id: 3,
  //           title: "Onion",
  //           description: "Egypt Onion",
  //           favourite: true,
  //           category: "Grocery",
  //           author: itemAuthor,
  //         },
  //       ];

  //       defaultItems.forEach((item) => {
  //         existingListCopy.push(item);
  //       });
  //       setListData((listData) => ({
  //         ...listData,
  //         data: existingListCopy,
  //       }));
  //       console.log(listData);
  //       setToLocalStorage(existingListCopy, listData);
  //     }
  //   } catch (err) {
  //     console.log("Add Default Items - ERR", err);
  //   }
  // };

  // useEffect(() => {
  //   addDefaultItems();
  // }, []);

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
            {/* <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchorPosition="bottom"
              mode="elevated"
              anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}
            >
              <Menu.Item onPress={() => {}} title="Item 1" />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Divider />
              <Menu.Item onPress={() => {}} title="Item 3" />
            </Menu> */}
          </View>
        </View>
        <View style={styles.bodyList}>
          {isSearchEnabled ? <SearchBar /> : null}
          {RenderFlatListView}
          {isAddFieldOpen ? <NewListItemField /> : null}
          <ListShare />
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
    flex: 0.8,
    height: "100%",
  },
  actionsSection: {
    flex: 0.1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 50,
  },
  nonSelectable: {
    userSelect: "none",
    opacity: 0,
  },
  editIconWrapper: {
    width: 35,
    height: 35,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
});

export default ToDoManager;
