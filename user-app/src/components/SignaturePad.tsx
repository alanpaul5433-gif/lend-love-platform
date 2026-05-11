import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, PanResponder, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, radius } from '../theme/ThemeProvider';

/**
 * Lightweight signature pad using react-native-svg + PanResponder.
 * Captures user strokes as SVG paths. `toSvg()` exposes a serialised SVG
 * suitable for storing in Firestore / Firebase Storage.
 */
export interface SignaturePadHandle {
  clear: () => void;
  isEmpty: () => boolean;
  toSvg: () => string;
}

interface Props {
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export const SignaturePad = forwardRef<SignaturePadHandle, Props>(function SignaturePad(
  { height = 180, strokeColor, strokeWidth = 2.5 },
  ref
) {
  const { theme } = useTheme();
  const color = strokeColor ?? theme.textPrimary;

  const [paths, setPaths] = useState<string[]>([]);
  const currentPath = useRef<string>('');
  const layoutRef = useRef<{ width: number; height: number }>({ width: 0, height });
  const updateScheduled = useRef(false);

  const onLayout = (e: LayoutChangeEvent) => {
    layoutRef.current = {
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    };
  };

  const flushCurrent = useCallback(() => {
    updateScheduled.current = false;
    // Force re-render with the in-progress path appended
    setPaths((prev) => [...prev]);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = `M${locationX.toFixed(1)},${locationY.toFixed(1)}`;
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current += ` L${locationX.toFixed(1)},${locationY.toFixed(1)}`;
        if (!updateScheduled.current) {
          updateScheduled.current = true;
          requestAnimationFrame(flushCurrent);
        }
      },
      onPanResponderRelease: () => {
        if (currentPath.current.length > 0) {
          setPaths((prev) => [...prev, currentPath.current]);
          currentPath.current = '';
        }
      },
      onPanResponderTerminate: () => {
        if (currentPath.current.length > 0) {
          setPaths((prev) => [...prev, currentPath.current]);
          currentPath.current = '';
        }
      },
    })
  ).current;

  useImperativeHandle(ref, () => ({
    clear: () => {
      setPaths([]);
      currentPath.current = '';
    },
    isEmpty: () => paths.length === 0 && currentPath.current.length === 0,
    toSvg: () => {
      const { width: w, height: h } = layoutRef.current;
      const lines = paths
        .map((d) => `<path d="${d}" stroke="${color}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`)
        .join('');
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${lines}</svg>`;
    },
  }));

  return (
    <View
      style={[
        styles.pad,
        { backgroundColor: '#FFFFFF', borderColor: theme.border, height },
      ]}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <Svg width="100%" height="100%">
        {paths.map((d, i) => (
          <Path
            key={i}
            d={d}
            stroke="#0D0D0D"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {currentPath.current ? (
          <Path
            d={currentPath.current}
            stroke="#0D0D0D"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  pad: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
});
