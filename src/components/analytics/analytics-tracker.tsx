'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AnalyticsEvent {
   element_type: string;
   element_id?: string | null;
   element_text?: string | null;
   target_url?: string | null;
}

const CONFIG = {
   endpoint: '/api/analytics/track-click',
   debounceDelay: 300,
   maxRetries: 2,
   retryDelay: 1000,
};

let clickTimeout: NodeJS.Timeout | null = null;

/**
 * Send tracking data to server
 */
async function sendTrackingData(data: AnalyticsEvent): Promise<void> {
   try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

      const response = await fetch(`${apiUrl}${CONFIG.endpoint}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
         },
         credentials: 'include', // Include cookies for authentication
         body: JSON.stringify(data),
      });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
   } catch (error) {
      if (process.env.NODE_ENV === 'development') {
         console.warn('Analytics tracking failed:', error);
      }
   }
}

/**
 * Extract element information
 */
function getElementInfo(element: HTMLElement): AnalyticsEvent {
   // Determine element type
   const elementType = element.tagName.toLowerCase();

   // Get element ID
   const elementId = element.id || element.dataset.trackElement || null;

   // Get element text (limited to 100 chars)
   const elementText = (element.textContent || element.innerText || '').trim().substring(0, 100);

   // Get target URL for links
   let targetUrl: string | null = null;
   if (element.tagName === 'A') {
      targetUrl = (element as HTMLAnchorElement).href;
   } else if (element.dataset.href) {
      targetUrl = element.dataset.href;
   }

   return {
      element_type: elementType,
      element_id: elementId,
      element_text: elementText,
      target_url: targetUrl,
   };
}

/**
 * Handle click event
 */
function handleClick(event: MouseEvent): void {
   // Debounce to prevent duplicate tracking
   if (clickTimeout) {
      clearTimeout(clickTimeout);
   }

   clickTimeout = setTimeout(() => {
      const element = event.currentTarget as HTMLElement;
      const elementInfo = getElementInfo(element);

      // Send tracking data
      sendTrackingData(elementInfo);

      // Debug log in development
      if (process.env.NODE_ENV === 'development') {
         console.log('Tracked click:', elementInfo);
      }
   }, CONFIG.debounceDelay);
}

/**
 * Initialize tracking on elements
 */
function initializeTracking(): () => void {
   // Track elements with 'track-click' class or data attribute
   const trackableElements = document.querySelectorAll('.track-click, [data-track-click]');

   const listeners: Array<{ element: Element; handler: (e: Event) => void }> = [];

   trackableElements.forEach((element) => {
      const handler = (e: Event) => handleClick(e as MouseEvent);
      element.addEventListener('click', handler);
      listeners.push({ element, handler });
   });

   if (process.env.NODE_ENV === 'development') {
      console.log(`Analytics tracker initialized on ${trackableElements.length} elements`);
   }

   // Cleanup function
   return () => {
      listeners.forEach(({ element, handler }) => {
         element.removeEventListener('click', handler);
      });
   };
}

/**
 * Analytics Tracker Component
 * Automatically tracks clicks on elements with 'track-click' class or data-track-click attribute
 */
export function AnalyticsTracker() {
   const pathname = usePathname();

   useEffect(() => {
      // Initialize tracking when component mounts or pathname changes
      const cleanup = initializeTracking();

      // Cleanup listeners when component unmounts or pathname changes
      return cleanup;
   }, [pathname]); // Re-initialize on route changes

   return null; // This component doesn't render anything
}

/**
 * Track custom analytics event (can be called from anywhere)
 */
export function trackAnalyticsEvent(
   elementType: string,
   elementId?: string | null,
   elementText?: string | null,
   targetUrl?: string | null
): void {
   sendTrackingData({
      element_type: elementType,
      element_id: elementId || null,
      element_text: elementText || null,
      target_url: targetUrl || null,
   });
}
