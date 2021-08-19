import React from 'react';
import {ScrollView, StyleSheet, Text, View, Button} from 'react-native';

import Header from '../components/Header';

const TagsScreen = ({
  tagData,
  reset,
  triggerScan,
  isScanning,
  scanningAction,
}) => {
  return (
    <View style={styles.screen}>
      <Header title="RFID Tag List" />
      <View style={styles.tagList}>
        <View style={styles.tagHeader}>
          <Text style={{color: 'white'}}> TAG ID </Text>
          <Text style={{color: 'white'}}> # REGISTRATIONS </Text>
        </View>
        <ScrollView>
          {Array.from(tagData.keys()).map(key => (
            <View key={key} style={styles.tagItem}>
              <Text> {key} </Text>
              <Text> {tagData.get(key)} </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.actionBtn}>
        <Button title="Reset" onPress={() => reset()} />
      </View>

      <View style={styles.actionBtn}>
        <Button title="Scan Single Tag" onPress={() => triggerScan()} />
      </View>

      <View style={styles.actionBtn}>
        <Button
          title={isScanning ? 'Stop Scanning Tags' : 'Start Scanning Tags'}
          onPress={() => scanningAction()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  tagList: {
    padding: 20,
    width: '95%',
  },
  tagHeader: {
    padding: 10,
    backgroundColor: '#d45500',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 3,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    marginBottom: 10,
  },
});

export default TagsScreen;
