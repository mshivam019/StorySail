import { useCallback, useMemo } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export type FeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

export const useHaptic = (feedbackType: FeedbackType = "selection") => {
  const createHapticHandler = useCallback(
    (type: Haptics.ImpactFeedbackStyle) => Platform.OS === "web"
        ? undefined
        : () => Haptics.impactAsync(type),
    [],
  );
  const createNotificationFeedback = useCallback(
    (type: Haptics.NotificationFeedbackType) => Platform.OS === "web"
        ? undefined
        : () => Haptics.notificationAsync(type),
    [],
  );

  const hapticHandlers = useMemo(
    () => ({
      light: createHapticHandler(Haptics.ImpactFeedbackStyle.Light),
      medium: createHapticHandler(Haptics.ImpactFeedbackStyle.Medium),
      heavy: createHapticHandler(Haptics.ImpactFeedbackStyle.Heavy),
      selection: Platform.OS === "web" ? undefined : Haptics.selectionAsync,
      success: createNotificationFeedback(
        Haptics.NotificationFeedbackType.Success,
      ),
      warning: createNotificationFeedback(
        Haptics.NotificationFeedbackType.Warning,
      ),
      error: createNotificationFeedback(Haptics.NotificationFeedbackType.Error),
    }),
    [createHapticHandler, createNotificationFeedback],
  );

  return hapticHandlers[feedbackType];
};
