/**
 * Created by pavelpat on 10/14/13.
 */

/** Strict mode */
"use strict";

var Webapp = (function (Webapp, window) {
    Webapp.UI = (function (UI) {
        /**
         * @constructor
         *
         * @param {jQuery} $
         * @param {Webapp.Storage.ModelMapper} mapper
         * @param {HTMLElement} element
         * @param {UI.ModelsListEdit} editWidget
         * @param {UI.ModelsListCreate} editWidget
         */
        UI.ModelsList = (function () {
            function ModelsList($, mapper, element, editWidget, createWidget) {
                /**
                 * @protected
                 *
                 * @type jQuery
                 */
                this.$;

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
                 * @protected
                 *
                 * @type UI.ModelsListEdit
                 */
                this.editWidget = null;

                /**
                 * @protected
                 *
                 * @type UI.ModelsListCreate
                 */
                this.createWidget = null;

                /**
                 * Widget elements selectors
                 *
                 * @protected
                 *
                 * @type {{modal: string, editBtn: string, createBtn: string, removeBtn: string, tableBody: string, tableRow: string, modelId: string, modelName: string}}
                 */
                this.selectors = {
                    modal: '[data-role~="modal"]',
                    editBtn: '[data-role~="edit-btn"]',
                    createBtn: '[data-role~="create-btn"]',
                    removeBtn: '[data-role~="remove-btn"]',
                    tableBody: '[data-role~="table-body"]',
                    tableRow: '[data-role~="table-row"]',
                    modelId: '[data-role~="model-id"]',
                    modelName: '[data-role~="model-name"]'
                };

                /**
                 * @protected
                 *
                 * @type {{tableRow: string}}
                 */
                this.templates = {
                    tableRow: null
                };

                /**
                 * Constructor
                 *
                 * @this ModelsList
                 */
                function constructor() {
                    this.$ = $;
                    this.mapper = mapper;
                    this.element = element;
                    this.editWidget = editWidget;
                    this.createWidget = createWidget;

                    this.fetchTemplates();
                    this.bindEvents();
                }

                constructor.call(this);
            }

            /**
             * Fetches templates from html
             *
             * @protected
             */
            ModelsList.prototype.fetchTemplates = function () {
                this.templates.tableRow = this.$(this.selectors.tableRow, this.element).remove().get(0).outerHTML;
            };

            /**
             * @protected
             */
            ModelsList.prototype.loadTable = function () {
                var self = this;
                var $tableBody = this.$(this.selectors.tableBody, this.element).empty();

                this.mapper.getAll(Webapp.Model.Model, function (models) {
                    for (var i = 0; i < models.length; i++) {
                        (function (model) {
                            var $tableRow = self.$(self.templates.tableRow);
                            $tableRow.data('model', model);
                            $tableRow.find(self.selectors.modelId).text(model.getId());
                            $tableRow.find(self.selectors.modelName).text(model.getName());
                            $tableRow.appendTo($tableBody);
                        })(models[i]);
                    }
                }, function (error) {
                });
            };

            /**
             * Binds events on widget
             *
             * @protected
             */
            ModelsList.prototype.bindEvents = function () {
                var self = this;

                /* Buttons */
                this.$(this.element)
                    .on('click', this.selectors.removeBtn, function (event) {
                        var model = self.$(event.target).closest(self.selectors.tableRow).data('model');
                        if (model) {
                            self.mapper.delete(
                                model,
                                function (result) {
                                    self.$(self.element).trigger(ModelsList.events.modelRemoved, {
                                        target: model
                                    });
                                },
                                function (result) {
                                }
                            );
                        }
                    })
                    .on('click', this.selectors.createBtn, function (e) {
                        self.createWidget.show();
                    })
                    .on('click', this.selectors.editBtn, function (e) {
                        var modal = self.$(event.target).closest(self.selectors.tableRow).data('model');
                        if (modal) {
                            self.editWidget.show(modal);
                        }
                    });

                /* Data changed events */
                this.$(window).on(ModelsList.events.modelCreated, function (e) {
                    self.loadTable();
                });
                this.$(window).on(ModelsList.events.modelChanged, function (e) {
                    self.loadTable();
                });
                this.$(window).on(ModelsList.events.modelRemoved, function (e) {
                    self.loadTable();
                });
            };

            /**
             * Shows widget
             *
             * @public
             */
            ModelsList.prototype.show = function () {
                this.loadTable();
                this.$(this.selectors.modal, this.element).modal('show');
            };

            /**
             * Hides widget
             *
             * @public
             */
            ModelsList.prototype.hide = function () {
                this.$(this.selectors.modal, this.element).modal('hide');
            };

            /**
             * Events
             *
             * @public
             *
             * @type {{modelCreated: string, modelChanged: string, modelRemoved: string}}
             */
            ModelsList.events = {
                modelCreated: 'modelcreated.modelslist',
                modelChanged: 'modelchanged.modelslist',
                modelRemoved: 'modelremoved.modelslist'
            };

            return ModelsList;
        })();

        return UI;
    })(Webapp.UI || (Webapp.UI = {}));

    return Webapp;
})(Webapp || {}, window);