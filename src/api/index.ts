import { AxiosInstance } from 'axios';

import { auth } from './endpoints/auth';
import { getCategories } from './endpoints/categories';
import { getCategoryDetails } from './endpoints/category';
import { getSettings } from './endpoints/settings';
import { getUser } from './endpoints/user';
import { getCart } from './endpoints/cart';
import { getPaymentMethods } from './endpoints/get-payment-methods';
import { updateItemCount } from './endpoints/update-item-count';
import { getRecommends } from './endpoints/recommends';
import { getItem } from './endpoints/item';
import { addToCart } from './endpoints/add-to-cart';
import { getAnnouncement } from './endpoints/get-announcement';
import { checkout } from './endpoints/checkout';
import { getProfile } from './endpoints/get-profile';
import { discordWidget } from './endpoints/discord-widget';
import { getServerOnline } from './endpoints/get-server-online';
import { getGift } from './endpoints/get-gift';
import { acceptCoupon } from './endpoints/accept-coupon';
import { removeFromCart } from './endpoints/remove-from-cart';
import { removeCoupon } from './endpoints/remove-coupon';
import { getFeaturedDeals } from './endpoints/get-featured-deals';
import { setProductVariable } from './endpoints/set-product-variable';
import { setSelectedServer } from './endpoints/set-selected-server';
import { setCustomPrice } from './endpoints/set-custom-price';
import { inGameAuthAttempt } from './endpoints/in-game-auth-attempt';
import { inGameAuth } from './endpoints/in-game-auth';
import { getCustomPage } from './endpoints/get-custom-page';
import { removeGiftcard } from './endpoints/remove-giftcard';
import { acceptReferral } from './endpoints/accept-referral';
import { removeReferral } from './endpoints/remove-referral';

export const getEndpoints = (fetcher: AxiosInstance) => {
    return {
        auth: auth(fetcher),
        attemptAuthInGame: inGameAuthAttempt(fetcher),
        inGameAuth: inGameAuth(fetcher),
        getUser: getUser(fetcher),
        getCategoryDetails: getCategoryDetails(fetcher),
        getSettings: getSettings(fetcher),
        getCategories: getCategories(fetcher),
        getCart: getCart(fetcher),
        getPaymentMethods: getPaymentMethods(fetcher),
        updateItemCount: updateItemCount(fetcher),
        removeItemFromCart: removeFromCart(fetcher),
        getRecommends: getRecommends(fetcher),
        getItem: getItem(fetcher),
        addToCart: addToCart(fetcher),
        getAnnouncement: getAnnouncement(fetcher),
        checkout: checkout(fetcher),
        getProfile: getProfile(fetcher),
        discordWidget: discordWidget(fetcher),
        getServerOnline: getServerOnline(fetcher),
        getGift: getGift(fetcher),
        acceptCoupon: acceptCoupon(fetcher),
        acceptReferral: acceptReferral(fetcher),
        removeReferral: removeReferral(fetcher),
        removeCoupon: removeCoupon(fetcher),
        removeGiftCard: removeGiftcard(fetcher),
        getFeaturedDeals: getFeaturedDeals(fetcher),
        setProductVariable: setProductVariable(fetcher),
        setSelectedServer: setSelectedServer(fetcher),
        setCustomPrice: setCustomPrice(fetcher),
        getCustomPage: getCustomPage(fetcher)
    };
};
