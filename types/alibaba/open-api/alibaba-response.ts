export interface AlibabaResponse {
  result: {
    total_item: string;
    trace_id: string;
    curr_page: string;
    error_msg?: string;
    error_code?: string;
    page_size: string;
    products: AlibabaProduct[];
  };
  code: string;
  request_id: string;
}

export interface AlibabaProduct {
  gmt_create: string;
  keywords: string[];
  owner_member_display_name: string;
  group_name: string;
  subject: string;
  main_image?: {
    watermark_position: string;
    images: any[];
    watermark: string;
    watermark_frame: string;
  };
  display: string;
  pc_detail_url?: string;
  language: string;
  gmt_modified: string;
  specific: string;
  rts: string;
  product_type: string;
  category_id: string;
  group_id: string;
  smart_edit: string;
  owner_member: string;
  id: string;
  status: string;
}
