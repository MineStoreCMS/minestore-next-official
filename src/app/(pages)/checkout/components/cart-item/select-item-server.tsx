import { useEffect, useRef } from 'react';
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

   const isFirstRender = useRef(true);

   const uniqueServers = allowed_servers.filter(
      (server, index, self) =>
         index === self.findIndex((s) => s.server_id === server.server_id)
   );

   useEffect(() => {
      if (isFirstRender.current && uniqueServers.length > 0 && item.selected_server === undefined) {
         handleSelectServer({
            id: item.id,
            server_id: uniqueServers[0].server_id
         });
      }

      isFirstRender.current = false;
   }, [uniqueServers, item.id, item.selected_server, handleSelectServer]);

   if (uniqueServers.length === 0) return null;

   const selectedServerName = item.selected_server
      ? uniqueServers.find((s) => s.server_id === item.selected_server)?.server_name
      : undefined;

   const isRequired = uniqueServers.length > 0;
   const isSelected = !!item.selected_server;

   return (
      <div className="grid gap-2">
         <div className="flex items-center justify-between">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
               Server Selection{isRequired && !isSelected && " *"}
            </p>
            <DescriptionTooltip
               description={"Select the server where you'd like to receive the item."}
            />
         </div>
         <Select
            onValueChange={(value) =>
               handleSelectServer({ id: item.id, server_id: Number(value) })
            }
            required={isRequired}
            value={item.selected_server ? `${item.selected_server}` : undefined}
         >
            <SelectTrigger className={isRequired && !isSelected ? "border-red-500" : ""}>
               <SelectValue placeholder="Select server">
                  {selectedServerName}
               </SelectValue>
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                  <SelectLabel>Server</SelectLabel>
                  {uniqueServers.map((server) => (
                     <SelectItem key={server.server_id} value={`${server.server_id}`}>
                        {server.server_name}
                     </SelectItem>
                  ))}
               </SelectGroup>
            </SelectContent>
         </Select>
         {isRequired && !isSelected && (
            <p className="text-xs text-red-500">Please select a server</p>
         )}
      </div>
   );
}
