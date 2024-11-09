export function getCacheBuster(): string {
   const currentDate = new Date();
   const currentMinutes = currentDate.getMinutes();
   const currentHours = currentDate.getHours();

   const interval = Math.floor(currentMinutes / 2) * 2;

   const year = currentDate.getFullYear();
   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
   const day = String(currentDate.getDate()).padStart(2, '0');
   const formattedDate = `${year}-${month}-${day}`;

   return `${formattedDate}-${currentHours}-${interval}`;
}

export function getModifiedCacheBuster(intervalMinutes: number): string {
   const currentDate = new Date();
   const currentMinutes = currentDate.getMinutes();
   const currentHours = currentDate.getHours();

   const interval = Math.floor(currentMinutes / intervalMinutes) * intervalMinutes;

   const year = currentDate.getFullYear();
   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
   const day = String(currentDate.getDate()).padStart(2, '0');
   const formattedDate = `${year}-${month}-${day}`;

   return `${formattedDate}-${currentHours}-${interval}`;
}
