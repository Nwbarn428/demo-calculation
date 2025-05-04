import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';

const RelievedFaceCrater = () => {
  const [craterLength, setCraterLength] = useState('');
  const [results, setResults] = useState(null);

  const calculate = () => {
    const L = parseFloat(craterLength);
    if (isNaN(L) || L < 10) {
      Alert.alert('Invalid Input', 'Enter a crater length of at least 10 feet.');
      return;
    }

    const friendlyHoles = Math.max(Math.ceil((L - 10) / 7) + 1, 3);
    const enemyHoles = friendlyHoles - 1;

    const crateringCharges = friendlyHoles; // 1 per 5' hole
    const c4LbsTotal = enemyHoles * 30;
    const c4Packages = Math.ceil(c4LbsTotal / 1.25);

    const primingM112 = friendlyHoles * 2;
    const totalM112 = c4Packages + primingM112;

    setResults({
      friendlyHoles,
      enemyHoles,
      crateringCharges,
      c4Packages,
      primingM112,
      totalM112
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relieved Face Crater</Text>

      <Text style={styles.label}>Length of Crater (ft)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={craterLength}
        onChangeText={setCraterLength}
        placeholder="e.g. 40"
      />

      <Button title="Calculate" onPress={calculate} />

      {results && (
        <View style={styles.results}>
          <Text style={styles.step}>Step 1:</Text>
          <Text>Friendly (5') Holes = {results.friendlyHoles}</Text>
          <Text>Enemy (4') Holes = {results.enemyHoles}</Text>

          <Text style={styles.step}>Step 2:</Text>
          <Text>Cratering Charges (1 per 5' hole) = {results.crateringCharges}</Text>

          <Text style={styles.step}>Step 3:</Text>
          <Text>Enemy side requires 30 lbs per hole = {results.enemyHoles * 30} lbs</Text>
          <Text>→ {results.c4Packages} M112 packages (rounded up)</Text>

          <Text style={styles.step}>Step 4:</Text>
          <Text>Priming Charges = 2 × {results.friendlyHoles} = {results.primingM112} M112</Text>

          <Text style={styles.step}>Total M112 Packages = {results.totalM112}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5
  },
  results: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 10
  },
  step: {
    fontWeight: 'bold',
    marginTop: 10
  }
});

export default RelievedFaceCrater;
