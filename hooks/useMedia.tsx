import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Alert } from 'react-native';

interface UseMediaReturn {
    takenImage: string | null;
    libraryImage: ImagePicker.ImagePickerAsset | null;
    activeImageUri: string | null;
    pickFromLibrary: () => Promise<void>;
    takePhoto: () => Promise<void>;
}
    
export function useMedia(): UseMediaReturn {
    const [takenImage, setTakenImage] = useState<string | null>(null);
    const [libraryImage, setLibraryImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [activeImageUri, setActiveImageUri] = useState<string | null>(null);

    const requestPermission = async (type: 'camera' | 'library') => {
        const permission = type === 'camera'
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                'Permission Required',
                `${type === 'camera' ? 'Camera' : 'Gallery'} access is needed.`,
                [{ text: 'Exit', style: 'cancel' }, { text: 'Open Settings', onPress: () => Linking.openSettings() }]
            );
            return false;
        }
        return true;
    };

    const pickFromLibrary = async () => {
        const hasPermission = await requestPermission('library');
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            console.log('Image:', {
                uri: asset.uri,
                fileName: asset.fileName,
                fileSize: asset.fileSize,
                sizeMB: ((asset.fileSize || 0) / (1024 * 1024)).toFixed(1),
                mimeType: asset.mimeType,
                width: asset.width,
                height: asset.height,
            });
            setLibraryImage(asset);
            setActiveImageUri(asset.uri);
        }
    };

    const takePhoto = async () => {
        const hasPermission = await requestPermission('camera');
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setTakenImage(result.assets[0].uri);
            setActiveImageUri(result.assets[0].uri);
            console.log('Taken photo URI:', result.assets[0].uri);
        }
    };

    return {
        takenImage,
        libraryImage,
        activeImageUri,
        pickFromLibrary,
        takePhoto,
    };
}