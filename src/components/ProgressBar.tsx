'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// Configure NProgress
NProgress.configure({
    showSpinner: false,
    minimum: 0.1,
    speed: 400,
    trickleSpeed: 200,
});

export default function ProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.done();
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleStart = () => NProgress.start();
        const handleStop = () => NProgress.done();

        // Intercept link clicks
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.href && !anchor.target && !anchor.download) {
                const url = new URL(anchor.href);
                const currentUrl = new URL(window.location.href);

                // Only trigger for internal navigation
                if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
                    handleStart();
                }
            }
        };

        document.addEventListener('click', handleLinkClick);

        return () => {
            document.removeEventListener('click', handleLinkClick);
            handleStop();
        };
    }, []);

    return null;
}
