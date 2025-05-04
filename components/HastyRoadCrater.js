import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const HastyRoadCrater = () => {
  const [explosiveType, setExplosiveType] = useState('TNT');
  const [secondaryExplosive, setSecondaryExplosive] = useState('M112');
  const [holeDepth, setHoleDepth] = useState('');
  const [craterLength, setCraterLength] = useState('');
  const [pkgWeight, setPkgWeight] = useState('');
  const [secondaryWeight, setSecondaryWeight] = useState('');
  const [results, setResults] = useState(null);

  const calculate = () => {
    let depth = parseFloat(holeDepth);
    const length = parseFloat(craterLength);
    const weight = parseFloat(pkgWeight);
    const secondaryPkgWeight = parseFloat(secondaryWeight);

    if (
      isNaN(depth) ||
      isNaN(length) ||
      (explosiveType !== 'Cratering Charge' && isNaN(weight)) ||
      (explosiveType === 'Cratering Charge' && isNaN(secondaryPkgWeight))
    ) {
      Alert.alert('Invalid Input', 'Please enter valid numeric values.');
      return;
    }

    if (depth < 5) {
      Alert.alert('Warning', 'Hole depth must be at least 5 ft. Auto-adjusted to 5 ft.');
      depth = 5;
    }

    const rawHoles = Math.ceil((length - 16) / 5) + 1;
    const numHoles = Math.max(rawHoles, 3);

    let resultsObj = {
      numHoles
    };

    if (explosiveType === 'Cratering Charge') {
      const crateringPerHole = Math.floor(depth / 4);
      const remainingDepth = depth % 4;
      const crateringTotal = crateringPerHole * numHoles;

      resultsObj.crateringPerHole = crateringPerHole;
      resultsObj.crateringTotal = crateringTotal;

      if (remainingDepth > 0) {
        const remainingLbs = remainingDepth * 10;
        const secondaryPkgsPerHole = Math.ceil(remainingLbs / secondaryPkgWeight);
        const secondaryTotal = secondaryPkgsPerHole * numHoles;

        let totalM112Prime = 0;
        if (secondaryExplosive === 'M112') {
          totalM112Prime = 2 * numHoles;
        }

        resultsObj.remainingDepth = remainingDepth;
        resultsObj.secondaryLbs = remainingLbs;
        resultsObj.secondaryPkgsPerHole = secondaryPkgsPerHole;
        resultsObj.secondaryTotal = secondaryTotal;
        resultsObj.secondaryExplosive = secondaryExplosive;
        resultsObj.totalM112Prime = totalM112Prime;
        resultsObj.secondaryGrandTotal = secondaryTotal + totalM112Prime;
      }
    } else {
      const lbsPerHole = depth * 10;
      const pkgsPerHole = Math.ceil(lbsPerHole / weight);
      const totalPkgs = pkgsPerHole * numHoles;

      resultsObj.lbsPerHole = lbsPerHole;
      resultsObj.pkgsPerHole = pkgsPerHole;
      resultsObj.totalPkgs = totalPkgs;
    }

    setResults(resultsObj);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hasty Road Crater</Text>

      <Text style={styles.label}>Type of Explosive</Text>
      <Picker
        selectedValue={explosiveType}
        onValueChange={setExplosiveType}
        style={styles.picker}
      >
        <Picker.Item label="TNT" value="TNT" />
        <Picker.Item label="M112 (C4)" value="M112" />
        <Picker.Item label="Cratering Charge" value="Cratering Charge" />
      </Picker>

      <Text style={styles.label}>Hole Depth (ft)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={holeDepth}
        onChangeText={setHoleDepth}
        placeholder="Minimum 5 ft"
      />

      <Text style={styles.label}>Crater Length (ft)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={craterLength}
        onChangeText={setCraterLength}
      />

      {explosiveType !== 'Cratering Charge' && (
        <>
          <Text style={styles.label}>Package Weight (lbs)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pkgWeight}
            onChangeText={setPkgWeight}
          />
        </>
      )}

      {explosiveType === 'Cratering Charge' && (
        <>
          <Text style={styles.label}>Secondary Explosive</Text>
          <Picker
            selectedValue={secondaryExplosive}
            onValueChange={setSecondaryExplosive}
            style={styles.picker}
          >
            <Picker.Item label="M112 (C4)" value="M112" />
            <Picker.Item label="TNT" value="TNT" />
          </Picker>

          <Text style={styles.label}>Secondary Explosive Package Weight (lbs)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={secondaryWeight}
            onChangeText={setSecondaryWeight}
          />
        </>
      )}

      <Button title="Calculate" onPress={calculate} />

      {results && (
        <View style={styles.results}>
          <Text style={styles.step}>Step 5:</Text>
          <Text style={styles.detail}>
            Number of Holes = (({craterLength} - 16) ÷ 5), round up, then +1 = {results.numHoles} hole(s)
          </Text>

          {explosiveType === 'Cratering Charge' ? (
            <>
              <Text style={styles.step}>Primary Charge:</Text>
              <Text style={styles.detail}>
                Cratering Charges = {results.crateringPerHole} per hole × {results.numHoles} holes = {results.crateringTotal}
              </Text>

              {results.remainingDepth > 0 && (
                <>
                  <Text style={styles.step}>Secondary Charge:</Text>
                  <Text style={styles.detail}>
                    Remaining depth = {results.remainingDepth} ft × 10 = {results.secondaryLbs} lbs
                  </Text>
                  <Text style={styles.detail}>
                    Packages per hole = {results.secondaryPkgsPerHole}
                  </Text>
                  <Text style={styles.detail}>
                    {results.secondaryPkgsPerHole} × {results.numHoles} = {results.secondaryTotal} {results.secondaryExplosive} packages
                  </Text>

                  {results.secondaryExplosive === 'M112' && (
                    <Text style={styles.detail}>
                      + {results.totalM112Prime} extra M112 for priming → Grand Total: {results.secondaryGrandTotal} M112 packages
                    </Text>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <Text style={styles.step}>Step 2:</Text>
              <Text style={styles.detail}>
                Lbs per hole = {holeDepth} × 10 = {results.lbsPerHole} lbs
              </Text>
              <Text style={styles.step}>Step 4:</Text>
              <Text style={styles.detail}>
                Packages per hole = {results.pkgsPerHole} → Total = {results.totalPkgs} package(s)
              </Text>
            </>
          )}
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
    marginBottom: 15,
    textAlign: 'center'
  },
  label: {
    marginTop: 12,
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5
  },
  picker: {
    marginVertical: 10
  },
  results: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8
  },
  step: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10
  },
  detail: {
    fontSize: 15,
    marginBottom: 8
  }
});

export default HastyRoadCrater;
