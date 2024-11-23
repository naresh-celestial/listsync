import { Text, View, StyleSheet,TouchableOpacity, Pressable, FlatList, Image, TextInput, ToastAndroid } from "react-native";
import { Title } from "react-native-paper";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ToDoManager = () => {
    //hooks
    const [listData, setListData] = useState();
    //router
    const router = useRouter();

    //state
    const [myList, setMyList] = useState([]);
    // {id: 1, title:'First List', description:'This is the first item in the list'},
    //     {id: 2, title:'Second List', description:'This is the second item in the list'},
    const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
    //Search
    const [isSearchEnabled, setIsSerchEnabled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    //Controller functions
    const addItems = () => {
        setIsAddFieldOpen(!isAddFieldOpen);
    }

    //Search
    const enableSearch = () => {
        setIsSerchEnabled(!isSearchEnabled);
        console.log('search')
    }

    const SearchBar = () => {
        return (
            <View style={styles.searchBar}>
                <TextInput
                    autoFocus
                    placeholderTextColor="#fff"
                    style={styles.serchField}
                    placeholder="Search Items"
                    value={searchQuery}
                    onChangeText={value => setSearchQuery(value)}
                />
            </View>
        )
    } 

    //Components
    //Floating Add Item Button
    const AddItemButton = () => {
        return <TouchableOpacity onPress={addItems} style={styles.addItemButton}>
            <Text style={styles.addItemIcon}>+</Text>
        </TouchableOpacity>
    }

    //List Items
    const FlatListItem = ({id, title, description}) => {
        const [itemTitle, setItemTitle] = useState(title);
        const [itemDescription, setItemDescription] = useState(description);
        const [isFieldsEditable, setisFieldsEditable] = useState(false);

        const editSaveToggle = () => {
            setisFieldsEditable(!isFieldsEditable);
        }

        const saveItem = (id) => {
            // Find the this item from the items and update the details
            let existingitems = listData;
            let thisItem = existingitems.data.find((items) => items.id === id);
            thisItem.title = itemTitle;
            thisItem.description = itemDescription;

            //Get index of this item in the list
            const findObject = (listItem) => {
                return listItem === thisItem;
            }
            let indexOfSelectedList = existingitems.data.findIndex(findObject);
            existingitems.data[indexOfSelectedList] = thisItem;

            //Save to Local Storage
            setToLocalStorage(existingitems.data, existingitems);
            editSaveToggle();
        }

        const deleteItem = (id) => {
            let tempList = [...listData.data];
            if(tempList.length == 1) {
                setListData(listData => ({...listData, data:[]}))
            } else {
                tempList.splice(id - 1, 1);
                setListData(listData => ({...listData, data:tempList}));
            }
            setToLocalStorage(tempList, listData);
        }
        return (
            <View style={[styles.listItemWrapper, isFieldsEditable ? styles.onEditlistItem : ""]}>
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
                </View>
                <View style={styles.actionsSection}>
                    <TouchableOpacity onPress={() => deleteItem(id)} style={styles.editIconWrapper}>
                        <Image
                            style={styles.editIcon}
                            source={require('../../assets/images/delete.png')}
                        />
                    </TouchableOpacity>
                    {!isFieldsEditable ? 
                    <TouchableOpacity onPress={() => editSaveToggle()} style={styles.editIconWrapper}>
                        <Image
                            style={styles.editIcon}
                            source={require('../../assets/images/pencil.png')}
                        />
                    </TouchableOpacity> : 
                    <TouchableOpacity onPress={() => saveItem(id)} style={styles.editIconWrapper}>
                        <Image
                            style={styles.editIcon}
                            source={require('../../assets/images/tick.png')}
                        />
                    </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
    const RenderFlatListView = () => {
        if(listData.data.length !== 0) {
            return <FlatList 
                data={listData.data.filter((items) => {
                    for(let key in items) {
                        if(key === "title") {
                            if(items[key].toLowerCase().includes(searchQuery.toLocaleLowerCase())) {
                                return true;
                            }
                        }
                    }
                    return false;
                })} 
                renderItem={(item) => {
                   return <FlatListItem id={item.item.id} title={item.item.title} description={item.item.description}/>
                }}
                keyExtractor={(item) => item.id}
            />
        } else {
            return (
                <Text style={styles.emptyListText}>No Items in the list.</Text>
            )
        }
    }
    const NewListItemField = () => {
        const [itemTitle, onTitleChange] = useState('');
        const [itemDescription, onDescriptionChange] = useState('');

        const isFieldValid = () => {
            if(itemTitle.length !== 0) {
                return true;
            } else {
                return false;
            }
        }

        const addItem = (title, description) => {
            if(isFieldValid()) {
                let existingListCopy = [...listData.data];
                let itemObject = {
                    id:existingListCopy.length + 1,
                    title:title,
                    description:description
                }
                existingListCopy.push(itemObject);
                setListData(listData => ({...listData, data:existingListCopy}));
                setToLocalStorage(existingListCopy, listData);
            } 
        }

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
                        style={styles.modalSubmitButton}>
                        {isFieldValid() ?
                        <Image source={require('../../assets/images/tick.png')} style={styles.submitIcon}/>
                        : <Image source={require('../../assets/images/delete.png')} style={styles.submitIcon}/>}
                    </Pressable>
                </View>
            </View>
        )
    }

    //Share
    const ListShare = () => {
        return (
            <View style={styles.shareContainer}>
                <Image source={require('../../assets/images/share.png')} style={styles.shareContainerImage}/>
                <Text style={styles.shareContainerText}>Share, Email List</Text>
            </View>
        )
    }

    //Local Storage
    //Set to Local Storage
    const setToLocalStorage = async (list, listMetaData) => {
        try{
            //All Lists
            const storedTodos = await AsyncStorage.getItem("todos");
            let parsedAllData = JSON.parse(storedTodos);

            //this list meta data
            const {id} = listMetaData;

            //Find "this" list from all lists
            let selectedData = parsedAllData.find((item) => item.id === id);

            //Set the current items to list
            selectedData.data = list;
            
            //Get this list index from all lists
            const findObject = (listItem) => {
                return listItem === selectedData;
            }
            let indexOfSelectedList = parsedAllData.findIndex(findObject);
            parsedAllData[indexOfSelectedList] = selectedData;

            await AsyncStorage.setItem("todos", JSON.stringify(parsedAllData));
            console.log('Saved to local!')
        } catch(err) {
            console.log(err);
        }
    }

    //Get from Local Storage
    const getFromLocalStorage = async () => {
        try {
            let storedList = await AsyncStorage.getItem('selectedList');
            if(storedList) {
                setListData(JSON.parse(storedList));
            } else {
                setListData(null);
            }
        } catch(err) {
            console.log(err);
        }
    }
    
    //Component on-mount
    useEffect(() => {
        try {
            getFromLocalStorage();
        } catch(err) {
            console.log(err);
        }
    }, [])

    return (
        listData ? <View style={styles.toDoContainer}>
        <View style={styles.header}>
            <View style={styles.navSection}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/ListManager')}
                >
                    <Text style={styles.backButtonText}>{" < Back"}</Text>
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
                <Title style={styles.bodyTitle}>Items</Title>
                <Pressable 
                    onPress={() => enableSearch()} 
                    style={styles.searchButton}>
                    <Image source={require('../../assets/images/search.png')} style={styles.searchIcon}/>
                </Pressable>
            </View>
            <View style={styles.bodyList}>
                {isSearchEnabled ? <SearchBar/> : null}
                <RenderFlatListView/>
                {isAddFieldOpen ? 
                <NewListItemField/> : null}
                <ListShare/>
            </View>
        </View>
        <View style={styles.footer}></View>
        <AddItemButton/>
    </View> : null
    )
}

const styles = StyleSheet.create({
    toDoContainer: {
        width:"100%",
        height:"100%",
        marginTop:20,
        display:'flex'
    },
    header:{
        flex:0.05,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"center",
    },
    navSection:{
        flex:1
    },
    title:{
        color:'black',
        fontWeight:'600',
        fontSize:18,
        textAlign:'center',
    },
    headerSection:{
        flex:1
    },
    optionsSection:{
        flex:1,
        marginRight:10,
        color:"black",
        opacity:0
    },
    optionsText:{
        textAlign:'right',
    },
    backButtonText: {
        fontSize: 16,
        color: "#007BFF",
        fontWeight:"500",
        marginLeft:10,
        marginTop:3
    },
    body:{
        flex:0.9,
    },
    bodyTitleSection:{
        height:50,
        marginBottom:10,
        paddingRight:20,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    searchButton:{
        width:30,
        height:30,
        borderRadius:15,
        marginTop:5,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    searchIcon:{
        width:25,
        height:25,
        marginTop:5,
        marginBottom:15
    },
    searchBar:{
        width:"100%",
        height:50,
        marginTop:-20,
        padding:10,
        marginBottom:5
    },
    serchField:{
        width:'100%',
        height:35,
        backgroundColor:'#333333',
        paddingLeft:10,
        borderRadius:10,
        color:'white'
    },
    bodyTitle:{
        fontSize:35,
        marginLeft:20,
        fontWeight:700,
        marginTop:15,
        height:50,
        paddingTop:5
    },
    listItemWrapper:{
        width:'93%',
        height:55,
        display:'flex',
        flexDirection:'row',
        alignItems:'start',
        justifyContent:'center',
        marginLeft:15,
        backgroundColor:'white',
        borderRadius:10,
        margin:2,
        paddingLeft:15,
    },
    onEditlistItem:{
        borderWidth:1,
        borderStyle:'dashed'
    },
    editIcon:{
        width:25,
        height:25
    },
    textSection:{
        flex:0.9,
        height:'100%'
    },
    actionsSection:{
        flex:0.1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginRight:30
    },
    editIconWrapper:{
        width:35,
        height:35,
        borderRadius:50,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    listItemTitle:{
        color:'black',
        fontWeight:"700",
        fontSize:18,
        height:30
    },
    listItemDescription:{
        color:'grey',
        fontSize:14,
        marginTop:-5
    },
    shareContainer:{
        width:'100%',
        height:40,
        backgroundColor:'#80808030',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:20
    },
    shareContainerImage:{
        width:20,
        height:20
    },
    shareContainerText:{
        fontSize:16,
        color:'#007BFF',
        marginLeft:10
    },
    footer:{
        flex:0.05,
    },
    addItemButton:{
        width:60,
        height:60,
        backgroundColor:'white',
        elevation:2,
        borderRadius:100,
        position:'absolute',
        bottom:70,
        right:30,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    addItemIcon:{
        fontSize:35,
        fontWeight:"400",
        marginBottom:4,
        color:"#007BFF"
    },
    listModalWrapper:{
        width:"100%",
        height:'100%',
        backgroundColor:'#00000030',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    listModalContainer:{
        width:'90%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#D3D3D360',
        marginLeft:20,
        marginTop:15,
        paddingBottom:5,
        borderRadius:10
    },
    fieldsSection:{
        flex:0.9,
        marginLeft:20
    },
    validateSection:{
        flex:0.1,
        marginRight:10
    },
    emptyListText:{
        textAlign:'center'
    },
    submitIcon:{
        width:25,
        height:25,
        marginTop:5
    },
    discardIcon:{
        height:25,
        width:25
    },
    modalSubmitButton:{
        width:30,
        height:30,
        borderRadius:15,
        marginTop:5,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    modalSubmiteButtonDisabled:{
        width:90,
        height:30,
        borderRadius:15,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'grey'
    },
    listModalTitle:{
        fontSize:25,
        marginBottom:10,
        fontWeight:"500",
        color:'black'
    },
    modalInputField:{
        width:'80%',
        marginBottom:-5
    },
    modalInputFieldTitle:{
        fontWeight:"500"
    },
    modalSubmitButtonText:{
        color:'white',
        fontWeight:'600',
        elevation:2
    }
  });

export default ToDoManager;