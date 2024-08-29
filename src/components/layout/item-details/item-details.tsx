import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { Price } from '@/components/base/price/price';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartStore } from '@/stores/cart';
import { TItem } from '@/types/item';
import { CardActionButtons } from '@layout/card/card-actions';
import { FC, useEffect, useState } from 'react';

const { getItem } = getEndpoints(fetcher);

type DetailsProps = {
    show: boolean;
    id: number;
    onHide(): void;
    available?: boolean;
    route?: 'checkout';
};

export const ItemDetails: FC<DetailsProps> = ({ show, onHide, id, route }) => {
    const { items } = useCartStore();

    const isItemInCart = items.some((x) => x.id === id);

    const [details, setDetails] = useState<TItem>();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        getItem(id, route).then((data) => {
            setDetails(data);
        }).catch((err) => {
            setDetails(undefined);
        });
    }, [id, route]);

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogContent className="w-full max-w-[720px] p-0">
                <DialogHeader className="border-b border-accent p-4 py-6">
                    <DialogTitle className="text-card-foreground">{details?.name}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="prose max-h-[500px] w-full p-4">
                    <div
                        className="prose w-full overflow-y-auto text-muted-foreground prose-headings:text-accent-foreground"
                        dangerouslySetInnerHTML={{ __html: details?.description || '' }}
                    />
                </ScrollArea>
                <DialogFooter className="items-center justify-between gap-2 border-t border-accent p-4 sm:justify-between">
                    <Price
                        value={details?.price || 0}
                        isVirtual={details?.is_virtual_currency_only}
                        className="font-bold"
                    />

                    <div className="flex gap-2">
                        <CardActionButtons
                            isItemInCart={isItemInCart}
                            item={details as TItem}
                            displayFull={false}
                            setAddToCartPressed={setIsAddingToCart}
                            addToCartPressed={isAddingToCart}
                        />
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        // <Modal
        //     show={show}
        //     onClickOutside={onHide}
        //     backgroundColor="rgb(0 0 0 / 0.25)"
        //     className="fixed left-1/2 top-1/2 z-40 m-auto w-full -translate-x-1/2 -translate-y-1/2 rounded bg-card lg:w-[700px]"
        // >
        //     <div className="flex-row items-center rounded bg-accent px-5 py-4 font-bold">
        //         <p className="text-accent-foreground">{details?.name}</p>
        //         <button
        //             aria-label="Close modal"
        //             onClick={onHide}
        //             className="ml-auto flex h-6 w-6 items-center justify-center rounded bg-accent-foreground/10 transition-colors duration-200 hover:bg-accent-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent-foreground/50 focus:ring-offset-2 focus:ring-offset-accent-foreground/10"
        //         >
        //             <X size={14} />
        //         </button>
        //     </div>

        //     <div
        //         className="prose max-h-[600px] w-full overflow-y-auto p-4 text-muted-foreground prose-headings:text-accent-foreground"
        //         dangerouslySetInnerHTML={{ __html: details?.description || '' }}
        //     />

        //     <div className="flex items-center justify-between border-t border-accent p-4">
        //         <Price
        //             value={details?.price || 0}
        //             isVirtual={details?.is_virtual_currency_only}
        //             className="font-bold"
        //         />

        //         <div className="flex gap-2">
        //             <CardActionButtons
        //                 isItemInCart={isItemInCart}
        //                 item={details as TItem}
        //                 displayFull={false}
        //                 setAddToCartPressed={setIsAddingToCart}
        //                 addToCartPressed={isAddingToCart}
        //             />
        //         </div>
        //     </div>
        // </Modal>
    );
};
