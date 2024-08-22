import { Cart } from './components/cart';
import { FeaturedDeal } from './components/featured-deal';
import { RedeemCoupon } from './components/redeem-coupon';
import { ReferralCode } from './components/referral-code';
import { PaymentForm } from './components/payment-details/payment-form/payment-form';

export default async function Checkout() {
    return (
        <div className="w-full flex-col gap-8 rounded-[10px] bg-card p-4">
            <Cart />
            <FeaturedDeal />
            <div className="flex flex-wrap gap-4">
                <RedeemCoupon />
                <ReferralCode />
            </div>
            <PaymentForm />
        </div>
    );
}
