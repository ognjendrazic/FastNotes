import * as FileSystem from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNotes } from "../../context/NotesContext";
import { useMedia } from "../../hooks/useMedia";
import { supabase } from "../../lib/supabase";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, deleteNote, updateNoteImage, removeNoteImage } = useNotes();
  const note = id ? getNoteById(id) : null;
  const { takenImage, libraryImage, activeImageUri, pickFromLibrary, takePhoto, deleteImage } = useMedia();
  const { session } = useAuth();
  const [uploading, setUploading] = useState(false);

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Note not found, please create a new note</Text>
      </View>
    );
  }

  // Handle note deletion with confirmation
  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteNote(note.id);
          Alert.alert('Success', 'Note deleted successfully!');
          router.back();
        },
      }
    ])
  }

  
const handleDeleteImage = () => {
    Alert.alert('Delete Image', 'Are you sure you want to delete this image?', [
        { text: 'Cancel', style: 'cancel' },
        {
            text: 'Delete', style: 'destructive',
            onPress: async () => {
                if (activeImageUri) {
                    deleteImage();
                    return;
                }
                if (note.image_url) {
                    await removeNoteImage(note.id);
                }
            },
        }
    ]);
};

  const saveImageToNote = async () => {
    if (!activeImageUri) {
      Alert.alert('No Image', 'Please select or take a photo first.');
      return;
    }

    // Client side validation for image type and size before saving to note
    if (libraryImage) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSizeMB = 15 * 1024 * 1024; // 15 MB

      // Check MIME type of image
      if (!allowedTypes.includes(libraryImage.mimeType || '')) {
        Alert.alert('Unsupported Format', 'Please select a JPEG, PNG, or WEBP image.');
        return;
      }

      // Check file size of image
      if ((libraryImage.fileSize ?? 0) > maxSizeMB) {
        Alert.alert('File Too Large', 'Please select an image smaller than 15 MB.');
        return;
      }
    } else if (takenImage) {
      const maxSizeBytes = 15 * 1024 * 1024; // 15 MB
      const fileInfo = await FileSystem.getInfoAsync(takenImage);

      // Check file size of camera image
      if (fileInfo.exists && fileInfo.size && fileInfo.size > maxSizeBytes) {
        Alert.alert('File Too Large', 'Please take a photo smaller than 15 MB.');
        return;
      }

      // Check file extension of camera image
      const extension = takenImage.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      if (!extension || !allowedExtensions.includes(extension)) {
        Alert.alert('Unsupported Format', 'Please take a JPEG, PNG, or WEBP image.');
        return;
      }
    }

    setUploading(true);

    // Upload to Supabase Storage Bucket
    const fileExtension = takenImage ? 'jpg' : libraryImage?.mimeType?.split('/')[1];
    const fileName = `${session?.user.id}/${note.id}-${Date.now()}.${fileExtension}`;
    const mimeType = libraryImage?.mimeType ?? 'image/jpeg';

    const bytes = await new FileSystem.File(activeImageUri).bytes();

    const { error: uploadError } = await supabase.storage
      .from('Media')
      .upload(fileName, bytes, { contentType: mimeType });

    if (uploadError) {
      Alert.alert('Upload Failed', uploadError.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('Media')
      .getPublicUrl(fileName);

    // Save URL to note
    await updateNoteImage(note.id, publicUrl);
    setUploading(false);
    Alert.alert('Success', 'Image saved to note!');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.meta}>Last updated: {new Date(note.updated_at).toLocaleString()}</Text>
        <View style={styles.divider} />
        <Text style={styles.content}>{note.content}</Text>
      </View>
      {(activeImageUri || note.image_url) && (
        <Image source={{ 
          uri: activeImageUri ?? 
          note.image_url ?? 
          undefined }} 
          style={styles.noteImage}
          resizeMode="contain" />
      )}
      <Pressable onPress={() => router.push(`/note/edit-note?id=${note.id}`)} style={({ pressed }) =>
        [styles.deleteButton, { backgroundColor: "#000000" }, pressed && { opacity: 0.6 }]}>
        <Text style={styles.deleteText}>Edit Note</Text>
      </Pressable>
      <Pressable onPress={pickFromLibrary} style={({ pressed }) =>
        [styles.deleteButton, { backgroundColor: "#262626" }, pressed && { opacity: 0.6 }]}>
        <Text style={styles.deleteText}>Import Picture</Text>
      </Pressable>
      <Pressable onPress={takePhoto} style={({ pressed }) =>
        [styles.deleteButton, { backgroundColor: "#262626" }, pressed && { opacity: 0.6 }]}>
        <Text style={styles.deleteText}>Take Photo</Text>
      </Pressable>
      {(activeImageUri || note.image_url) && (
        <Pressable onPress={handleDeleteImage} style={({ pressed }) =>
          [styles.deleteButton, { backgroundColor: "#636366" }, pressed && { opacity: 0.6 }]}>
          <Text style={styles.deleteText}>Delete Image</Text>
        </Pressable>
      )}
      {activeImageUri && (
        <Pressable
          onPress={saveImageToNote}
          disabled={uploading}
          style={({ pressed }) =>
            [styles.deleteButton, { backgroundColor: "#007aff" }, (pressed || uploading) && { opacity: 0.6 }]}>
          {uploading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.deleteText}>Save Image to Note</Text>}
        </Pressable>
      )}
      <Pressable onPress={handleDelete} style={({ pressed }) =>
        [styles.deleteButton, pressed && { opacity: 0.6 }]}>
        <Text style={styles.deleteText}>Delete Note</Text>
      </Pressable>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#efefef",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: "#111",
  },

  meta: {
    marginTop: 6,
    fontSize: 12,
    color: "#111",
    opacity: 0.6,
  },

  divider: {
    height: 1,
    backgroundColor: "#efefef",
    marginVertical: 12,
  },

  content: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111",
    opacity: 0.9,
  },

  deleteButton: {
    marginTop: 16,
    backgroundColor: "#ff3b30",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  noteImage: {
    width: "100%",
    height: 500,
    borderRadius: 12,
    marginTop: 16,
  }
});
