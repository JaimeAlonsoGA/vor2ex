import { AmazonItem } from "./amazonItem";

export interface AmazonResponse {
  numberOfResults: number;
  pagination?: {
    nextToken?: string;
    previousToken?: string;
  };
  refinements?: {
    brands?: Array<{
      numberOfResults: number;
      brandName: string;
    }>;
    categories?: Array<{
      numberOfResults: number;
      displayName: string;
      classificationId: string;
    }>;
  };
  items: AmazonItem[];
}
