/**
 * Created by U116064 on 04.03.2015.
 */

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('popup.html', {
        'bounds': {
            'width': 400,
            'height': 500
        }
    });
});

