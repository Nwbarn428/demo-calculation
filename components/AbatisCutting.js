import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  StyleSheet, Button, Switch
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const explosives = {
  'M112 (C4)': { re: 1.34, weight: 1.25 },
  'TNT': { re: 1.00, weight: 1.00 },
  'M1 Dynamite': { re: 0.92, weight: 0.50 },
};

const truncate = (num, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
};

export default function AbatisCutting() {
  const [explosive, setExplosive] = useState('M112 (C4)');
  const [treeCount, setTreeCount] = useState('1');
  const [cutCount, setCutCount] = useState('1');
  const [sizeInput, setSizeInput] = useState('');
  const [isCircumference, setIsCircumference] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const trees = parseInt(treeCount, 10);
    const cuts = parseInt(cutCount, 10);
    const raw = parseFloat(sizeInput);
    if (![trees, cuts, raw].every(v => !isNaN(v) && v > 0)) {
      setResult({ error: 'Enter valid numbers for all inputs.' });
      return;
    }

    const D = truncate(isCircumference ? raw / 3.14 : raw);
    const pTNT_raw = (D * D) / 50;
    const pTNT = truncate(pTNT_raw);
    const pExpl_raw = pTNT / explosives[explosive].re;
    const pExpl = truncate(pExpl_raw);
    const pkgPerCharge = Math.ceil(pExpl / explosives[explosive].weight);
    const numCharges = trees * cuts;
    const totalPkgs = numCharges * pkgPerCharge;

    setResult({ D, pTNT, pExpl, pkgPerCharge, numCharges, totalPkgs });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Abatis Cutting</Text>

      <Text style={styles.subTitle}>Step 1: Critical Information</Text>
      <Text>Explosive: {explosive}</Text>
      <Text>Trees: {treeCount}</Text>
      <Text>Cuts/tree: {cutCount}</Text>
      <Text>Input: {sizeInput} {isCircumference ? 'circumference' : 'diameter'}</Text>
      <View style={styles.row}>
        <Text>Input is circumference</Text>
        <Switch value={isCircumference} onValueChange={setIsCircumference} />
      </View>

      <Text style={styles.label}>Choose Explosive:</Text>
      <Picker
        selectedValue={explosive}
        onValueChange={setExplosive}
        style={styles.picker}
      >
        {Object.keys(explosives).map(key => (
          <Picker.Item label={key} value={key} key={key} />
        ))}
      </Picker>

      <Text style={styles.label}>Number of Trees:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={treeCount} onChangeText={setTreeCount} />

      <Text style={styles.label}>Cuts per Tree:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={cutCount} onChangeText={setCutCount} />

      <Text style={styles.label}>Avg Diameter/Circumference:</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={sizeInput} onChangeText={setSizeInput} />

      <Button title="Calculate" onPress={calculate} />

      {result && (
        <View style={styles.resultBox}>
          {result.error ? (
            <Text style={styles.error}>{result.error}</Text>
          ) : (
            <>
              <Text style={styles.subTitle}>Calculation Breakdown</Text>

              <Text style={styles.step}>Step 2:</Text>
              <Text style={styles.detail}>
                TNT Equivalent (lbs) = D² ÷ 50{'\n'}
                = {result.D}² ÷ 50{'\n'}
                = {result.pTNT} lbs
              </Text>

              <Text style={styles.step}>Step 3:</Text>
              <Text style={styles.detail}>
                Lbs of {explosive} = TNT lbs ÷ RE Factor{'\n'}
                = {result.pTNT} ÷ {explosives[explosive].re}{'\n'}
                = {result.pExpl} lbs
              </Text>

              <Text style={styles.step}>Step 4:</Text>
              <Text style={styles.detail}>
                Packages per charge = {result.pExpl} ÷ {explosives[explosive].weight}{'\n'}
                = {(result.pExpl / explosives[explosive].weight).toFixed(2)}{'\n'}
                → Rounded up to next whole number = {result.pkgPerCharge} package(s)
              </Text>

              <Text style={styles.step}>Step 5:</Text>
              <Text style={styles.detail}>
                Total Charges = Trees × Cuts{'\n'}
                = {result.numCharges} charge(s)
              </Text>

              <Text style={styles.step}>Step 6:</Text>
              <Text style={styles.detail}>
                Total Packages = Charges × Packages per Charge{'\n'}
                = {result.numCharges} × {result.pkgPerCharge}{'\n'}
                = {result.totalPkgs} package(s)
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
