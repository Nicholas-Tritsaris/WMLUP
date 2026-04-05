document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Date/Time
    const dateDisplay = document.getElementById('date-display');
    if (dateDisplay) {
        const updateTime = () => {
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dayName = days[now.getDay()];
            const monthName = months[now.getMonth()];
            const date = now.getDate();
            dateDisplay.textContent = `${dayName}, ${monthName} ${date}`;
        };
        updateTime();
    }

    // Expandable content boxes
    const expandableHeaders = document.querySelectorAll('.expandable-header');
    expandableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (content && content.classList.contains('expandable-content')) {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                header.textContent = (isHidden ? '[-] Click to collapse' : '[+] Click to expand') + header.textContent.substring(header.textContent.indexOf(' details') - 8); // Simple fix to keep label

                // Better label management
                if (header.textContent.includes('FE3')) {
                    header.textContent = (isHidden ? '[-] Click to collapse ' : '[+] Click to expand ') + 'FE3 Update System Details';
                } else if (header.textContent.includes('System Status')) {
                    header.textContent = (isHidden ? '[-] Click to collapse ' : '[+] Click to expand ') + 'System Status details';
                } else if (header.textContent.includes('Metadata')) {
                    header.textContent = (isHidden ? '[-] Click to collapse ' : '[+] Click to expand ') + 'Update Metadata details';
                } else if (header.textContent.includes('Zune')) {
                    header.textContent = (isHidden ? '[-] Click to collapse ' : '[+] Click to expand ') + 'Zune Update Protocols details';
                }
            }
        });
    });

    // Mock Search
    const searchBtn = document.querySelector('.msn-search-bar button');
    const searchInput = document.querySelector('.msn-search-bar input');
    const searchResults = document.getElementById('search-results');
    if (searchBtn && searchInput && searchResults) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                searchResults.textContent = `Searching for "${query}"... (No results found in research database)`;
                searchResults.style.color = 'red';
            } else {
                searchResults.textContent = '';
            }
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Tab highlighting
    const tabs = document.querySelectorAll('.msn-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});
