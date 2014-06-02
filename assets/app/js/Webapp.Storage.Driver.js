/**
 * Created by pavelpat on 10/14/13.
 */

/** Strict mode */
"use strict";

var Webapp = (function (Webapp, window) {
    Webapp.Storage = (function (Storage) {
        /**
         * Provides API to access internal browser IndexedDB storage
         *
         * Must NOT be called manually
         *
         * Objects of this class must be created with Webapp.Storage.Driver.asyncCreate() method
         *
         * @constructor
         */
        Storage.Driver = (function () {
            function Driver(iDBDatabase) {
                /**
                 * @protected
                 *
                 * @type {IDBDatabase}
                 */
                this.iDBDatabase;

                /**
                 * Constructor
                 *
                 * @this Driver
                 */
                function constructor() {
                    this.iDBDatabase = iDBDatabase;
                }

                constructor.call(this);
            }

            /**
             * Fetches item from collection
             *
             * @public
             *
             * @param {string} collection
             * @param {*} key
             * @param {function} successCallback
             * @param {function} errorCallback
             *
             * @throws Error
             */
            Driver.prototype.get = function (collection, key, successCallback, errorCallback) {
                var transaction = this.iDBDatabase.transaction(collection, 'readonly');
                var objectStore = transaction.objectStore(collection);
                var request = objectStore.get(key);
                request.onsuccess = function (e) {
                    successCallback(e.target.result);
                };
                request.onerror = function (e) {
                    errorCallback(e.target.result);
                };
            };

            /**
             * Fetches all items from collection
             *
             * @public
             *
             * @param {string} collection
             * @param {function} successCallback
             * @param {function} errorCallback
             *
             * @throws Error
             */
            Driver.prototype.getAll = function (collection, successCallback, errorCallback) {
                var transaction = this.iDBDatabase.transaction(collection, 'readonly');
                var objectStore = transaction.objectStore(collection);
                var cursor = objectStore.openCursor();

                var result = [];
                cursor.onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        result.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        successCallback(result);
                    }
                };
                cursor.onerror = function (e) {
                    errorCallback(e.target.result);
                }
            };

            /**
             * Puts new item to collection
             *
             * @public
             *
             * @param {string} collection
             * @param {*} object
             * @param {function} successCallback
             * @param {function} errorCallback
             *
             * @throws Error
             */
            Driver.prototype.put = function (collection, object, successCallback, errorCallback) {
                var transaction = this.iDBDatabase.transaction(collection, 'readwrite');
                var objectStore = transaction.objectStore(collection);
                var request = objectStore.put(object);
                request.onsuccess = function (e) {
                    successCallback(e.target.result);
                };
                request.onerror = function (e) {
                    errorCallback(e.target.result)
                };
            };

            /**
             * Removes item from collection
             *
             * @public
             *
             * @param {string} collection
             * @param {*} key
             * @param {function} successCallback
             * @param {function} errorCallback
             *
             * @throws Error
             */
            Driver.prototype.delete = function (collection, key, successCallback, errorCallback) {
                var transaction = this.iDBDatabase.transaction(collection, 'readwrite');
                var objectStore = transaction.objectStore(collection);
                var request = objectStore.delete(key);
                request.onsuccess = function (e) {
                    successCallback(e.target.result);
                };
                request.onerror = function (e) {
                    errorCallback(e.target.result)
                };
            };

            /**
             * Create Driver object with specified Database Name
             *
             * @param {string} databaseName
             * @param {{name: string, keyPath: string, autoIncrement: boolean}[]} configuration
             * @param {function} createSuccess
             * @param {function} createFailed
             */
            Driver.asyncCreate = function (databaseName, configuration, createSuccess, createFailed) {
                try {
                    var request = getIndexedDBFactory().open(databaseName);
                }
                catch (e) {
                    createFailed(e);
                }

                request.onsuccess = function (e) {
                    createSuccess(new Driver(request.result));
                };

                request.onerror = function (e) {
                    createFailed(e.target);
                };

                request.onupgradeneeded = function (e) {
                    for (var i = 0; i < configuration.length; i++) {
                        request.result.createObjectStore(
                            configuration[i].nameStorage,
                            {
                                keyPath: configuration[i].keyPath,
                                autoIncrement: configuration[i].autoIncrement
                            }
                        );
                    }
                };
            };

            /**
             * @returns IDBFactory
             *
             * @throws Error
             */
            var getIndexedDBFactory = function () {
                if (undefined !== window.indexedDB) {
                    return window.indexedDB;
                }
                else if (undefined !== window.webkitIndexedDB) {
                    return window.webkitIndexedDB;
                }
                else if (undefined !== window.mozIndexedDB) {
                    return window.mozIndexedDB;
                }
                else if (undefined !== window.msIndexedDB) {
                    return window.msIndexedDB;
                }

                throw new Error("Could not access IndexedDB Factory");
            };

            return Driver;
        })();

        return Storage;
    })(Webapp.Storage || (Webapp.Storage = {}));

    return Webapp;
})(Webapp || (Webapp = {}), window);