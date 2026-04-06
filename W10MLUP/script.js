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

    // UA-based Device Detection
    var detectDevice = function() {
        var ua = navigator.userAgent;
        var device = { model: "Unknown Device", os: "Unknown OS", version: "0.0.0.0" };

        if (ua.indexOf("Windows Phone 10") !== -1 || ua.indexOf("Windows NT 10.0; ARM;") !== -1) {
            device.os = "Windows 10 Mobile";
            if (ua.indexOf("MSIE 10.0") !== -1) device.version = "10.0.10586";
            else device.version = "10.0.15254";
        } else if (ua.indexOf("Windows Phone 8.1") !== -1) {
            device.os = "Windows Phone 8.1";
            device.version = "8.10.14219";
        }

        var models = ["RM-1085", "RM-1109", "RM-1072", "RM-937", "RM-821", "Lumia 950", "Lumia 640", "Lumia 1020", "Lumia 920"];
        for (var i = 0; i < models.length; i++) {
            if (ua.indexOf(models[i]) !== -1) {
                device.model = models[i];
                break;
            }
        }
        return device;
    };

    var checkBtn = document.getElementById('check-btn');
    if (checkBtn) {
        checkBtn.onclick = function() {
            var device = detectDevice();
            var results = document.getElementById('update-results');
            var info = document.getElementById('device-info');
            var status = document.getElementById('update-status');
            var action = document.getElementById('action-links');

            results.style.display = 'block';
            info.innerHTML = "Detected: " + device.model + " running " + device.os + " (" + device.version + ")";

            if (device.os === "Windows 10 Mobile") {
                status.innerHTML = "Update Status: Native servers unreachable. Custom FE3 source available.";
                action.innerHTML = '<a href="#fixes" style="color:red; font-weight:bold;">[Step 1] Install WMLUP FE3 Patch</a><br>' +
                                  '<a href="#fixes">[Step 2] Install Root Certificates</a>';
            } else if (device.os === "Windows Phone 8.1") {
                status.innerHTML = "Update Status: WP8.1 End-of-Life. Upgrade to W10M path detected.";
                action.innerHTML = '<a href="#fixes" style="color:red; font-weight:bold;">[Step 1] Install Interop Unlock</a><br>' +
                                  '<a href="#fixes">[Step 2] Redirect to W10M RS1 Path</a>';
            } else {
                status.innerHTML = "Update Status: Platform not detected. Manual model selection required.";
                action.innerHTML = '<a href="#fixes">View all available fixes</a>';
            }
        };
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
                    header.innerHTML = (isHidden ? '[-] Click to collapse ' : '[+] Click to expand ') + header.innerHTML.substring(header.innerHTML.indexOf(' details') - 8);
                }
            };
        })();
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
