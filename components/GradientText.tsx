import React from 'react';
import { Text, TextProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
type GradientTextProps = TextProps;

export default function GradientText (props: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text {...props} />
      }
    >
      <LinearGradient
        colors={['#FF5733', '#C70039']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};