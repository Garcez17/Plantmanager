import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from "react-native";
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from "../styles/colors";
import profileImg from '../assets/gabriel.jpeg';
import fonts from '../styles/fonts';

export function Header() {
  const [name, setName] = useState<string>();

  useEffect(() => {
    async function fetchUser() {
      const user = await AsyncStorage.getItem('@plantmanager:user');

      if (!user) return;

      setName(user);
    }

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.username}>{name}</Text>
      </View>

      <Image style={styles.image} source={profileImg} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  username: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40
  }
})