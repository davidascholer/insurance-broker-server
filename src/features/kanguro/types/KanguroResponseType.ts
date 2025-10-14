type WaitingPeriod = {
  value: number;
  unit: string;
};

type Rate = {
  reimbursement: number;
  deductible: number;
  total_premium: number;
  max_allowed_discount: number;
  discount: number;
  applied_discount: number;
  downpayment: number;
  monthly_payment: number;
  pre_discount_monthly_payment: number;
  total_state_tax: number;
  downpayment_state_tax: number;
  monthly_payment_state_tax: number;
  total_municipal_tax: number;
  downpayment_municipal_tax: number;
  monthly_payment_municipal_tax: number;
  total_exam_fee: number;
  monthly_exam_fee: number;
};

type Plan = {
  id: number;
  plan_code: string;
  plan_desc: string;
  accident_only: number;
  plan_limit: number | string;
  aq_product_id: string;
  default_deductible: number;
  default_reimbursement: number;
};

type PlanWithRates = {
  id: number;
  plan_code: string;
  plan_desc: string;
  accident_only: number;
  plan_limit: number | string;
  aq_product_id: string;
  default_deductible: number;
  default_reimbursement: number;
  rates: Rate[];
};

type Coverage = {
  annual_limit: string;
  reimbursement: string;
  deductible: string;
  wellness: any;
  exam_fees: any;
  plan: Plan;
};

type Pet = {
  uuid: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  species: string;
  breed: string;
  has_conditions: number;
  has_microchip: number;
  has_existing_conditions: number;
  is_neutered: number;
  vaccination_uptodate: number;
  microchip_no: string | null;
  purchase_price: number | null;
  start_date: string;
  created_at: string;
  updated_at: string;
  policy_id: string | null;
  underwriting_questions: any;
  coverage: Coverage;
  end_date: string;
  plans: PlanWithRates[];
  default_plan_id: number;
  deductibles: {
    default: number;
    list: number[][];
  };
  reimbursement: {
    default: number;
    list: number[][];
  };
  wellness_plans: any[];
  start_date_accident: string;
  waiting_period_accident: WaitingPeriod;
  start_date_illness: string;
  waiting_period_illness: WaitingPeriod;
  start_date_knee_ligament: string;
  waiting_period_knee_ligament: WaitingPeriod;
  start_date_wellness: string;
  waiting_period_wellness: WaitingPeriod;
};

export type KanguroResponseType = {
  id: number;
  uuid: string;
  first_name: string | null;
  last_name: string | null;
  phone: string;
  phone_sent_sms: number;
  email: string;
  street1: string | null;
  street2: string | null;
  city: string | null;
  state: string;
  zip_code: string;
  quote_page: number;
  purchase_plan_page: number;
  terms_and_conditions: number;
  policy_completed: number;
  policy_completed_type: string;
  version: string;
  api: string;
  password: string | null;
  remember_token: string | null;
  welcome_email_sent: string | null;
  quote_url: string | null;
  referrer_url: string | null;
  partner: string;
  partner_meta: string | null;
  partner_meta_coverage: string | null;
  affiliate_id: string | null;
  contact_method: string | null;
  notes: string | null;
  follow_up_date: string | null;
  quoted_by: string;
  sold_by: string | null;
  assisted_by: string | null;
  program_id: string | null;
  dob: string | null;
  do_not_email: number;
  do_not_phone: number;
  do_not_post: number;
  do_not_sms: number;
  title: string | null;
  secondary_email: string | null;
  secondary_first_name: string | null;
  secondary_phone: string | null;
  secondary_last_name: string | null;
  secondary_title: string | null;
  discount_code: string | null;
  created_at: string;
  updated_at: string;
  policy_purchased_at: string | null;
  payment_period: string | null;
  fees: number | null;
  customer_id: string | null;
  entity_source_id: string | null;
  quote_method: string;
  referring_entity: string;
  last_touch_entity: string | null;
  producer: string | null;
  quoting_platform: string;
  selling_platform: string | null;
  initial_quote_user: string | null;
  selling_user: string | null;
  brand_id: number;
  is_test_quote: boolean;
  pets: Pet[];
  url: string;
  checkout_url: string;
  partner_reference_data: any[];
};

export type KanguroCompressedResponseType = {
  reimbursementLimitOption: number;
  reimbursementPercentageOption: number;
  deductibleOption: number;
  monthlyPrice: number;
  extras: {
    planDesc: string;
    planCode: string;
    checkoutUrl: string;
    precheckoutUrl: string;
    relatedPlans?: KanguroCompressedResponseType[];
  };
};
