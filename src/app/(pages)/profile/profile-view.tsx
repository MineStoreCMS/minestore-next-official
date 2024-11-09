'use client';

import { FC } from 'react';
import { Price } from '@/components/base/price/price';
import { TProfile } from '@/types/profile';
import { Card } from '@layout/card/card';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type ProfileViewProps = {
   profile: TProfile;
};

const renderDisplayText = (content: string) => {
   const isHtml = /<\/?span[^>]*>/.test(content);

   if (isHtml) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
   }

   return <div>{content}</div>;
};

export const ProfileView: FC<ProfileViewProps> = ({ profile }) => {
   const t = useTranslations('profile');

   return (
      <div className="flex-col rounded-[10px] bg-card p-6">
         <div className="stone-pattern flex-row items-center justify-center rounded-md p-9 dark:bg-accent">
            <h2 className="text-2xl font-bold text-white dark:text-accent-foreground text-center">
               {t('title')}
            </h2>
         </div>

         <div className="mt-8 flex-row items-start">
            <div className="w-1/2 flex-col items-center">
               <Image
                  src={`https://mc-heads.net/body/${profile.username}`}
                  height={475}
                  width={198}
                  alt={profile.username}
                  quality={100}
               />
               <div className="mt-4 rounded bg-accent px-4 text-xl font-bold leading-10 text-accent-foreground">
                  {renderDisplayText(profile.displayname)}
                  {profile.display_group !== 0 && profile.display_group && (
                     <div style={{textAlign: 'center'}}>
                        {renderDisplayText(profile.group)}
                     </div>
                  )}
               </div>
            </div>
            <div className="w-1/2 flex-col rounded-lg border-4 border-accent p-6">
               <div className="text-xl font-bold text-primary">{t('information')}</div>
               <div className="mt-8">
                  <div className="flex-row items-center">
                            <span className="font-bold text-accent-foreground">
                                {t('registration-date')}
                            </span>
                     <span className="ml-auto">{profile.created}</span>
                  </div>
                  <div className="mt-4 flex-row items-center">
                            <span className="font-bold text-accent-foreground">
                                {t('money-spent')}
                            </span>
                     <Price value={profile.money_spent} className="ml-auto"/>
                  </div>
               </div>
            </div>
         </div>

         <h1 className="mt-8 text-center text-[34px] text-primary">{t('recent-purchases')}</h1>
         <hr className="mt-5 border-[3px] border-primary"/>

         <div className="mt-8 grid grid-cols-3 gap-8">
            {profile?.items?.map((item, index) => <Card key={index} item={item} hideButton={true}/>)}
         </div>

         {profile?.items?.length === 0 && (
            <div className="text-center text-muted-foreground">
               No recent purchases found for this user.
            </div>
         )}
      </div>
   );
};
