(function() {
    // Dynamic Date/Time
    var dateDisplay = document.getElementById('date-display');
    if (dateDisplay) {
        var updateTime = function() {
            var now = new Date();
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var dayName = days[now.getDay()];
            var monthName = months[now.getMonth()];
            var date = now.getDate();
            dateDisplay.textContent = dayName + ', ' + monthName + ' ' + date;
        };
        updateTime();
    }

    // Expandable content boxes
    var expandableHeaders = document.querySelectorAll('.expandable-header');
    for (var i = 0; i < expandableHeaders.length; i++) {
        (function() {
            var header = expandableHeaders[i];
            header.onclick = function() {
                var content = header.nextElementSibling;
                if (content) {
                    var isHidden = content.style.display === 'none';
                    content.style.display = isHidden ? 'block' : 'none';

                    var label = "details";
                    if (header.innerHTML.indexOf('FE3') !== -1) label = 'FE3 Update System Details';
                    else if (header.innerHTML.indexOf('System Status') !== -1) label = 'System Status details';
                    else if (header.innerHTML.indexOf('Metadata') !== -1) label = 'Update Metadata details';
                    else if (header.innerHTML.indexOf('Zune') !== -1) label = 'Zune Update Protocols details';

                    header.innerHTML = (isHidden ? '[-] Click to collapse ' : '[+] Click to expand ') + label;
                }
            };
        })();
    }

    // Mock Search
    var searchBtn = document.querySelector('.msn-search-bar button');
    var searchInput = document.querySelector('.msn-search-bar input');
    var searchResults = document.getElementById('search-results');
    if (searchBtn && searchInput && searchResults) {
        searchBtn.onclick = function() {
            var query = searchInput.value;
            if (query && query.length > 0) {
                searchResults.innerHTML = 'Searching for "' + query + '"... (No results found)';
                searchResults.style.color = 'red';
            } else {
                searchResults.innerHTML = '';
            }
        };
        searchInput.onkeypress = function(e) {
            if (e.keyCode === 13) {
                searchBtn.onclick();
            }
        };
    }

    // Tab highlighting
    var tabs = document.querySelectorAll('.msn-tab');
    for (var j = 0; j < tabs.length; j++) {
        (function() {
            var tab = tabs[j];
            tab.onclick = function() {
                for (var k = 0; k < tabs.length; k++) {
                    tabs[k].className = 'msn-tab';
                }
                tab.className = 'msn-tab active';
            };
        })();
    }
})();
