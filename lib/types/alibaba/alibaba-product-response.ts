export interface AlibabaProductResponse {
  trace_id: string;
  product: {
    keywords: string[];
    owner_member_display_name: string;
    subject: string;
    main_image: {
      watermark_position: string;
      images: string[];
      watermark: string;
      watermark_frame: string;
    };
    display: string;
    description: string;
    pc_detail_url: string;
    language: string;
    wholesale_trade: {
      volume: string;
      batch_number: string;
      package_size: string;
      price: string;
      sale_type: string;
      weight: string;
      deliver_periods: Array<{
        quantity: string;
        process_period: string;
      }>;
      unit_type: string;
      handling_time: string;
      min_order_quantity: string;
      shipping_line_template_id: string;
    };
    gmt_modified: string;
    rts: string;
    product_sku: {
      skus: Array<{
        attr2_value: Record<string, number>;
        inventory_dtolist: Array<{
          store_code: string;
          inventory: string;
        }>;
        bulk_discount_prices: Array<{
          start_quantity: string;
          bulk_discount_price: string;
        }>;
        sku_id: string;
        sku_code: string;
      }>;
      sku_attributes: Array<{
        values: Array<{
          system_value_name: string;
          custom_value_name: string;
          image_url: string;
          value_id_sku: string;
          mark_info: string;
        }>;
        attribute_id_sku: string;
        attribute_name_sku: string;
      }>;
    };
    product_type: string;
    custom_info: {
      custom_contents: Array<{
        min_order_quantity_custom: string;
        custom_type: string;
      }>;
    };
    sourcing_trade: {
      supply_quantity: string;
      supply_period_type: string;
      packaging_desc: string;
      min_order_quantity_sourcing: string;
      fob_min_price: string;
      fob_currency: string;
      min_order_unit_type: string;
      delivery_time: string;
      supply_unit_type: string;
      fob_unit_type: string;
      fob_max_price: string;
      payment_methods: string[];
      delivery_port: string;
      deliver_periods_sourcing: Array<{
        process_period_sourcing: string;
        quantity_sourcing: string;
      }>;
    };
    category_id: string;
    group_id: string;
    smart_edit: string;
    price_type: string;
    owner_member: string;
    attributes: Array<{
      sku_custom_value_name: string;
      attribute_id: string;
      sku_custom_image_url: string;
      attribute_name: string;
      value_id: string;
      value_name: string;
    }>;
    status: string;
  };
  code: string;
  request_id: string;
}