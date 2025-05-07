export type Summary = {
  id: string;
  content: string;
  title: string;
  status: 'processed' | 'error' | 'processing';
  cover: string | null;
}
