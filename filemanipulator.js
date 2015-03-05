'use strict';
alert("gugus");
/**
 * Created by U116064 on 03.03.2015.
 */

angular.module("Testchromplugin", [])

    .controller('filemanipulatorCtrl', ['$scope', 'FileService', function ($scope, FileService) {

        var vm = this;
        vm.lala = "test super ich bin angular ist geladen";
        console.log("hallo test 1");

        alert("ahhhhh super angular");

        var dummyData = {"testttt": "lalalala"};


        vm.speichertext = "ich bin ein guter text";


        vm.readFile = function() {
            vm.lala = "bravo read file";
            vm.lala = FileService.readFile();
        };

        vm.writeLinksFile = function() {
            vm.lala = "bravo write link file";
            FileService.saveFileAs(vm.speichertext);
        };

    }]).


    factory('FileService', function() {

        var factory = {};

        function errorHandler(e) {
            console.error(e);
        }

        function waitForIO(writer, callback) {
            // set a watchdog to avoid eventual locking:
            var start = Date.now();
            // wait for a few seconds
            var reentrant = function() {
                if (writer.readyState===writer.WRITING && Date.now()-start<4000) {
                    setTimeout(reentrant, 100);
                    return;
                }
                if (writer.readyState===writer.WRITING) {
                    console.error("Write operation taking too long, aborting!"+
                    " (current writer readyState is "+writer.readyState+")");
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

            writableEntry.createWriter(function(writer) {

                writer.onerror = errorHandler;
                writer.onwriteend = callback;

                // If we have data, write it to the file. Otherwise, just use the file we
                // loaded.
                if (opt_blob) {
                    writer.truncate(opt_blob.size);
                    waitForIO(writer, function() {
                        writer.seek(0);
                        writer.write(opt_blob);
                    });
                }
                else {
                    chosenEntry.file(function(file) {
                        writer.truncate(file.fileSize);
                        waitForIO(writer, function() {
                            writer.seek(0);
                            writer.write(file);
                        });
                    });
                }
            }, errorHandler);
        }


        factory.saveFileAs = function (data) {
            var fileName =  'settings.json';/*chosenEntry.name*/
            var config = {type: 'saveFile', suggestedName: fileName};

            chrome.fileSystem.chooseEntry(config, function(writableEntry) {
                var blob = new Blob([data], {type: 'text/plain'});
                writeFileEntry(writableEntry, blob, function(e) {
                    output.textContent = 'Write complete :)';
                });
            });
        }

        factory.readFile = function () {
            chrome.fileSystem.chooseEntry(
                {
                    type: 'openFile', accepts: [{
                    extensions: ['html','json','txt']
                }]
                },
                function (fileEntry) {
                    if (!fileEntry) {
                        $("#OuptutText").html("User did not choose a file");
                        return;
                    }
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            document.getElementById("HTMLFile").value = e.target.result;
                        };
                        reader.readAsText(file);
                    });

                });
        }

        return factory;

    });

