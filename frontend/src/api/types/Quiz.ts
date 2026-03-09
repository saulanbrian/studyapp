import { Database } from "@/supabase/types/supabase.data.types";


export enum QuestionType {
  TrueOrFalse = "true_or_false",
  MultipleChoice = "multiple_choice",
}

type BaseChoice = {
  is_correct: boolean;
}

export type MultipleChoiceOption = BaseChoice & { text: string }
export type TrueOrFalseOption = BaseChoice & { value: boolean }

export type MultipleChoiceQuestion = {
  type: QuestionType.MultipleChoice;
  choices: MultipleChoiceOption[]
}

export type TrueOrFalseQuestion = {
  type: QuestionType.TrueOrFalse;
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

