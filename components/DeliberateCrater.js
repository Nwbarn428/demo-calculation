import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DeliberateCrater = () => {
  const [craterLength, setCraterLength] = useState('');
  const [explosiveType, setExplosiveType] = useState('TNT');
  const [secondaryExplosive, setSecondaryExplosive] = useState('M112');
  const [results, setResults] = useState(null);

  const explosiveData = {
    TNT: { reFactor: 1.0, pkgWeight: 1.0 },
    M112: { reFactor: 1.34, pkgWeight: 1.25 },
    'Cratering Charge': { reFactor: 1.0, pkgWeight: 40.0 },
  };

  const calculate = () => {
    const L = parseFloat(craterLength);
    if (isNaN(L) || L <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid crater length.');
      return;
    }

    let N = Math.ceil((L - 16) / 5) + 1;
    if (N < 3) N = 3;

    // Assign hole depths: alternate between 7 and 5 ft, starting and ending with 7 ft
    const holeDepths = [];
    for (let i = 0; i < N; i++) {
      if (i === 0 || i === N - 1) {
        holeDepths.push(7);
      } else {
        const prevDepth = holeDepths[i - 1];
        holeDepths.push(prevDepth === 7 ? 5 : 7);
      }
    }

    const { reFactor, pkgWeight } = explosiveData[explosiveType];
    let totalExplosiveWeight = 0;
    let totalPackages = 0;
    let m112PrimingPackages = 0;

    holeDepths.forEach((depth) => {
      let requiredWeight = depth === 5 ? 40 : 80;
      if (explosiveType === 'Cratering Charge') {
        requiredWeight = 40;
      }
      const adjustedWeight = requiredWeight / reFactor;
      const packages = Math.ceil(adjustedWeight / pkgWeight);
      totalExplosiveWeight += requiredWeight;
      totalPackages += packages;
    });

    if (explosiveType === 'Cratering Charge' && secondaryExplosive === 'M112') {
      m112PrimingPackages = 2 * N;
    }

    setResults({
      numberOfHoles: N,
      holeDepths,
      totalExplosiveWeight,
      totalPackages,
      m112PrimingPackages,
      explosiveType,
      secondaryExplosive,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Deliberate Crater Calculator</Text>

      <Text style={styles.label}>Crater Length (ft):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={craterLength}
        onChangeText={setCraterLength}
        placeholder="Enter crater length"
      />

      <Text style={styles.label}>Explosive Type:</Text>
      <Picker
        selectedValue={explosiveType}
        onValueChange={(itemValue) => setExplosiveType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="TNT" value="TNT" />
        <Picker.Item label="M112 (C4)" value="M112" />
        <Picker.Item label="Cratering Charge" value="Cratering Charge" />
      </Picker>

      {explosiveType === 'Cratering Charge' && (
        <>
          <Text style={styles.label}>Secondary Explosive for Priming:</Text>
          <Picker
            selectedValue={secondaryExplosive}
            onValueChange={(itemValue) => setSecondaryExplosive(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="M112 (C4)" value="M112" />
            <Picker.Item label="TNT" value="TNT" />
          </Picker>
        </>
      )}

      <Button title="Calculate" onPress={calculate} />

      {results && (
        <View style={styles.results}>
          <Text style={styles.resultText}>Number of Holes: {results.numberOfHoles}</Text>
          <Text style={styles.resultText}>Hole Depths: {results.holeDepths.join(', ')} ft</Text>
          <Text style={styles.resultText}>
            Total Explosive Weight: {results.totalExplosiveWeight} lbs
          </Text>
          <Text style={styles.resultText}>
            Total Packages Needed: {results.totalPackages}
          </Text>
          {results.m112PrimingPackages > 0 && (
            <Text style={styles.resultText}>
              Additional M112 Packages for Priming: {results.m112PrimingPackages}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  picker: {
    marginVertical: 10,
  },
  results: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DeliberateCrater;
