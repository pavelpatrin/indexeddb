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
        Model.Brand = (function () {
            function Brand() {
                /**
                 * @protected
                 *
                 * @type string
                 */
                this.name;
            }

            (function (child, parent) {
                var proxy = function () {
                    this.constructor = child;
                };
                proxy.prototype = parent.prototype;
                child.prototype = new proxy();
            })(Brand, Model.Abstract);

            /**
             * Returns brand name
             *
             * @public
             *
             * @returns {undefined|*}
             */
            Brand.prototype.getName = function () {
                return this.name;
            };

            /**
             * Sets brand name
             *
             * @public
             *
             * @param name
             */
            Brand.prototype.setName = function (name) {
                this.name = name;
            };

            return Brand;
        })();

        return Model;
    })(Webapp.Model || (Webapp.Model = {}));

    return Webapp;
})(Webapp);