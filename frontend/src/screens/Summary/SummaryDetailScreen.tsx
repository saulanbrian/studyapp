import { useGetSummary } from "@/src/api/queries/summaries";
import { ThemedScreen, ThemedText } from "@/src/components";
import ThemedButton, { AnimatedThemedButton } from "@/src/components/ThemedButton";
import { S } from "@/src/constants/Styles";
import { SummaryNavigationProp, SummaryStackParamList } from "@/src/navigation/Summary/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Suspense, useCallback, useEffect } from "react";
import { View } from "react-native";


type SummaryDetailRouteProp = RouteProp<SummaryStackParamList, "SummaryDetail">

export default function SummaryDetailScreen() {

  const { params: { id } } = useRoute<SummaryDetailRouteProp>()
  const navigation = useNavigation<SummaryNavigationProp>()

  const handlePress = useCallback(() => {
    navigation.goBack()
  }, [])

  return (
    <ThemedScreen style={S.centerContainer}>
      <Suspense>
        <Details id={id} />
      </Suspense>
      <ThemedButton
        title={"go back"}
        onPress={handlePress}
      />
    </ThemedScreen>
  )
}

const Details = ({ id }: { id: string }) => {
  const { data } = useGetSummary(id)

  return (
    <View>
      <ThemedText>{data.title}</ThemedText>
      <ThemedText>{data.description}</ThemedText>
    </View>
  )
}
