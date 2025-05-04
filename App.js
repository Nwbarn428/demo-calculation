import * as React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExternalTimberCutting from './components/ExternalTimberCutting';
import InternalTimberCutting from './components/InternalTimberCutting';
import AbatisCutting from './components/AbatisCutting';
import SaddleCharge from './components/SaddleCharge';
import { Image } from 'react-native';
import HastyRoadCrater from './components/HastyRoadCrater';
import DeliberateCrater from './components/DeliberateCrater';
import RelievedFaceCrater from './components/RelievedFaceCrater';






const Stack = createNativeStackNavigator();

const categories = [
  {
    title: 'Timber Cutting',
    submenu: ['Internal Charges', 'External Charges', 'Abatis']
  },
  {
    title: 'Steel Cutting',
    submenu: ['Block Charges', 'Ribbon Charges', 'Diamond Charges', 'Saddle Charges']
  },
  {
    title: 'Cratering Charges',
    submenu: ['Hasty Road Crater', 'Deliberate Crater', 'Relieved Face Crater']
  },
  {
    title: 'Urban Breaching',
    submenu: ['Silhouette Charges', 'Flexible Linear Charges', 'C-Charges', 'Water Impulse', 'Strip Charges']
  },
  {
    title: 'Special Charges',
    submenu: ['Hasty Breaching', 'Platoon Demo Kit', 'Overpressure Effects', 'Tamping/Standoff Mods']
  },
  {
    title: 'Safety & References',
    submenu: ['NEW Calculator', 'MSD Calculator', 'Safety Checks', 'TM References']
  }
];

// Home Screen
function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
  <View style={{ alignItems: 'center', marginBottom: 20 }}>
  <Image
    source={require('./assets/engineer.png')}
    style={styles.castleImage}
    resizeMode="contain"
  />
  <Text style={styles.title}>Demolition Calculator</Text>
</View>

  {categories.map((cat, index) => (
    <TouchableOpacity
  activeOpacity={0.8}
  key={index}
  style={styles.card}
  onPress={() => navigation.navigate('Submenu', { category: cat })}
>
      <Text style={styles.cardText}>{cat.title}</Text>
    </TouchableOpacity>
  ))}

  <View style={styles.disclaimerBox}>
    <Text style={styles.disclaimer}>
      This application is based solely on unclassified, public-domain U.S. Army manuals (FM 5-250 and TM 3-34.82). It is intended for training and educational purposes only. No classified, restricted, or operationally sensitive information is included.
    </Text>
    <Text style={styles.disclaimer}>
      ⚠️ This app may be subject to U.S. ITAR/EAR restrictions. Do not export or share technical data from this app outside the United States without proper authorization.
    </Text>
  </View>
</ScrollView>

  );
}

// Submenu Screen
function SubmenuScreen({ route, navigation }) {
  const { category } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{category.title}</Text>
      {category.submenu.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.card}
          onPress={() => {
  if (item === 'External Charges') {
    navigation.navigate('External Timber Cutting');
  } else if (item === 'Internal Charges') {
    navigation.navigate('Internal Timber Cutting');
  } else if (item === 'Abatis') {
    navigation.navigate('Abatis Cutting');
  }else if (item === 'Hasty Road Crater') {
  navigation.navigate('Hasty Road Crater');
} else if (item === 'Deliberate Crater') {
    navigation.navigate('Deliberate Crater');
  } else if (item === 'Relieved Face Crater') {
  navigation.navigate('Relieved Face Crater');
} else if (item === 'Saddle Charges') {
    navigation.navigate('Saddle Charge');
  } else {
    alert(`Module for ${item} not built yet.`);
  }
}}

        >
          <Text style={styles.cardText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// Main App with Navigation Container
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Submenu" component={SubmenuScreen} />
        <Stack.Screen name="External Timber Cutting" component={ExternalTimberCutting} />
        <Stack.Screen name="Internal Timber Cutting" component={InternalTimberCutting} />
        <Stack.Screen name="Abatis Cutting" component={AbatisCutting} />
        <Stack.Screen name="Saddle Charge" component={SaddleCharge} />
        <Stack.Screen name="Hasty Road Crater" component={HastyRoadCrater} />
        <Stack.Screen name="Deliberate Crater" component={DeliberateCrater} />
        <Stack.Screen name="Relieved Face Crater" component={RelievedFaceCrater} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#9E1B32', // Engineer red
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  card: {
    backgroundColor: '#4B4B4B', // Engineer steel gray
    padding: 20,
    marginBottom: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#9E1B32' // Red accent stripe
  },
  cardText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  disclaimerBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    marginBottom: 40,
    alignItems: 'center'
  },
  castleImage: {
  width: 100,
  height: 100,
  marginBottom: 10
},
  disclaimer: {
    fontSize: 13,
    color: '#444',
    marginBottom: 8,
    lineHeight: 18,
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: '90%'
  }
});

