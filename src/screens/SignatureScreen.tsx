import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { PDFViewer } from '../components/PDFViewer';
import { DocumentPickerButton } from '../components/DocumentPickerButton';
import { SignaturePad } from '../components/SignaturePad';
import { ActionButton } from '../components/ActionButton';
import { Header } from '../components/Header';
import { addSignatureToPDF } from '../utils/pdfUtils';

export const SignatureScreen = () => {
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const handleSignature = (signature: string) => {
    setSignature(signature);
    setShowSignaturePad(false);
  };

  const handleSaveDocument = async () => {
    if (!pdfUri || !signature) return;

    try {
      const pdfBytes = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: FileSystem.EncodingType.Base64
      });

      const signedPdfBytes = await addSignatureToPDF(
        pdfBytes,
        signature,
        { x: 50, y: 700, page: currentPage }
      );

      const fileUri = `${FileSystem.documentDirectory}signed_document.pdf`;
      await FileSystem.writeAsStringAsync(fileUri, signedPdfBytes, {
        encoding: FileSystem.EncodingType.Base64
      });

      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(fileUri);
      } else {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Enregistrer le document signé'
        });
      }

      // Reset state after successful save
      setPdfUri(null);
      setSignature(null);
      setCurrentPage(0);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le document');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="WESD SignPDF" />
      
      {!pdfUri ? (
        <DocumentPickerButton onSelect={setPdfUri} />
      ) : showSignaturePad ? (
        <SignaturePad onSave={handleSignature} />
      ) : (
        <View style={styles.content}>
          <PDFViewer 
            uri={pdfUri} 
            onPageChange={setCurrentPage}
          />
          
          <View style={styles.actions}>
            {!signature ? (
              <ActionButton
                title="Signer"
                onPress={() => setShowSignaturePad(true)}
              />
            ) : (
              <ActionButton
                title="Enregistrer"
                onPress={handleSaveDocument}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1
  },
  actions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5'
  }
});