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
         * @param {UI.BrandsListEdit} editWidget
         * @param {UI.BrandsListCreate} editWidget
         */
        UI.BrandsList = (function () {
            function BrandsList($, mapper, element, editWidget, createWidget) {
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
                 * @type UI.BrandsListEdit
                 */
                this.editWidget = null;

                /**
                 * @protected
                 *
                 * @type UI.BrandsListCreate
                 */
                this.createWidget = null;

                /**
                 * Widget elements selectors
                 *
                 * @protected
                 *
                 * @type {{modal: string, editBtn: string, createBtn: string, removeBtn: string, tableBody: string, tableRow: string, brandId: string, brandName: string}}
                 */
                this.selectors = {
                    modal: '[data-role~="modal"]',
                    editBtn: '[data-role~="edit-btn"]',
                    createBtn: '[data-role~="create-btn"]',
                    removeBtn: '[data-role~="remove-btn"]',
                    tableBody: '[data-role~="table-body"]',
                    tableRow: '[data-role~="table-row"]',
                    brandId: '[data-role~="brand-id"]',
                    brandName: '[data-role~="brand-name"]'
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
                 * @this BrandsList
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
            BrandsList.prototype.fetchTemplates = function () {
                this.templates.tableRow = this.$(this.selectors.tableRow, this.element).remove().get(0).outerHTML;
            };

            /**
             * @protected
             */
            BrandsList.prototype.loadTable = function () {
                var self = this;
                var $tableBody = this.$(this.selectors.tableBody, this.element).empty();

                this.mapper.getAll(Webapp.Model.Brand, function (brands) {
                    for (var i = 0; i < brands.length; i++) {
                        (function (brand) {
                            var $tableRow = self.$(self.templates.tableRow);
                            $tableRow.data('model', brand);
                            $tableRow.find(self.selectors.brandId).text(brand.getId());
                            $tableRow.find(self.selectors.brandName).text(brand.getName());
                            $tableRow.appendTo($tableBody);
                        })(brands[i]);
                    }
                }, function (error) {
                });
            };

            /**
             * Binds events on widget
             *
             * @protected
             */
            BrandsList.prototype.bindEvents = function () {
                var self = this;

                /* Buttons */
                this.$(this.element)
                    .on('click', this.selectors.removeBtn, function (event) {
                        var brand = self.$(event.target).closest(self.selectors.tableRow).data('model');
                        if (brand) {
                            self.mapper.delete(
                                brand,
                                function (result) {
                                    self.$(self.element).trigger(BrandsList.events.brandRemoved, {
                                        target: brand
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
                        var brand = self.$(event.target).closest(self.selectors.tableRow).data('model');
                        if (brand) {
                            self.editWidget.show(brand);
                        }
                    });

                /* Data changed events */
                this.$(window).on(BrandsList.events.brandCreated, function (e) {
                    self.loadTable();
                });
                this.$(window).on(BrandsList.events.brandChanged, function (e) {
                    self.loadTable();
                });
                this.$(window).on(BrandsList.events.brandRemoved, function (e) {
                    self.loadTable();
                });
            };

            /**
             * Shows widget
             *
             * @public
             */
            BrandsList.prototype.show = function () {
                this.loadTable();
                this.$(this.selectors.modal, this.element).modal('show');
            };

            /**
             * Hides widget
             *
             * @public
             */
            BrandsList.prototype.hide = function () {
                this.$(this.selectors.modal, this.element).modal('hide');
            };

            /**
             * Events
             *
             * @public
             *
             * @type {{brandCreated: string, brandChanged: string, brandRemoved: string}}
             */
            BrandsList.events = {
                brandCreated: 'brandcreated.brandslist',
                brandChanged: 'brandchanged.brandslist',
                brandRemoved: 'brandremoved.brandslist'
            };

            return BrandsList;
        })();

        return UI;
    })(Webapp.UI || (Webapp.UI = {}));

    return Webapp;
})(Webapp || {}, window);