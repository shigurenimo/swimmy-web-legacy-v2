export interface DocsQuery {
  limit?: number;
  orderBy?: {
    field: string;
    direction: any;
  };
  layer?: number | null;
  startAt?: string | null;
  startAfter?: string | null;
}
