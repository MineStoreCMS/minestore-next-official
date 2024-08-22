'use client';

import { DescriptionTooltip } from '@/app/(pages)/checkout/components/cart-item/item-description-tooltip';
import { useSettingsStore } from '@/stores/settings';
import { joinClasses } from '@helpers/join-classes';
import Image from 'next/image';
import Link from 'next/link';

export const RecentPurchases = ({ limit = 10 }: { limit: number }) => {
    const { settings } = useSettingsStore();

    const recentDonators = settings?.recentDonators.slice(0, limit) || [];
    const remainingDonators = limit - recentDonators.length;

    return (
        <div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(57px,100%),1fr))] gap-2">
                {recentDonators?.length ? (
                    <>
                        {recentDonators.map((item, index) => (
                            <Donor key={index} username={item.username} avatar={item.avatar} />
                        ))}
                        {remainingDonators > 0 &&
                            Array.from({ length: remainingDonators }).map((_, index) => (
                                <SkeletonDonor key={index} />
                            ))}
                    </>
                ) : (
                    Array.from({ length: limit }).map((_, index) => <SkeletonDonor key={index} />)
                )}
            </div>
        </div>
    );
};

function Donor({ username, avatar }: { username: string; avatar: string }) {
    return (
        <DescriptionTooltip description={username} html={false}>
            <DonorProfileLink username={username}>
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

function DonorProfileLink({ username, children }: { username: string; children: React.ReactNode }) {
    const { settings } = useSettingsStore();
    const isProfileEnabled = settings?.is_profile_enabled;

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

    return <>{children}</>;
}

type SkeletonDonorProps = {
    className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

function SkeletonDonor({ className, ...props }: SkeletonDonorProps) {
    return (
        <div
            className={joinClasses('h-[60px] w-[60px] rounded-md bg-accent', className)}
            {...props}
        />
    );
}
