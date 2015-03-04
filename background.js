/**
 * Created by U116064 on 04.03.2015.
 */

chrome.browserAction.onClicked.addListener(function(activeTab){
    var newURL = "popup.html";
    chrome.tabs.create({ url: newURL });
});
