export interface IDocumentUpdateResult {
  _index: string;
  _type: string;
  _id: string;
  _version: 3;
  result: string;
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
  _seq_no: number;
  _primary_term: number;
}
