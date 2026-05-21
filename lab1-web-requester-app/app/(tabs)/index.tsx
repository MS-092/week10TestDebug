if (process.env.NODE_ENV !== 'test') {
  require("../../ReactotronConfig");
}
import React, { useState } from 'react';
import { View, Button, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const [webData, setWebData] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // Function of the GET request
  const goRequest = () => {
    if (!url.trim()) {
      setWebData('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setWebData('Loading...');

    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.status === 200) {
        setWebData(`✓ Success (${xhr.status})\n\n${xhr.responseText}`);
        console.log('Success:', xhr.responseText);
      } else {
        setWebData(`✗ Error (${xhr.status})\n\n${xhr.statusText}`);
        console.log('Error:', xhr.status, xhr.statusText);
      }
      setIsLoading(false);
    };

    xhr.onerror = () => {
      setWebData(`✗ Request Failed\n\nUnable to connect to the server. Please check the URL and try again.`);
      console.log('Request error');
      setIsLoading(false);
    };

    xhr.ontimeout = () => {
      setWebData(`✗ Request Timeout\n\nThe request took too long to complete.`);
      setIsLoading(false);
    };

    try {
      xhr.open('GET', url, true);
      xhr.timeout = 10000; // 10 second timeout
      xhr.send();
    } catch (error) {
      setWebData(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Web Requester</Text>
      </View>

      <View testID="t1" style={styles.formContainer}>
        <Text style={styles.label}>Enter URL:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your URL request..."
          placeholderTextColor="#999"
          value={url}
          onChangeText={setUrl}
          editable={!isLoading}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? 'Requesting...' : 'Press to GO Request'}
            onPress={goRequest}
            disabled={isLoading}
            color="#007AFF"
          />
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsLabel}>Response:</Text>
        <ScrollView style={styles.resultsBox}>
          <Text style={styles.resultsText}>{webData}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    marginTop: 8,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resultsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultsBox: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 12,
    maxHeight: 300,
  },
  resultsText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    fontFamily: 'Courier New',
  },
});
