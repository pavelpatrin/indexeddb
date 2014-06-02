/**
 * Created by pavelpat on 10/14/13.
 */

/** Strict mode */
"use strict";

var Webapp = (function (Webapp) {
    Webapp.Model = (function (Model) {
        /**
         * @constructor
         */
        Model.Car = (function () {
            function Car() {
                /**
                 * @protected
                 *
                 * @type number
                 */
                this.brandId;

                /**
                 * @protected
                 *
                 * @type number
                 */
                this.modelId;

                /**
                 * @protected
                 *
                 * @type number
                 */
                this.year;

                /**
                 * @protected
                 *
                 * @type number
                 */
                this.price;
            }

            (function (child, parent) {
                var proxy = function () {
                    this.constructor = child;
                };
                proxy.prototype = parent.prototype;
                child.prototype = new proxy();
            })(Car, Model.Abstract);

            /**
             * Returns car brand id
             *
             * @public
             *
             * @returns {number|undefined}
             */
            Car.prototype.getBrandId = function () {
                return +this.brandId;
            };

            /**
             * Sets car brand id
             *
             * @public
             *
             * @param {number} brandId
             */
            Car.prototype.setBrandId = function (brandId) {
                this.brandId = +brandId;
            };

            /**
             * Returns car model id
             *
             * @public
             *
             * @returns {number|undefined}
             */
            Car.prototype.getModelId = function () {
                return +this.modelId;
            };

            /**
             * Sets car model id
             *
             * @public
             *
             * @param {Number} modelId
             */
            Car.prototype.setModelId = function (modelId) {
                this.modelId = +modelId;
            };

            /**
             * Returns car year
             *
             * @public
             *
             * @returns {number|undefined}
             */
            Car.prototype.getYear = function () {
                return this.year;
            };

            /**
             * Sets car year
             *
             * @public
             *
             * @param {number} year
             */
            Car.prototype.setYear = function (year) {
                this.year = year;
            };

            /**
             * Returns car price
             *
             * @public
             *
             * @returns {number|undefined}
             */
            Car.prototype.getPrice = function () {
                return this.price;
            };

            /**
             * Sets car price
             *
             * @public
             *
             * @param {number} price
             */
            Car.prototype.setPrice = function (price) {
                this.price = price;
            };

            return Car;
        })();

        return Model;
    })(Webapp.Model || (Webapp.Model = {}));

    return Webapp;
})(Webapp);