import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const ProfileScreen = ({ username }) => {
  const [expanded, setExpanded] = useState(false);
  const flatListRef = useRef(null);

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (expanded && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity style={styles.option}>
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  const options = [
    'Change Password',
    'Edit Username',
    'Edit Email',
    'Sign Out'
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome, {username}!</Text>
        <TouchableOpacity onPress={toggleExpand} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>{expanded ? 'Hide Options' : 'Show Options'}</Text>
        </TouchableOpacity>
        {expanded && (
          <FlatList
            ref={flatListRef}
            data={options}
            renderItem={renderListItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.optionsList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111920',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#3077b2',
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsList: {
    marginTop: 20,
    width: '80%',
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
