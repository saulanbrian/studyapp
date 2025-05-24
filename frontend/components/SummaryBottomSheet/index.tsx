import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProps, BottomSheetProps, BottomSheetView, useBottomSheet, useBottomSheetModal } from '@gorhom/bottom-sheet'
import { ThemedText, ThemedView } from '../ui'
import { useThemeContext } from '@/context/Theme'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Summary } from '@/types/data'
import { forwardRef, useCallback } from 'react'
import { useToggleFavorite } from '@/api/mutations/summary'

type SummaryBottomSheetProps = Omit<BottomSheetModalProps, 'children' | 'index'> & {
  selectedSummary: Summary | null;
}


const SummaryBottomSheet = forwardRef<BottomSheetModal, SummaryBottomSheetProps>(({
  snapPoints,
  selectedSummary,
  ...props
}, ref) => {

  const { theme } = useThemeContext()

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
        {selectedSummary && (
          <ToggleFavoriteButton
            isFavorite={selectedSummary.favorite}
            summaryId={selectedSummary.id}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  )
})



const ToggleFavoriteButton = ({
  summaryId,
  isFavorite
}: {
  summaryId: string;
  isFavorite: boolean
}) => {

  const { theme } = useThemeContext()
  const { mutateAsync: toggle } = useToggleFavorite(summaryId)
  const { dismiss } = useBottomSheetModal()

  const toggleFavorite = useCallback(() => {
    toggle({ id: summaryId, favorite: !isFavorite })
    dismiss()
  }, [summaryId, isFavorite])

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleFavorite}
    >
      <MaterialIcons
        name={isFavorite ? 'favorite' : 'favorite-outline'}
        size={28}
        color={theme.iconAccent}
      />
      <ThemedText style={{ fontSize: 24 }}>
        {isFavorite ? 'remove from favorite' : 'add to favorite'}
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
