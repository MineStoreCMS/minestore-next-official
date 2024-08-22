import { Notification } from './notification';
import { TLevel } from './level';
import { toast } from 'react-hot-toast';

export const notify = (message: string, level: TLevel = 'basic') => {
    toast.custom((t) => <Notification id={t.id} message={message} level={level} t={t} />, {
        duration: 3000
    });
};
