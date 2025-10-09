import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const colors = {
    primary: '#FF5733',
    secondary: '#C70039', // Adicionei uma segunda cor para o gradiente
    text: '#333333',
    textMuted: '#888888',
    white: '#FFFFFF',
};

type SheetModalProps = {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

const SheetModal = ({ visible, onClose, title, children }: SheetModalProps) => {
    return (
        <Modal
            isVisible={visible} // 2. A prop agora se chama 'isVisible'
            onBackdropPress={onClose} // Fecha o modal ao clicar no fundo
            onBackButtonPress={onClose} // Fecha o modal ao clicar no botão "voltar" do Android
            animationIn="slideInUp" // 3. Animação de entrada
            animationOut="fadeOut" // 4. Animação de saída
            animationInTiming={500} // Duração da entrada
            animationOutTiming={1} // Duração da saída
            backdropTransitionInTiming={0} // Duração do fade do fundo na entrada
            backdropTransitionOutTiming={1} // Duração do fade do fundo na saída
            useNativeDriver={true}
            style={styles.modal} //O estilo do container principal é passado aqui
        >
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.gradientBorderContainer}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={28} color={colors.textMuted} />
                    </TouchableOpacity>

                    {children}

                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // O 'modalOverlay' foi substituído por um estilo 'modal' mais simples
    modal: {
        justifyContent: 'flex-end',
        margin: 0, // Remove margens padrão para ocupar a tela toda
    },
    gradientBorderContainer: {
        padding: 1.5,// Espessura da borda
        // Adiciona um pouco de padding para o conteúdo não encostar na borda
        borderTopRightRadius: 22,
        borderTopLeftRadius: 22,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 22,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        alignItems: 'center',
    },

    modalTitle:
    {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.text,
    },

    closeButton: 
    { position: 'absolute',
      top: 15,
      right: 15,
    },
    modalButtonContainer:
     { 
        flexDirection: 'row',
         justifyContent: 'space-between',
          width: '100%',
           marginTop: 20,
     },
    cancelButton:
     { flex: 1,
         backgroundColor: colors.secondary,
         paddingVertical: 16,
         borderRadius: 12,
         alignItems: 'center',
         borderWidth: 1,
         borderColor: colors.secondary,
         marginRight: 28,
     },
    cancelButtonText:
     { color: colors.white,
         fontSize: 16,
          fontWeight: 'bold',
    },
    confirmButton:
    { flex: 1,
         backgroundColor: colors.primary,
         paddingVertical: 16,
         borderRadius: 12,
         alignItems: 'center',
         },
    confirmButtonText: 
    {    color: colors.white,
         fontSize: 16,
         fontWeight: 'bold',
    },

});



export default SheetModal;