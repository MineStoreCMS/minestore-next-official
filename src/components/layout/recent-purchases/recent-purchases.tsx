import { DescriptionTooltip } from '@/app/(pages)/checkout/components/cart-item/item-description-tooltip';
import Image from 'next/image';
import Link from 'next/link';
import { TSettings } from '@/types/settings';

type RecentPurchasesProps = {
    limit?: number;
    mobileLimit?: number;
    recentDonators?: TSettings['recentDonators'];
    isProfileEnabled?: boolean;
};

export const RecentPurchases = ({ 
    limit = 10, 
    mobileLimit = 5,
    recentDonators = [],
    isProfileEnabled = false
}: RecentPurchasesProps) => {
    // Server-rendered with desktop limit, client can hide on mobile with CSS
    const displayedDonators = recentDonators.slice(0, limit);
    const mobileDonators = recentDonators.slice(0, mobileLimit);
    const remainingDesktop = limit - displayedDonators.length;
    const remainingMobile = mobileLimit - mobileDonators.length;

    return (
        <div>
            {/* Desktop view */}
            <div className="hidden md:grid grid-cols-[repeat(auto-fill,minmax(min(57px,100%),1fr))] gap-2">
                {displayedDonators.length > 0 ? (
                    <>
                        {displayedDonators.map((item, index) => (
                            <Donor 
                                key={index} 
                                username={item.username} 
                                avatar={item.avatar} 
                                isProfileEnabled={isProfileEnabled}
                            />
                        ))}
                        {remainingDesktop > 0 &&
                            Array.from({ length: remainingDesktop }).map((_, index) => (
                                <SkeletonDonor key={`skeleton-${index}`} />
                            ))}
                    </>
                ) : (
                    Array.from({ length: limit }).map((_, index) => <SkeletonDonor key={index} />)
                )}
            </div>
            {/* Mobile view */}
            <div className="grid md:hidden grid-cols-[repeat(auto-fill,minmax(min(57px,100%),1fr))] gap-2">
                {mobileDonators.length > 0 ? (
                    <>
                        {mobileDonators.map((item, index) => (
                            <Donor 
                                key={index} 
                                username={item.username} 
                                avatar={item.avatar}
                                isProfileEnabled={isProfileEnabled}
                            />
                        ))}
                        {remainingMobile > 0 &&
                            Array.from({ length: remainingMobile }).map((_, index) => (
                                <SkeletonDonor key={`skeleton-mobile-${index}`} />
                            ))}
                    </>
                ) : (
                    Array.from({ length: mobileLimit }).map((_, index) => <SkeletonDonor key={index} />)
                )}
            </div>
        </div>
    );
};

function Donor({ username, avatar, isProfileEnabled }: { username: string; avatar: string; isProfileEnabled?: boolean }) {
    return (
        <DescriptionTooltip description={username} html={false}>
            <DonorProfileLink username={username} isProfileEnabled={isProfileEnabled}>
                <Image
                    src={avatar}
                    alt={username}
                    width={60}
                    height={60}
                    className="h-full w-full rounded-md object-cover"
                />
            </DonorProfileLink>
        </DescriptionTooltip>
    );
}

function DonorProfileLink({ username, children, isProfileEnabled }: { username: string; children: React.ReactNode; isProfileEnabled?: boolean }) {
    if (isProfileEnabled) {
        return (
            <Link
                href={`/profile/${username}`}
                className="h-[60px] w-[60px] overflow-hidden rounded-md"
            >
                {children}
            </Link>
        );
    }

    return <div className="h-[60px] w-[60px] overflow-hidden rounded-md">{children}</div>;
}

function SkeletonDonor({ className, ...props }: React.ComponentPropsWithoutRef<'div'> & { className?: string }) {
    return (
        <div
            className={`h-[60px] w-[60px] rounded-md bg-accent ${className || ''}`}
            {...props}
        />
    );
}
