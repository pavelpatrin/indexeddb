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
        UI.ModelsListEdit = (function () {
            function ModelsListEdit($, mapper, element) {
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
                 * @type {{modal: string, error: string, modelId: string, modelName: string, saveBtn: string}}
                 */
                this.selectors = {
                    modal: '[data-role~="modal"]',
                    error: '[data-role~="error"]',
                    modelId: '[data-role~="model-id"]',
                    modelName: '[data-role~="model-name"]',
                    saveBtn: '[data-role~="save-btn"]'
                };

                /**
                 * Constructor
                 *
                 * @this ModelsListEdit
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
             * Loads model
             *
             * @protected
             *
             * @param {Webapp.Model.Model} model
             */
            ModelsListEdit.prototype.load = function (model) {
                this.$(this.selectors.modelId, this.element).text(model.getId());
                this.$(this.selectors.modelName, this.element).val(model.getName());
                this.$(this.selectors.error, this.element).text("").hide();
            };

            /**
             * Clears widget to default state
             *
             * @protected
             */
            ModelsListEdit.prototype.clear = function () {
                this.$(this.selectors.modelId, this.element).html("");
                this.$(this.selectors.modelName, this.element).val("");
                this.$(this.selectors.error, this.element).text("").hide();
            };

            /**
             * Binds events on widget
             *
             * @protected
             */
            ModelsListEdit.prototype.bindEvents = function () {
                var self = this;

                /* Click events */
                this.$(this.element)
                    .on('click', this.selectors.saveBtn, function (e) {
                        var modelId = self.$(self.selectors.modelId, self.element).text();
                        var modelText = self.$(self.selectors.modelName, self.element).val();
                        if (!modelText.length) {
                            self.$(self.selectors.error, self.element).text("Model must has non-zero length").show();
                        } else {
                            self.$(self.selectors.error, self.element).text("").hide();

                            (function () {
                                var model = new Webapp.Model.Model();
                                model.setId(modelId);
                                model.setName(modelText);

                                self.mapper.put(model, function (reslut) {
                                    self.$(self.element).trigger(UI.ModelsList.events.modelChanged, {
                                        target: model
                                    });
                                }, function (error) {
                                });
                            })();

                            self.hide();
                        }
                    });

                /* Modal */
                this.$(this.element).on({
                    'show.bs.modal': function (e) {
                    },
                    'shown.bs.modal': function (e) {
                    },
                    'hide.bs.modal': function (e) {
                    },
                    'hidden.bs.modal': function (e) {
                        self.clear();
                    }
                });
            };

            /**
             * Shows widget
             *
             * @public
             *
             * @param {Webapp.Model.Model} model
             */
            ModelsListEdit.prototype.show = function (model) {
                this.load(model);
                this.$(this.selectors.modal, this.element).modal('show');
            };

            /**
             * Hides widget
             *
             * @public
             */
            ModelsListEdit.prototype.hide = function () {
                this.$(this.selectors.modal, this.element).modal('hide');
            };

            return ModelsListEdit;
        })();

        return UI;
    })(Webapp.UI || (Webapp.UI = {}));

    return Webapp;
})(Webapp || {});