export type Summary = {
  id: string;
  content: string;
  title: string;
  cover: string | null;
  quiz_id: string | null;
  favorite: boolean;
} & (
    | { status: 'processed' | 'processing' }
    | { status: 'error'; error_message: string }
  )



export type Quiz = {
  id: string;
  summary_id: string;
  summary_title: string;
  summary_cover: string | null;
  status: 'processing' | 'processed' | 'error';
  highest_score: number;
  number_of_questions: number;
  questions: Question[];
}

export type Question = {
  id: string;
  question_text: string;
  options: Option[];
}

export type Option = {
  id: string;
  option_text: string;
  is_correct: boolean;
}

export type UpdatableDataFields<T extends { id: string }> = Partial<Omit<T, 'id'>>

