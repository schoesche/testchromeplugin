'use strict';

/**
 * Created by U116064 on 03.03.2015.
 */

angular.module("Testchromplugin", [])

    .controller('filemanipulatorCtrl', ['$scope', '$q', 'FileService', function ($scope, $q, FileService) {

        var vm = this;
        vm.lala = "test super ich bin angular ist geladen";
        console.log("hallo test 1");
        vm.speichertext = "ich bin ein guter text";

        vm.readFile = function () {
            vm.lala = "bravo read file";
            var promiseReadFile = FileService.readFile();
            promiseReadFile.then(function (result) {
                console.log("jupiduuu:" + result);
                vm.lala = result;
                vm.lala2 = result;
            }, function (reason) {
                vm.lala2 = ('Failed: ' + reason);
            }, function (update) {
                vm.lala2 = ('Got notification: ' + update);
            });
        };

        vm.writeLinksFile = function () {
            vm.lala = "bravo write link file";
            FileService.saveFileAs(vm.speichertext);
        };
    }
    ]).


    factory('FileService', ['$q', function ($q) {

        var factory = {};

        function errorHandler(e) {
            console.error(e);
        }

        function waitForIO(writer, callback) {
            // set a watchdog to avoid eventual locking:
            var start = Date.now();
            // wait for a few seconds
            var reentrant = function () {
                if (writer.readyState === writer.WRITING && Date.now() - start < 4000) {
                    setTimeout(reentrant, 100);
                    return;
                }
                if (writer.readyState === writer.WRITING) {
                    console.error("Write operation taking too long, aborting!" +
                    " (current writer readyState is " + writer.readyState + ")");
                    writer.abort();
                }
                else {
                    callback();
                }
            };
            setTimeout(reentrant, 100);
        }

        function writeFileEntry(writableEntry, opt_blob, callback) {
            if (!writableEntry) {
                output.textContent = 'Nothing selected.';
                return;
            }

            writableEntry.createWriter(function (writer) {

                writer.onerror = errorHandler;
                writer.onwriteend = callback;

                // If we have data, write it to the file. Otherwise, just use the file we
                // loaded.
                if (opt_blob) {
                    writer.truncate(opt_blob.size);
                    waitForIO(writer, function () {
                        writer.seek(0);
                        writer.write(opt_blob);
                    });
                }
                else {
                    chosenEntry.file(function (file) {
                        writer.truncate(file.fileSize);
                        waitForIO(writer, function () {
                            writer.seek(0);
                            writer.write(file);
                        });
                    });
                }
            }, errorHandler);
        }

        // for files, read the text content into the textarea
        function loadFileEntry(_chosenEntry) {
            var chosenEntry = _chosenEntry;
            var fileData = {};
            chosenEntry.file(function (file) {
                readAsText(chosenEntry, function (result) {
                    console.log("text value" + result);
                    /*textarea.value = result;*/
                    fileData = result;
                });
                // Update display.
                /* saveFileButton.disabled = false; // allow the user to save the content
                 displayEntryData(chosenEntry);*/
            });
            return fileData;
        }

        function readAsText(fileEntry, callback) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onerror = errorHandler;
                reader.onload = function (e) {
                    callback(e.target.result);
                };

                reader.readAsText(file);
            });
        }


        factory.saveFileAs = function (data) {
            var fileName = 'settings.json';
            /*chosenEntry.name*/
            var config = {type: 'saveFile', suggestedName: fileName};

            chrome.fileSystem.chooseEntry(config, function (writableEntry) {
                var blob = new Blob([data], {type: 'text/plain'});
                writeFileEntry(writableEntry, blob, function (e) {
                    console.log('Write complete :)');
                });
            });
        };

        factory.readFile = function () {
            var deferred = $q.defer();

            var result = "gugus";
            var accepts = [{
                mimeTypes: ['text/*'],
                extensions: ['js', 'css', 'txt', 'html', 'xml', 'tsv', 'csv', 'rtf', 'json']
            }];

            deferred.resolve(
            chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts}, function (theEntry) {
                if (!theEntry) {
                    console.log('No file selected.');
                    return;
                }
                // use local storage to retain access to this file
                chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
                result = loadFileEntry(theEntry);
                return result;
            })
            );

            return deferred.promise;

        };

        return factory;

    }]);

