export type Summary = {
  id: string;
  content: string;
  title: string;
  cover: string | null;
  quiz_id: string | null;
} & (
    | { status: 'processed' | 'processing' }
    | { status: 'error'; error_message: string }
  )



export type Quiz = {
  id: string;
  sunmary_id: string;
  summary_title: string;
  questions: Question[];
}

type Question = {
  id: string;
  question_text: string;
  options: Option[];
}

type Option = {
  option_text: string;
  is_correct: boolean;
}
