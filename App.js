import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { fetchDiscogsCollection } from './discogs';

export default function App() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscogsCollection().then(data => {
      setRecords(data);
      setFiltered(data);
      const allGenres = ['All', ...new Set(data.map(item => item.genre).filter(Boolean))];
      setGenres(allGenres);
      setLoading(false);
    });
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    filterData(text, selectedGenre);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    filterData(query, genre);
  };

  const filterData = (searchText, genre) => {
    const lower = searchText.toLowerCase();
    const filteredData = records.filter(r => {
      const matchesSearch = r.album.toLowerCase().includes(lower) || r.artist.toLowerCase().includes(lower);
      const matchesGenre = genre === 'All' || r.genre === genre;
      return matchesSearch && matchesGenre;
    });
    setFiltered(filteredData);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.cover_image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.artist} - {item.album}</Text>
        <Text style={styles.subtitle}>{item.genre} • {item.year}</Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search albums or artists"
        value={query}
        onChangeText={handleSearch}
        style={styles.search}
      />
      <ScrollView horizontal style={styles.genreScroll}>
        {genres.map(g => (
          <TouchableOpacity key={g} onPress={() => handleGenreSelect(g)} style={[styles.genreButton, selectedGenre === g && styles.genreButtonActive]}>
            <Text style={styles.genreText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 50, paddingHorizontal: 15 },
  search: { borderBottomWidth: 1, marginBottom: 20, fontSize: 16 },
  item: { flexDirection: 'row', marginBottom: 20 },
  image: { width: 60, height: 60, marginRight: 15 },
  textContainer: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 16 },
  subtitle: { color: 'gray' },
  genreScroll: { marginBottom: 10 },
  genreButton: { paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#ccc', borderRadius: 15, marginRight: 10 },
  genreButtonActive: { backgroundColor: '#666' },
  genreText: { color: '#fff' }
});
import { registerRootComponent } from 'expo';
registerRootComponent(App);
