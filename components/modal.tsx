import React, { useEffect, useState } from 'react';
import { 
    StyleSheet, 
    TouchableOpacity, 
    View,
    Platform,
    Keyboard,
    Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

const colors = {
    primary: '#FF5733',
    secondary: '#C70039',
};

type SheetModalProps = {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

const SheetModal = ({ 
    visible, 
    onClose, 
    title, 
    children
}: SheetModalProps) => {
    const iconColor = useThemeColor({}, 'primary');
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={() => {
                Keyboard.dismiss();
                onClose();
            }}
            onBackButtonPress={() => {
                Keyboard.dismiss();
                onClose();
            }}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={400}
            animationOutTiming={300}
            useNativeDriver={false} // Mudei para false para funcionar com animação customizada
            style={[styles.modal, { marginBottom: keyboardHeight }]} // Aqui está a mágica!
            backdropOpacity={0.5}
        >
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.gradientBorderContainer}
            >
                <ThemedView bgName='bgPrimary' style={styles.modalContainer}>
                    <ThemedText colorName='textPrimary' style={styles.modalTitle}>
                        {title}
                    </ThemedText>
                    
                    <TouchableOpacity 
                        style={styles.closeButton} 
                        onPress={() => {
                            Keyboard.dismiss();
                            onClose();
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={28} color={iconColor} />
                    </TouchableOpacity>

                    <View style={styles.contentContainer}>
                        {children}
                    </View>
                </ThemedView>
            </LinearGradient>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    gradientBorderContainer: {
        padding: 1.5,
        borderTopRightRadius: 22,
        borderTopLeftRadius: 22,
    },
    modalContainer: {
        padding: 22,
        paddingTop: 50,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        maxHeight: SCREEN_HEIGHT * 0.8, // 80% da altura da tela
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: { 
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        padding: 5,
    },
    contentContainer: {
        width: '100%',
    },
});

export default SheetModal;