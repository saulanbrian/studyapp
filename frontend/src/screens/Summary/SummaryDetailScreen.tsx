import { useGetSummary } from "@/src/api/queries/summaries";
import { LoadingScreen, ThemedScreen, ThemedText } from "@/src/components";
import { S } from "@/src/constants/Styles";
import { SummaryNavigationProp, SummaryStackParamList } from "@/src/navigation/Summary/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Suspense, useCallback, useEffect, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import Markdown, { MarkdownProps } from 'react-native-markdown-display'


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
      <Markdown style={mdStyle}>
        {processedContent}
      </Markdown>
    </ScrollView>
  )
}


const mdStyle: MarkdownProps["style"] = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1C1C1E', // dark text
    paddingVertical: 8,
  },
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 12,
    color: '#111',
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 10,
    color: '#111',
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 8,
    color: '#111',
  },
  heading4: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 6,
    color: '#111',
  },
  heading5: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 4,
    color: '#111',
  },
  heading6: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 2,
    color: '#111',
  },
  strong: {
    fontWeight: '700',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: '#007AFF', // iOS blue
    textDecorationLine: 'underline',
  },
  list_item: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 4,
    paddingLeft: 12,
  },
  blockquote: {
    backgroundColor: '#F0F0F5',
    borderLeftWidth: 4,
    borderLeftColor: '#C0C0C8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
    color: '#555',
    fontStyle: 'italic',
  },
  code_inline: {
    backgroundColor: '#EFEFEF',
    borderRadius: 4,
    paddingHorizontal: 4,
    fontFamily: 'Courier',
    fontSize: 14,
  },
  code_block: {
    backgroundColor: '#EFEFEF',
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    fontFamily: 'Courier',
    fontSize: 14,
    lineHeight: 20,
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginVertical: 16,
  },
  image: {
    marginVertical: 12,
    borderRadius: 8,
  },
};
