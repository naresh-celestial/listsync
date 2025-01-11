import React, { useState } from "react";
import { Menu, IconButton } from "react-native-paper";
import PropTypes from "prop-types";

const ListMenu = ({ listData, onEdit, onDelete, onShare }) => {
  const [visibleMenu, setVisibleMenu] = useState(null);

  const openMenu = (uid) => setVisibleMenu(uid);
  const closeMenu = () => setVisibleMenu(null);

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
      <Menu.Item onPress={() => onEdit(listData.uid)} title="Edit" />
      <Menu.Item onPress={() => onDelete(listData.uid)} title="Delete" />
      <Menu.Item
        onPress={() => onShare(JSON.stringify(listData))}
        title="Share"
      />
    </Menu>
  );
};
ListMenu.propTypes = {
  listData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default ListMenu;
