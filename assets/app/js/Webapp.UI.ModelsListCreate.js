/**
 * Created by pavelpat on 10/14/13.
 */

/** Strict mode */
"use strict";

var Webapp = (function (Webapp) {
    Webapp.UI = (function (UI) {
        /**
         * @constructor
         *
         * @param {jQuery} $
         * @param {Webapp.Storage.ModelMapper} mapper
         * @param {HTMLElement} element
         */
        UI.ModelsListCreate = (function () {
            function ModelsListCreate($, mapper, element) {
                /**
                 * @protected
                 *
                 * @type jQuery
                 */
                this.$ = null;

                /**
                 * @protected
                 *
                 * @type Webapp.Storage.ModelMapper
                 */
                this.mapper = null;

                /**
                 * Root widget element
                 *
                 * @protected
                 *
                 * @type HTMLElement
                 */
                this.element = null;

                /**
                 * Widget elements selectors
                 *
                 * @protected
                 *
                 * @type {{modal: string, error: string, modelName: string, saveBtn: string}}
                 */
                this.selectors = {
                    modal: '[data-role~="modal"]',
                    error: '[data-role~="error"]',
                    modelName: '[data-role~="model-name"]',
                    saveBtn: '[data-role~="save-btn"]'
                };

                /**
                 * Constructor
                 *
                 * @this ModelsListCreate
                 */
                function constructor() {
                    this.$ = $;
                    this.mapper = mapper;
                    this.element = element;

                    this.bindEvents();
                }

                constructor.call(this);
            }

            /**
             * Binds events on widget
             *
             * @protected
             */
            ModelsListCreate.prototype.bindEvents = function () {
                var self = this;

                /* Click events */
                this.$(this.element)
                    .on('click', this.selectors.saveBtn, function (e) {
                        var modelName = self.$(self.selectors.modelName, self.element).val();
                        if (!modelName.length) {
                            self.$(self.selectors.error, self.element).text("Model must has non-zero length").show();
                        } else {
                            self.$(self.selectors.error, self.element).text("").hide();

                            (function () {
                                var model = new Webapp.Model.Model();
                                model.setName(modelName);

                                self.mapper.put(model, function (result) {
                                    self.$(self.element).trigger(UI.ModelsList.events.modelCreated, {
                                        target: model
                                    });
                                }, function (error) {
                                });
                            })();

                            self.hide();
                        }
                    });
            };

            /**
             * Shows widget
             *
             * @public
             */
            ModelsListCreate.prototype.show = function () {
                this.$(this.selectors.modal, this.element).modal('show');
            };

            /**
             * Hides widget
             *
             * @public
             */
            ModelsListCreate.prototype.hide = function () {
                this.$(this.selectors.modal, this.element).modal('hide');
            };

            return ModelsListCreate;
        })();

        return UI;
    })(Webapp.UI || (Webapp.UI = {}));

    return Webapp;
})(Webapp || {});