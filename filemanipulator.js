'use strict';
/**
 * Created by U116064 on 03.03.2015.
 */

var app = angular.module("Testchromplugin", []);

function alertSomthing() {

    alert("gugus");

};

/*function errorHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }
    ;

    console.log('Error: ' + msg);
}*/

function onInitFs(fs) {
    console.log('Opened file system: ' + fs.name);
}


/*function onInitFs(fs) {

 fs.root.getFile('logTestLOG.txt', {create: true, exclusive: true}, function(fileEntry) {

 // fileEntry.isFile === true
 // fileEntry.name == 'log.txt'
 // fileEntry.fullPath == '/log.txt'

 }, errorHandler);

 };*/
app.controller('filemanipulatorCtrl', ['ErrorFactory', function (ErrorFactory) {
    window.requestFileSystem(window.TEMPORARY, 1024 * 1024, onInitFs, ErrorFactory.errorHandler());

    document.addEventListener('DOMContentLoaded', function () {
        /*alertSomthing();*/

        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024 /*5MB*/, onInitFs, ErrorFactory.errorHandler());
    });



    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {
            // Tab opened.
        });
    });



}]);

app.factory('ErrorFactory',[ function(){
    var factory = {};
    factory.errorHandler = function(e){
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        };
        console.log('Error: ' + msg);
    };
    return factory;
}]);
