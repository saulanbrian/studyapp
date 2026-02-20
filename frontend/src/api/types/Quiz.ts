import { Database } from "@/supabase/types/supabase.data.types";


type BaseChoice = {
  is_correct: boolean;
}

export type MultipleChoiceOption = BaseChoice & { text: string }
export type TrueOrFalseOption = BaseChoice & { value: boolean }


type MultipleChoiceQuestion = {
  type: "multiple_choice";
  choices: MultipleChoiceOption[]
}

type TrueOrFalseQuestion = {
  type: "true_or_false";
  choices: TrueOrFalseOption[]
}

export type Question = {
  question: string;
} & (TrueOrFalseQuestion | MultipleChoiceQuestion)

type Q = Database["public"]["Tables"]["quizzes"]["Row"]

export type Quiz = Omit<Q, "content"> & {
  content: {
    questions: Question[]
  } | null;
  summaryTitle: string;
}

