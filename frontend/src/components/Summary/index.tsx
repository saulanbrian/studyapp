import { Summary } from "@/src/api/types/summary";
import PressContainer from "./PressContainer";
import SummaryCard from "./SummaryCard";



export default function SummaryComponent({
  id,
  ...summary
}: Summary) {


  return (
    <PressContainer id={id} status={summary.status}>
      <SummaryCard {...{ id, ...summary }} />
    </PressContainer>
  )
}
