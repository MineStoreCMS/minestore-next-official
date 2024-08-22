import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function DescriptionTooltip({
    description,
    html = true,
    children
}: {
    description: string;
    html?: boolean;
    children?: React.ReactNode;
}) {
    if (!description) return null;

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger>
                    {children ? children : <HelpCircle size={18} aria-hidden={true} />}
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] border-foreground/20 md:max-w-[300px] ">
                    {html ? (
                        <p
                            dangerouslySetInnerHTML={{ __html: description }}
                            className="prose prose-sm text-pretty"
                        ></p>
                    ) : (
                        <p className="prose prose-sm text-pretty">{description}</p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
