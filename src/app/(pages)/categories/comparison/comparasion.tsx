'use client';

import { useEffect, useRef } from 'react';
import { TItem } from '@/types/item';
import { Card } from '@layout/card/card';
import { TCategory, TSubCategory } from '@/types/category-details';
import {
   Table,
   TableCaption,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell
} from '@/components/ui/table';
import { extractCategoryComparisons, extractSubCategoryComparisons } from '../utils/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import { DescriptionTooltip } from '../../checkout/components/cart-item/item-description-tooltip';

type ComparisonProps = {
   category: TCategory;
   subCategory?: TSubCategory;
   categoryItems: TItem[];
};

export const Comparison = ({ categoryItems, category, subCategory }: ComparisonProps) => {
   const selectedItems = subCategory?.items || categoryItems;

   const subCategoryComparisons = extractSubCategoryComparisons(subCategory) || [];
   const categoryComparisons = extractCategoryComparisons(category, categoryItems) || [];

   const comparisons = subCategory ? subCategoryComparisons : categoryComparisons;

   const tableHeadContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const adjustHeights = () => {
         const container = tableHeadContainerRef.current;
         if (!container) return;

         const cards = container.querySelectorAll<HTMLDivElement>('.card');
         const maxHeight = Array.from(cards).reduce(
            (max, card) => Math.max(max, card.offsetHeight),
            0
         );

         cards.forEach((card) => {
            card.style.height = `${maxHeight}px`;
         });
      };

      adjustHeights();

      window.addEventListener('resize', adjustHeights);
      return () => window.removeEventListener('resize', adjustHeights);
   }, [selectedItems]);

   return (
      <Table className="w-full table-fixed overflow-x-auto text-muted-foreground">
         <TableCaption hidden>A list with all the comparisons</TableCaption>
         <TableHeader>
            <TableRow ref={tableHeadContainerRef}>
               <TableHead className="sticky left-0 z-10 w-[200px]">
                  <span className="sr-only">Features</span>
               </TableHead>
               {selectedItems.map((item) => (
                  <TableHead key={item.id} className="w-[270px] py-4">
                     <div className="card">
                        <Card item={item} />
                     </div>
                  </TableHead>
               ))}
            </TableRow>
         </TableHeader>
         <TableBody>
            {comparisons.map((comparison, index) => {
               const bgColor = index % 2 === 0 ? 'bg-card' : 'bg-accent';

               return (
                  <TableRow
                     key={comparison.id}
                     className={
                        'hover:bg-accent2 group divide-x divide-accent even:bg-accent'
                     }
                  >
                     <TableCell
                        className={`sticky left-0 z-10 flex w-[200px] items-center justify-between ${bgColor} group-hover:bg-accent2 transition-colors`}
                     >
                        <p>{comparison.name}</p>
                        {comparison.description && (
                           <DescriptionTooltip description={comparison.description} />
                        )}
                     </TableCell>
                     {comparison.comparisons.map((item) => (
                        <TableCell key={item.comparison_id} className="text-center">
                           <ComparisonIcon value={item.value} type={comparison.type} />
                        </TableCell>
                     ))}
                  </TableRow>
               );
            })}
         </TableBody>
      </Table>
   );
};

function ComparisonIcon({ value, type }: { value: string; type: number }) {
   const isNumber = !isNaN(Number(value));

   if (isNumber && type === 0) {
      const valueToNumber = Number(value);

      if (valueToNumber === 1) {
         return <CheckCircle2 className="mx-auto text-green-500" />;
      } else if (valueToNumber === 0) {
         return <XCircle className="mx-auto text-red-500" />;
      }
   }

   return <span dangerouslySetInnerHTML={{ __html: value }}></span>;
}
