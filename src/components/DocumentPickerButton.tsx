import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

interface DocumentPickerButtonProps {
  onSelect: (uri: string) => void;
}

export const DocumentPickerButton: React.FC<DocumentPickerButtonProps> = ({ onSelect }) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf'
      });

      if (result.type === 'success') {
        onSelect(result.uri);
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de charger le document');
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={pickDocument}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>Sélectionner un PDF</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});