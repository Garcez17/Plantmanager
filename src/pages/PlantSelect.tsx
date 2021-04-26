import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useNavigation } from '@react-navigation/core';
import { FlatList } from 'react-native-gesture-handler';

import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { EnviromentButton } from '../components/EnviromentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';

import { Plant } from '../libs/storage';
import { api } from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

type Enviroment = {
  key: string;
  title: string;
}

export function PlantSelect() {
  const navigation = useNavigation();

  const [enviroments, setEnviroments] = useState<Enviroment[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [enviromentSelected, setEnviromentSelected] = useState('all');
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function fetchEnviroments() {
      const { data } = await api
        .get('plants_environments?_sort=title&_order=asc');

    
      setEnviroments([
        {
          key: 'all',
          title: 'Todos'
        },
        ...data,
      ]);
    }

    fetchEnviroments();

  }, []);

  function handlePlantSelect(plant: Plant) {
    navigation.navigate('PlantSave', { plant });
  }

  async function fetchPlants() {
    const { data } = await api
      .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

      if (!data)
        return setLoading(true);

      if (page > 1) {
        setPlants(oldValue => [...oldValue, ...data]);
        setFilteredPlants(oldValue => [...oldValue, ...data]);
      } else {
        setPlants(data);
        setFilteredPlants(data);
      }

    setLoading(false);
    setLoadingMore(false);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1)
      return;

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlants()
  }

  useEffect(() => {
    fetchPlants();
  }, []);

  function handleEnviromentSelected(environment: string) {
    setEnviromentSelected(environment);

    if (environment === 'all') 
      return setFilteredPlants(plants);

    const filtered = plants.filter(plant => 
      plant.environments.includes(environment)
    );

    setFilteredPlants(filtered);
  }

  if (loading)
    return <Load />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>
          Em qual ambiente
        </Text>
        <Text style={styles.subtitle}>
          você quer colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList 
          data={enviroments}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnviromentButton 
              title={item.title}
              active={item.key === enviromentSelected}
              onPress={() => handleEnviromentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList 
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary 
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subtitle: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.text,
    lineHeight: 20,
  },
  enviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32 
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
})