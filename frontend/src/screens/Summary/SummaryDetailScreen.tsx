import { useGetSummary } from "@/src/api/queries/summaries";
import { LoadingScreen, ThemedScreen, ThemedText } from "@/src/components";
import { S } from "@/src/constants/Styles";
import { SummaryNavigationProp, SummaryStackParamList } from "@/src/navigation/Summary/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Suspense, useCallback, useEffect, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import Markdown, { MarkdownProps } from 'react-native-markdown-display'
import { StyleSheet } from "react-native-unistyles";


type SummaryDetailRouteProp = RouteProp<SummaryStackParamList, "SummaryDetail">

export default function SummaryDetailScreen() {

  const { params: { id } } = useRoute<SummaryDetailRouteProp>()

  return (
    <ThemedScreen style={S.centerContainer}>
      <Suspense fallback={LoadingScreen()}>
        <Details id={id} />
      </Suspense>
    </ThemedScreen>
  )
}

const Details = ({ id }: { id: string }) => {

  const { data } = useGetSummary(id)

  const processedContent = useMemo(() => {
    return data.content
      ?.split(/\r?\n/)
      .filter(line => line.trim() !== '---')
      .join('\n')
  }, [data])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Markdown style={mdStyle as MarkdownProps["style"]}>
        {processedContent}
      </Markdown>
    </ScrollView>
  )
}

const mdStyle = StyleSheet.create(theme => ({
  body: {
    fontSize: 16,
    lineHeight: 26,
    paddingVertical: 10,
    color: theme.colors.textPrimary,
  },
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 16,
    color: theme.colors.textPrimary,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 14,
    color: theme.colors.textPrimary,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 12,
    color: theme.colors.textPrimary,
  },
  heading4: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: theme.colors.textPrimary,
  },
  heading5: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: theme.colors.textPrimary,
  },
  heading6: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 6,
    color: theme.colors.textPrimary,
  },
  strong: {
    fontWeight: '700',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: theme.colors.primaryLight,
    textDecorationLine: 'underline',
  },
  list_item: {
    fontSize: 16,
    lineHeight: 26,
    marginVertical: 6,
    paddingLeft: 14,
  },
  blockquote: {
    backgroundColor: theme.colors.disabledBg,
    borderLeftWidth: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  image: {
    marginVertical: 14,
    borderRadius: 8,
  },
}));
