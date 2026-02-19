import { useRef } from 'react';
import { PanResponder } from 'react-native';

const EDGE_WIDTH = 24;
const SWIPE_THRESHOLD = 60;

export function useSwipeBack(onBack: () => void) {
  const startX = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, moveX } = gestureState;
        return moveX <= EDGE_WIDTH && dx > 10;
      },
      onPanResponderGrant: (_, gestureState) => {
        startX.current = gestureState.x0;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        if (dx >= SWIPE_THRESHOLD) {
          onBack();
        }
      },
    })
  ).current;

  return panResponder;
}
