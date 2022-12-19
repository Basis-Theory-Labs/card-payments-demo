interface Checkout {
  id?: string;
  name: string;
  homePolicyType?: string;
  homePolicyValue?: number;
  autoPolicyType?: string;
  autoPolicyValue?: number;
  renterPolicyType?: string;
  renterPolicyValue?: number;
  paymentToken: string;
  tokenized?: boolean;
  tenant: string;
}

type Cart = Pick<
  Checkout,
  | 'name'
  | 'homePolicyType'
  | 'homePolicyValue'
  | 'autoPolicyType'
  | 'autoPolicyValue'
>;

export type { Checkout, Cart };
