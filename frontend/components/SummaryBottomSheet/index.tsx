import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProps, BottomSheetProps, BottomSheetView, useBottomSheet, useBottomSheetModal } from '@gorhom/bottom-sheet'
import { ThemedText, ThemedView } from '../ui'
import { useThemeContext } from '@/context/Theme'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Summary } from '@/types/data'
import { forwardRef, useCallback } from 'react'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { useMutation } from '@tanstack/react-query'
import useSummaryUpdater from '@/api/updater/summary'

type SummaryBottomSheetProps = Omit<BottomSheetModalProps, 'children' | 'index'> & {
  selectedSummary: Summary | null;
}


const SummaryBottomSheet = forwardRef<BottomSheetModal, SummaryBottomSheetProps>(({
  snapPoints,
  selectedSummary,
  ...props
}, ref) => {

  const { theme } = useThemeContext()

  if (!selectedSummary) return null

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['20%']}
      animateOnMount
      backgroundStyle={{ backgroundColor: theme.surface }}
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...props}
        />
      )}
      {...props}
    >
      <BottomSheetView style={[
        { backgroundColor: theme.surface },
        styles.container
      ]}
      >
        <ToggleFavoriteButton summary={selectedSummary} />
      </BottomSheetView>
    </BottomSheetModal>
  )
})



const ToggleFavoriteButton = ({ summary }: { summary: Summary }) => {

  const { getApi } = useAuthenticatedRequest()
  const { updateSummary, addOrRemoveFromFavorites } = useSummaryUpdater()
  const { dismiss } = useBottomSheetModal()
  const { theme } = useThemeContext()

  const { mutate: toggle } = useMutation<Summary>({
    mutationFn: async () => {

      dismiss()

      const api = await getApi()
      if (api) {
        updateSummary({
          id: summary.id,
          updateField: { favorite: !summary.favorite }
        })
        addOrRemoveFromFavorites(
          {
            ...summary,
            favorite:!summary.favorite
          },
          summary.favorite ? 'remove' : 'add'
        )

        const res = await api.patch(`summary/${summary.id}`, { favorite: !summary.favorite })
        return res.data
      }
    },
    onError: (e) => {
      updateSummary({
        id: summary.id,
        updateField: { ...summary }
      })
      addOrRemoveFromFavorites(summary, summary.favorite ? 'add' : 'remove')
    }
  })

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => toggle()}
    >
      <MaterialIcons
        name={summary.favorite ? 'favorite' : 'favorite-outline'}
        size={28}
        color={theme.iconAccent}
      />
      <ThemedText style={{ fontSize: 24 }}>
        {summary.favorite ? 'remove from favorite' : 'add to favorite'}
      </ThemedText>
    </TouchableOpacity>
  )
}


export default SummaryBottomSheet

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center'
  }
})
