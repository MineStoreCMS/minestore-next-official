import { TCart } from '@/types/cart';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useCartItemPreferences } from '@/app/(pages)/categories/utils/use-cart-item-preferences';
import { DescriptionTooltip } from './item-description-tooltip';

export function SelectItemServer({ item }: { item: TCart['items'][number] }) {
    const { allowed_servers } = item;
    const { handleSelectServer } = useCartItemPreferences();

    if (allowed_servers.length === 0) return null;

    const selectedServer = item.selected_server
        ? allowed_servers.find((s) => s.server_id === item.selected_server)?.server_name
        : 'Select server';

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Server Selection
                </p>
                <DescriptionTooltip
                    description={"Select the server where you'd like to receive the item."}
                />
            </div>
            <Select
                onValueChange={(value) =>
                    handleSelectServer({ id: item.id, server_id: Number(value) })
                }
            >
                <SelectTrigger>
                    <SelectValue placeholder={selectedServer} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Server</SelectLabel>
                        {allowed_servers.map((server) => (
                            <SelectItem key={server.server_id} value={`${server.server_id}`}>
                                {server.server_name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
