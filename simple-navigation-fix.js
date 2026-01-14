// Simple navigation fix - run this in browser console
(function() {
    console.log('Applying simple navigation fix...');
    
    // Override all click events and force navigation for normal links
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a[href]');
        if (link && link.tagName === 'A') {
            const href = link.getAttribute('href');
            // Check if it's a normal link (not hash, not javascript)
            if (href && href !== '#' && !href.startsWith('javascript:') && !href.startsWith('#')) {
                console.log('Forcing navigation to:', href);
                // Stop all other handlers and navigate directly
                event.stopImmediatePropagation();
                event.preventDefault();
                window.location.href = href;
                return;
            }
        }
    }, true); // Use capture phase
    
    console.log('Simple navigation fix applied!');
})();
