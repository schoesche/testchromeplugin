'use strict';
/**
 * Created by U116064 on 03.03.2015.
 */

angular.module("Testchromplugin", [])

.controller('filemanipulatorCtrl', ['$scope', function ($scope) {

    console.log("hallo test 1");

    alert("ahhhhh super angular");

/*    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(window.PERSISTENT, 1*1024*1024 *//*1MB*//*, successCallback, opt_errorCallback);


        window.webkitStorageInfo.requestQuota(PERSISTENT, 1*1024*1024 *//*1MB*//*, function(grantedBytes) {
            window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
        }, function(e) {
            console.log('Error', e);
        });*/


        chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
            writableFileEntry.createWriter(function(writer) {
                writer.onerror = errorHandler;
                writer.onwriteend = function(e) {
                    console.log('write complete');
                };
                writer.write(new Blob(['1234567890'], {type: 'text/plain'}));
            }, errorHandler);
        });
}]);

