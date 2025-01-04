import React from "react";
import PropTypes from "prop-types";
import { View, Text, TextInput, Image } from "react-native";
import { IconButton } from "react-native-paper";
import headerStyles from "../../../constants/Headerstyles";

const Header = ({ username, searchQuery = "", setSearchQuery }) => {
  return (
    <View style={headerStyles.headerContainer}>
      <View style={headerStyles.topRow}>
        <IconButton icon="menu" size={24} iconColor="white" />
        <Text style={[headerStyles.headerTitle]}>
          Hi, {username ?? "UserName"}
        </Text>
        <Image
          source={{
            uri: "https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png",
          }}
          style={headerStyles.profileImage}
        />
      </View>
      <View style={headerStyles.searchContainer}>
        <IconButton icon="magnify" size={20} color="#9E9E9E" />
        <TextInput
          style={headerStyles.searchInput}
          placeholder="Search List"
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
};
Header.propTypes = {
  username: PropTypes.string,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
};

export default Header;
