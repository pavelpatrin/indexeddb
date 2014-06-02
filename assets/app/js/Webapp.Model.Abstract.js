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
        Model.Abstract = (function () {
            function Abstract() {
                /**
                 * @private
                 *
                 * @type number
                 */
                this.id;
            }

            /**
             * @public
             *
             * @return {number}
             */
            Abstract.prototype.getId = function(){
                return +this.id;
            };

            /**
             * @public
             *
             * @paran {number} id
             */
            Abstract.prototype.setId = function(id){
                this.id = +id;
            };

            return Abstract;
        })();

        return Model;
    })(Webapp.Model || (Webapp.Model = {}));

    return Webapp;
})(Webapp || (Webapp = {}));