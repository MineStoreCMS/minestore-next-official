import { Config } from '@/app/providers/config-provider';

export const extractConfigValue = (id: string, config: Config) => {
    const options = config.config.flatMap((header) => header.options);
    const option = options.find((option) => option.id === id);

    const value = option?.value !== '' ? option?.value : option?.default;

    return value as string;
};
