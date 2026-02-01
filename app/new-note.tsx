import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewNote() {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.h1}>New Note</Text>
                <Text style={styles.sub}>Create a new note below.</Text>
            </View>
            <View>
                <TextInput 
                style={styles.search}
                placeholder="Enter title for note"
                placeholderTextColor="#999">
                </TextInput>
            </View>
            <View>
                <TextInput 
                style={[styles.search, { height: 200, textAlignVertical: 'top', marginTop: 12 }]}
                placeholder="Start writing your note here..."
                placeholderTextColor="#999"
                multiline={true}>
                </TextInput>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f6f6f6" },

  header: { 
    paddingTop: 16, 
    paddingHorizontal: 16, 
    paddingBottom: 10 },
  h1: { 
    fontSize: 28, 
    fontWeight: "800", 
    letterSpacing: -0.3, 
    color: "#111" },
  sub: { 
    marginTop: 4, 
    fontSize: 14, 
    opacity: 0.7, 
    color: "#111" },

  search: {
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ededed",
    fontSize: 15,
    color: "#111",
  },
});