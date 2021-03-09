export interface ITextSuggestOption {
  text: string;
  score: number;
  freq: number;
}

export interface ITextSuggestResult {
  suggest: {
    [key: string]: Array<{
      text: string;
      offset: number;
      length: number;
      options: Array<ITextSuggestOption>;
    }>;
  };
}
