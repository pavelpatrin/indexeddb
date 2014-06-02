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
        Model.Model = (function () {
            function CarModel() {
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
            })(CarModel, Model.Abstract);

            /**
             * Returns model name
             *
             * @public
             *
             * @returns {undefined|*}
             */
            CarModel.prototype.getName = function () {
                return this.name;
            };

            /**
             * Sets model name
             *
             * @public
             *
             * @param name
             */
            CarModel.prototype.setName = function (name) {
                this.name = name;
            };

            return CarModel;
        })();

        return Model;
    })(Webapp.Model || (Webapp.Model = {}));

    return Webapp;
})(Webapp);