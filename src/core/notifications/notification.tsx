import { joinClasses } from '@helpers/join-classes';
import { FC, useEffect, useState } from 'react';
import { TLevel } from './level';
import toast, { Toast, CheckmarkIcon } from 'react-hot-toast';
import { XCircle } from 'lucide-react';

type NotificationProps = {
    id: string;
    message: string;
    level: TLevel;
    t?: Toast;
};

export const Notification: FC<NotificationProps> = ({ id, message, level }) => {
    const styles = {
        defaults: {
            container: 'rounded w-96 py-4 px-6 border-b-4 flex-row text-white'
        },

        basic: {
            container: 'bg-gray-600/70 border-gray-900'
        },
        red: {
            container: 'bg-red-900/70 border-red-900'
        },
        green: {
            container: 'bg-green-900/70 border-green-900'
        }
    };

    const [isEntering, setIsEntering] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);

    const remove = () => {
        toast.remove(id);
        setIsLeaving(true);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsEntering(false);
        }, 150);

        return () => clearTimeout(timeoutId);
    }, []);

    const transitionClassNames = joinClasses({
        'opacity-0 scale-50': isEntering,
        'opacity-100 scale-100': !isEntering && !isLeaving,
        'opacity-0 scale-75': isLeaving,
        'transition-all duration-150': isEntering || isLeaving
    });

    return (
        <div
            onClick={remove}
            className={joinClasses(
                styles.defaults.container,
                styles[level].container,
                transitionClassNames
            )}
        >
            {level === 'green' && <CheckmarkIcon />}
            {level === 'red' && (
                <div className="text-2xl">
                    <XCircle />
                </div>
            )}
            <span className="ml-4 font-bold">{message}</span>
        </div>
    );
};
