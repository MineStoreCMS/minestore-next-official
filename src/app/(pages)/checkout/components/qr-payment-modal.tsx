'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DownloadCloud, Loader2 } from 'lucide-react';
import { FC, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { fetcher } from '@/api/client/fetcher';
import { useTranslations } from 'next-intl';

export type QrDetailsProps = {
    show: boolean;
    onHide(): void;
    details: {
        payment_method: string;
        sepay_bank?: string | null;
        sepay_bank_owner?: string | null;
        sepay_bank_account?: string | null;
        sepay_paycode_prefix?: string | null;
        payment_price?: string | null;
        payment_id?: number | null;
        qrcode: string;
    };
};

const downloadQR = async (url: string) => {
    if (!url) return;
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const urlObject = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = urlObject;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlObject);
    } catch (error) {
        console.error('Error downloading the QR code:', error);
    }
};

export const QrPaymentModal: FC<QrDetailsProps> = ({ show, onHide, details }) => {
    const isSePay = details.payment_method.toLocaleLowerCase() === 'sepay';

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogContent
                className={cn('w-full max-w-[500px] p-0', {
                    'max-w-[820px]': isSePay
                })}
            >
                {isSePay ? <SepayModal details={details} /> : <NormalQRModal details={details} />}
            </DialogContent>
        </Dialog>
    );
};

function SepayModal({ details }: { details: QrDetailsProps['details'] }) {
    const t = useTranslations('qrCodePayments');
    const paymentId = details.payment_id;

    const replacedPaymentReferenceCode = t('sepayModal.paymentReferenceNote').replace(
        '%code%',
        details.sepay_paycode_prefix || ''
    );

    useEffect(() => {
        if (!paymentId) return;

        const repeatCheck = setInterval(async () => {
            try {
                const res = await fetcher.post('/payments/handle/sepay/check', {
                    pmid: paymentId
                });
                if (res.data.success === true) {
                    clearInterval(repeatCheck);
                    window.location.href = '/success';
                }
            } catch (error) {
                console.error('Error checking payment:', error);
            }
        }, 3000);

        const timeoutId = setTimeout(() => {
            clearInterval(repeatCheck);
            console.error('Payment check timeout');
        }, 600000);

        return () => {
            clearInterval(repeatCheck);
            clearTimeout(timeoutId);
        };
    }, [paymentId]);

    return (
        <div className="flex flex-col items-center space-y-6 p-6">
            <h2 className="text-2xl font-bold text-card-foreground">{t('paymentInstructions')}</h2>
            <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
                <div className="md:border-r-2 md:border-muted">
                    <h3 className="mb-4 text-base font-semibold text-card-foreground">
                        {t('sepayModal.option1')}
                    </h3>
                    <div className="flex flex-col items-center space-y-4">
                        {details.qrcode ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={details.qrcode}
                                alt="QR Code"
                                width="300"
                                height="300"
                                className="rounded-md"
                            />
                        ) : null}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadQR(details.qrcode || '')}
                        >
                            <DownloadCloud className="mr-2" />
                            {t('downloadQr')}
                        </Button>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>{t('waitingForPayment')}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="mb-4 text-base font-semibold text-card-foreground">
                        {t('sepayModal.option2')}
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {details.sepay_bank ? (
                            <div>
                                <p className="font-semibold text-card-foreground">
                                    {t('sepayModal.bank')}
                                </p>
                                <p>{details.sepay_bank}</p>
                            </div>
                        ) : null}
                        {details.sepay_bank_owner ? (
                            <div>
                                <p className="font-semibold text-card-foreground">
                                    {t('sepayModal.accountHolder')}
                                </p>
                                <p>{details.sepay_bank_owner}</p>
                            </div>
                        ) : null}
                        {details.sepay_bank_account ? (
                            <div>
                                <p className="font-semibold text-card-foreground">
                                    {t('sepayModal.accountNumber')}
                                </p>
                                <p>{details.sepay_bank_account}</p>
                            </div>
                        ) : null}
                        {details.payment_price ? (
                            <div>
                                <p className="font-semibold text-card-foreground">
                                    {t('sepayModal.amount')}
                                </p>
                                <p>{details.payment_price}</p>
                            </div>
                        ) : null}
                        {details.sepay_paycode_prefix ? (
                            <div>
                                <p className="font-semibold text-card-foreground">
                                    {t('sepayModal.paymentReference')}
                                </p>
                                <p>{details.sepay_paycode_prefix}</p>
                            </div>
                        ) : null}
                        <div className="rounded-md bg-muted p-4">
                            <p className="text-pretty text-sm text-muted-foreground">
                                {replacedPaymentReferenceCode}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NormalQRModal({ details }: { details: QrDetailsProps['details'] }) {
    const t = useTranslations('qrCodePayments');

    return (
        <div className="flex flex-col items-center space-y-6 p-6">
            <h2 className="text-2xl font-bold text-card-foreground">{t('paymentInstructions')}</h2>
            <div className="w-full">
                <div>
                    <h3 className="mb-4 text-center text-base font-semibold text-card-foreground">
                        {t('normalModal.scanQrCode')}
                    </h3>
                    <div className="flex flex-col items-center space-y-4">
                        {details.qrcode ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={details.qrcode}
                                alt="QR Code"
                                width="300"
                                height="300"
                                className="rounded-md"
                            />
                        ) : null}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadQR(details.qrcode || '')}
                        >
                            <DownloadCloud className="mr-2" />
                            {t('downloadQr')}
                        </Button>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>{t('waitingForPayment')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
