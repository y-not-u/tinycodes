export type Snippet = {
  id: string;
  title: string;
  lang: string;
  content: string;
  datetime: number;
  labels?: string[];
};

export type NewSnippet = {
  title: string;
  content: string;
  lang: string;
};
