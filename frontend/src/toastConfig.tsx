import { BaseToast, BaseToastProps, ToastConfig } from "react-native-toast-message";
import { StyleSheet } from "react-native-unistyles";
import { S } from "./constants/Styles";
import { lightColors } from "./constants/ui/Colors";

export const toastConfig: ToastConfig = {
  neutral: (props) => <CustomToast style={styles.neutral} {...props} />,
  success: (props) => <CustomToast style={styles.success} {...props} />,
  error: (props) => <CustomToast style={styles.error} {...props} />,
  warning: (props) => <CustomToast style={styles.warning} {...props} />
}

const CustomToast = ({ style, ...props }: BaseToastProps) => {
  return <BaseToast
    style={[styles.toast, style]}
    text1Style={styles.text1}
    {...props}
  />
}

const styles = StyleSheet.create(theme => ({
  error: {
    borderLeftColor: theme.colors.error
  },
  neutral: {
    borderLeftColor: theme.colors.primary
  },
  success: {
    borderLeftColor: theme.colors.success
  },
  text1: {
    fontSize: theme.spacing.md,
    color: lightColors.textPrimary,
  },
  toast: {
    borderRadius: theme.radii.sm,
    width: 140,
    height: 40
  },
  warning: {
    borderLeftColor: theme.colors.warning
  }
}))
