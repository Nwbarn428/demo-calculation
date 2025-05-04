import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  StyleSheet, Button, Switch
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const packageVolumes = {
  'M112': 20,
  'M118': 9,
};

const truncate = (num, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
};

export default function SaddleCharge() {
  const [explosive, setExplosive] = useState('M112');
  const [targetCount, setTargetCount] = useState('1');
  const [cutCount, setCutCount] = useState('1');
  const [inputSize, setInputSize] = useState('');
  const [isDiameter, setIsDiameter] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const targets = parseInt(targetCount, 10);
    const cuts = parseInt(cutCount, 10);
    const raw = parseFloat(inputSize);
    if (![targets, cuts, raw].every(v => !isNaN(v) && v > 0)) {
      setResult({ error: 'Enter valid numbers for all inputs.' });
      return;
    }

    const LA = truncate(isDiameter ? raw * 3.14 : raw);
    const base = truncate(LA / 2);
    const volume = truncate(LA * base * 0.5);

    const pkgVolume = packageVolumes[explosive];
    const pkgPerCharge = Math.ceil(volume / pkgVolume);
    const numCharges = targets * cuts;
    const totalPkgs = numCharges * pkgPerCharge;

    setResult({ LA, base, volume, pkgPerCharge, numCharges, totalPkgs });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Saddle Charge</Text>

      <Text style={styles.subTitle}>Step 1: Critical Information</Text>
      <Text>Explosive: {explosive}</Text>
      <Text>Targets: {targetCount}</Text>
      <Text>Cuts/Target: {cutCount}</Text>
      <Text>Input: {inputSize} {isDiameter ? 'diameter (in)' : 'circumference (in)'}</Text>

      <View style={styles.row}>
        <Text>Input is diameter</Text>
        <Switch value={isDiameter} onValueChange={setIsDiameter} />
      </View>

      <Text style={styles.label}>Choose Explosive:</Text>
      <Picker
        selectedValue={explosive}
        onValueChange={setExplosive}
        style={styles.picker}
      >
        {Object.keys(packageVolumes).map(key => (
          <Picker.Item label={key} value={key} key={key} />
        ))}
      </Picker>

      <Text style={styles.label}>Number of Targets:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={targetCount} onChangeText={setTargetCount} />

      <Text style={styles.label}>Cuts per Target:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={cutCount} onChangeText={setCutCount} />

      <Text style={styles.label}>Diameter or Circumference (in):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={inputSize} onChangeText={setInputSize} />

      <Button title="Calculate" onPress={calculate} />

      {result && (
        <View style={styles.resultBox}>
          {result.error ? (
            <Text style={styles.error}>{result.error}</Text>
          ) : (
            <>
              <Text style={styles.subTitle}>Calculation Breakdown</Text>

              <Text style={styles.step}>Step 1:</Text>
              <Text style={styles.detail}>
                Long Axis (LA) = {result.LA} in{"\n"}
                Base = LA ÷ 2 = {result.base} in
              </Text>

              <Text style={styles.step}>Step 2:</Text>
              <Text style={styles.detail}>
                Volume = LA × Base × 0.5 = {result.volume} in³
              </Text>

              <Text style={styles.step}>Step 3: N/A</Text>

              <Text style={styles.step}>Step 4:</Text>
              <Text style={styles.detail}>
                Packages per charge = Volume ÷ Package Volume = {result.volume} ÷ {packageVolumes[explosive]} = {(result.volume / packageVolumes[explosive]).toFixed(2)}{"\n"}
                → Rounded up to {result.pkgPerCharge} package(s)
              </Text>

              <Text style={styles.step}>Step 5:</Text>
              <Text style={styles.detail}>
                Charges = Targets × Cuts = {result.numCharges}
              </Text>

              <Text style={styles.step}>Step 6:</Text>
              <Text style={styles.detail}>
                Total Packages = Charges × Packages per charge = {result.totalPkgs}
              </Text>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 30 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  subTitle: { fontSize: 18, fontWeight: '600', marginTop: 15 },
  label: { fontSize: 16, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 5, borderRadius: 5 },
  picker: { marginTop: 5, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  resultBox: { marginTop: 25, backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8 },
  error: { color: 'red', fontWeight: 'bold' },
  step: { fontWeight: 'bold', fontSize: 16, marginTop: 10 },
  detail: { fontSize: 15, marginBottom: 8, lineHeight: 22 },
});
