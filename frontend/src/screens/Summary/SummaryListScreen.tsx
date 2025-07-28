import { ThemedScreen, ThemedText } from "@/src/components";
import ThemedButton, { AnimatedThemedButton } from "@/src/components/ThemedButton";
import { S } from "@/src/constants/Styles";
import { SummaryNavigationProp } from "@/src/navigation/Summary/types";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { TextInput } from "react-native";

export default function SummaryListScreen() {

  const [lookup, setLookup] = useState('')
  const navigation = useNavigation<SummaryNavigationProp>()

  const handlePress = useCallback(() => {
    navigation.navigate("SummaryDetail", { id: lookup })
  }, [lookup])

  return (
    <ThemedScreen style={S.centerContainer}>
      <TextInput
        value={lookup}
        onChangeText={setLookup}
        placeholder={"which summary do you want to go"}
      />
      <ThemedButton
        title={"go to summary"}
        onPress={handlePress}
      />
    </ThemedScreen>
  )

}
