'use client';

import { FC } from 'react';
import { TSettings } from '@/types/settings';
import { convertToLocalCurrency } from '@helpers/convert-to-local-currency';
import { useCurrencyStore } from '@/stores/currency';
import { useUserStore } from '@/stores/user';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

type UserBarProps = {
    settings: TSettings;
};

export const UserBar: FC<UserBarProps> = ({ settings }) => {
    const { user } = useUserStore();

    return (
        <>
            <DonationGoal goal={settings.goals} />

            {user && (
                <>
                    <div className="relative ml-auto mr-2 sm:mr-8 flex-col text-right">
                        <span className="text-sm font-bold text-white sm:text-base md:text-2xl dark:text-accent-foreground">
                            {user.username}
                        </span>
                        {settings.is_virtual_currency === 1 && (
                            <span className="ml-2 sm:ml-4 text-xs text-accent-foreground/80 sm:text-sm md:text-base">
                                {user.virtual_currency} {settings.virtual_currency}
                            </span>
                        )}
                    </div>

                    <div className="relative top-[-45px] hidden h-[200px] overflow-hidden md:block">
                        <Link href="/profile">
                            <Image
                                src={user.avatar || ''}
                                alt="Avatar"
                                className="h-[270px] w-[111px] -scale-x-100"
                                width={111}
                                height={270}
                            />
                        </Link>
                    </div>
                </>
            )}
        </>
    );
};

function DonationGoal({ goal }: { goal: TSettings['goals'] }) {
    const { currency } = useCurrencyStore();

    if (!goal.length) return null;

    const { current_amount, goal_amount, name } = goal[0];

    const filled = convertToLocalCurrency(current_amount).toFixed(2);
    const goalValue = convertToLocalCurrency(goal_amount).toFixed(2);

    const percent = (current_amount / goal_amount) * 100;

    return (
        <div className="relative flex-col gap-2">
            <div className="flex items-center gap-6">
                <div>
                    <p className="text-lg font-bold text-white sm:text-2xl dark:text-accent-foreground">
                        <span className="sr-only">Donation Goal</span>
                        {name}
                    </p>
                    <p className="text-sm text-accent-foreground/80 sm:text-base">
                        <span className="sr-only">
                            The goal is {name} and the current amount is {filled} out of {goalValue}{' '}
                            {currency?.name || 'USD'}
                        </span>
                        {filled} / {goalValue} {currency?.name || ''}
                    </p>
                </div>
                <p className="font-bold text-white dark:text-accent-foreground">
                    <span className="sr-only">Progress</span>
                    {percent.toFixed(2)}%
                </p>
            </div>

            <Progress value={percent} className="h-2" />
        </div>
    );
}

