import { ThemedScreen, ThemedText } from "@/src/components";
import ThemedButton, { AnimatedThemedButton } from "@/src/components/ThemedButton";
import { S } from "@/src/constants/Styles";
import { SummaryNavigationProp, SummaryStackParamList } from "@/src/navigation/Summary/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import { Modal } from "react-native";


type SummaryDetailRouteProp = RouteProp<SummaryStackParamList, "SummaryDetail">

export default function SummaryDetailScreen() {

  const { params: { id } } = useRoute<SummaryDetailRouteProp>()
  const navigation = useNavigation<SummaryNavigationProp>()

  const handlePress = useCallback(() => {
    navigation.goBack()
  }, [])

  return (
    <ThemedScreen style={S.centerContainer}>
      <ThemedText>detail for summary: {id}</ThemedText>
      <ThemedButton
        title={"go back"}
        onPress={handlePress}
      />
    </ThemedScreen>
  )
}
