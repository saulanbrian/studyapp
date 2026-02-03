import { Database } from "@/supabase/types/supabase.data.types";

type MultipleChoiceQuestion = {
  type: "multiple_choice";
  choices: {
    text: string;
    is_correct: boolean
  }[]
}

type TrueOrFalseQuestion = {
  type: "true_or_false";
  choices: {
    value: boolean;
    is_correct: boolean
  }[]
}

type Question = {
  question: string;
} & (TrueOrFalseQuestion | MultipleChoiceQuestion)

type Q = Database["public"]["Tables"]["quizzes"]["Row"]

export type Quiz = Omit<Q, "content"> & {
  content: {
    questions: Question[]
  } | null
}


export type QuizWithMetadata = Quiz & {
  summaryTitle: string
}

