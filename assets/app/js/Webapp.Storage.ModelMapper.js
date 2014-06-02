/**
 * Created by pavelpat on 10/14/13.
 */

/** Strict mode */
"use strict";

var Webapp = (function (Webapp, window) {
    Webapp.Storage = (function (Storage) {
        /**
         * Provides API to Map Webapp.Model to Webapp.Storage
         *
         * @constructor
         *
         * @param {Webapp.Storage.Driver} driver
         * @param {{constructor: function, nameStorage: string}[]} configuration
         */
        Storage.ModelMapper = (function () {
            function ModelMapper(driver, configuration) {
                /**
                 * Storage driver
                 *
                 * @type Webapp.Storage.Driver
                 */
                this.driver;

                /**
                 * Attached to mapper models
                 *
                 * @private
                 *
                 * @type {{constructor: function, nameStorage: string}[]}
                 */
                this.mapped;

                /**
                 * Constructor
                 *
                 * @this ModelMapper
                 */
                var constructor = function () {
                    this.driver = driver;
                    this.mapped = configuration.map(function (element) {
                        return {
                            constructor: element.constructor,
                            nameStorage: element.nameStorage,
                            keyPath: element.keyPath
                        };
                    });
                };

                constructor.call(this);
            }

            /**
             * Returns nameStorage for model
             *
             * @protected
             *
             * @param {Webapp.Model.Abstract} model Any model
             *
             * @returns {string}
             *
             * @throws Error
             */
            ModelMapper.prototype.getCollectionForModel = function (model) {
                for (var i = 0; i < this.mapped.length; i++) {
                    if (this.mapped[i].constructor === model.constructor) {
                        return this.mapped[i].nameStorage;
                    }
                }

                throw new Error("Specified model constructor is not attached to mapper");
            };

            /**
             * Returns key identifier value for model
             *
             * @protected
             *
             * @param {Webapp.Model.Abstract} model Any model
             *
             * @returns {string}
             *
             * @throws Error
             */
            ModelMapper.prototype.getKeyForModel = function (model) {
                for (var i = 0; i < this.mapped.length; i++) {
                    if (this.mapped[i].constructor === model.constructor) {
                        return model[this.mapped[i].keyPath];
                    }
                }

                throw new Error("Specified model constructor is not attached to mapper");
            };

            /**
             * Returns nameStorage for constructor
             *
             * @protected
             *
             * @param {function} constructor Constructor of any model
             *
             * @returns {string}
             *
             * @throws Error
             */
            ModelMapper.prototype.getCollectionForModelConstructor = function (constructor) {
                for (var i = 0; i < this.mapped.length; i++) {
                    if (this.mapped[i].constructor === constructor) {
                        return this.mapped[i].nameStorage;
                    }
                }

                throw new Error("Specified constructor is not attached to mapper");
            };

            /**
             * Fetches model from storage by id
             *
             * @public
             *
             * @param {function} constructor Constructor of any model
             * @param {string|number} id Identifier of model instance
             * @param {function} successCallback
             * @param {function} errorCallback
             *
             * @throws Error
             */
            ModelMapper.prototype.get = function (constructor, id, successCallback, errorCallback) {
                try {
                    var collection = this.getCollectionForModelConstructor(constructor);

                    this.driver.get(
                        collection,
                        id,
                        function (object) {
                            if (undefined !== object) {
                                var model = new constructor();
                                for (var key in object) {
                                    model[key] = object[key];
                                }
                                successCallback(model);
                            } else {
                                successCallback(undefined);
                            }

                        },
                        function (error) {
                            errorCallback(error);
                        }
                    );
                }
                catch (e) {
                    throw new Error("Could not fetch models: " + e.message);
                }
            };

            /**
             * Fetches all models from storage by specified constructor
             *
             * @public
             *
             * @param {Webapp.Model.Abstract|function} constructor Constructor of any model
             * @param {function} successCallback
             * @param {function} errorCallback
             *
             * @throws Error
             */
            ModelMapper.prototype.getAll = function (constructor, successCallback, errorCallback) {
                try {
                    var collection = this.getCollectionForModelConstructor(constructor);
                    this.driver.getAll(
                        collection,
                        function (result) {
                            var models = [];
                            for (var i = 0; i < result.length; i++) {
                                var model = new constructor();
                                for (var key in result[i]) {
                                    if (true) {
                                        model[key] = result[i][key];
                                    }
                                }
                                models.push(model);
                            }
                            successCallback(models);
                        },
                        function (result) {
                            errorCallback(result);
                        }
                    );
                }
                catch (e) {
                    throw new Error("Could not fetch models: " + e.message);
                }
            };

            /**
             * Saves model into storage
             *
             * @public
             *
             * @param {Webapp.Model.Abstract} model Instance of any model
             * @param {function} successCallback
             * @param {function} errorCallback
             */
            ModelMapper.prototype.put = function (model, successCallback, errorCallback) {
                try {
                    var collection = this.getCollectionForModel(model);

                    /** @see http://www.whatwg.org/specs/web-apps/current-work/multipage/common-dom-interfaces.html#structured-clone */
                    this.driver.put(
                        collection,
                        model,
                        function (result) {
                            /* Why (sh)it happens? */
                            window.setTimeout(function () {
                                successCallback(result);
                            }, 10);
                        },
                        function (result) {
                            errorCallback(result);
                        }
                    );
                }
                catch (e) {
                    throw new Error("Could not save model: " + e.message);
                }
            };

            /**
             * Removes model from storage
             *
             * @public
             *
             * @param {Webapp.Model.Abstract} model Instance of any model
             * @param {function} successCallback
             * @param {function} errorCallback
             */
            ModelMapper.prototype.delete = function (model, successCallback, errorCallback) {
                try {
                    var collection = this.getCollectionForModel(model);
                    var key = this.getKeyForModel(model);
                    this.driver.delete(
                        collection,
                        key,
                        function (result) {
                            /* Why (sh)it happens? */
                            window.setTimeout(function () {
                                successCallback(result);
                            }, 10);
                        },
                        function (result) {
                            errorCallback(result);
                        }
                    );
                }
                catch (e) {
                    throw new Error("Could not save model: " + e.message);
                }
            };

            return ModelMapper;
        })();

        return Storage;
    })(Webapp.Storage || (Webapp.Storage = {}));

    return Webapp;
})(Webapp || (Webapp = {}), window);