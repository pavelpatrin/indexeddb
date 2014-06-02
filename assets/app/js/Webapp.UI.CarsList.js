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
         * @param {UI.CarsListEdit} editWidget
         * @param {UI.CarsListCreate} createWidget
         */
        UI.CarsList = (function () {
            function CarsList($, mapper, element, editWidget, createWidget) {
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
                 * @protected
                 *
                 * @type {UI.CarsListEdit}
                 */
                this.editWidget = null;

                /**
                 * @protected
                 *
                 * @type {UI.CarsListCreate}
                 */
                this.createWidget = null;

                /**
                 * Widget elements selectors
                 *
                 * @protected
                 *
                 * @type {{editBtn: string, createBtn: string, removeBtn: string, tableBody: string, tableRow: string, carId: string, brandName: string, modelName: string, year: string, price: string}}
                 */
                this.selectors = {
                    editBtn: '[data-role~="edit-btn"]',
                    createBtn: '[data-role~="create-btn"]',
                    removeBtn: '[data-role~="remove-btn"]',
                    tableBody: '[data-role~="table-body"]',
                    tableRow: '[data-role~="table-row"]',
                    carId: '[data-role~="car-id"]',
                    brandName: '[data-role~="brand-name"]',
                    modelName: '[data-role~="model-name"]',
                    year: '[data-role~="year"]',
                    price: '[data-role~="price"]'
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
                    this.loadTable();
                    this.bindEvents();
                }

                constructor.call(this);
            }

            /**
             * Fetches templates from html
             *
             * @protected
             */
            CarsList.prototype.fetchTemplates = function () {
                this.templates.tableRow = this.$(this.selectors.tableRow, this.element).remove().get(0).outerHTML;
            };

            /**
             * @protected
             */
            CarsList.prototype.loadTable = function () {
                var self = this;
                var $tableBody = this.$(this.selectors.tableBody, this.element).empty();

                this.mapper.getAll(Webapp.Model.Car, function (cars) {
                    for (var i = 0; i < cars.length; i++) {
                        (function (car) {
                            var $tableRow = self.$(self.templates.tableRow);
                            $tableRow.data('model', car);
                            $tableRow.find(self.selectors.carId).text(car.getId());

                            self.mapper.get(
                                Webapp.Model.Brand,
                                car.getBrandId(),
                                function (brand) {
                                    if (brand) {
                                        $tableRow.find(self.selectors.brandName).text(brand.getName());
                                    } else {
                                        $tableRow.find(self.selectors.brandName).text("Brand is not found");
                                    }
                                },
                                function (error) {
                                    $tableRow.find(self.selectors.brandName).text("Error loading brand");
                                }
                            );

                            self.mapper.get(
                                Webapp.Model.Model,
                                car.getModelId(),
                                function (model) {
                                    if (model) {
                                        $tableRow.find(self.selectors.modelName).text(model.getName());
                                    } else {
                                        $tableRow.find(self.selectors.modelName).text("Model is not found");
                                    }
                                },
                                function (error) {
                                    $tableRow.find(self.selectors.modelName).text("Error loading model")
                                }
                            );

                            $tableRow.find(self.selectors.year).text(car.getYear());
                            $tableRow.find(self.selectors.price).text(car.getPrice());

                            $tableRow.appendTo($tableBody);
                        })(cars[i]);
                    }
                }, function (error) {
                });
            };

            /**
             * Binds events on widget
             *
             * @protected
             */
            CarsList.prototype.bindEvents = function () {
                var self = this;

                /* Click events */
                this.$(this.element)
                    .on('click', this.selectors.removeBtn, function (e) {
                        var car = self.$(e.target).closest(self.selectors.tableRow).data('model');
                        if (car) {
                            self.mapper.delete(car, function () {
                                self.$(e.target).trigger(CarsList.events.carRemoved, {
                                    target: car
                                });
                            }, function (error) {
                            });
                        }
                    })
                    .on('click', this.selectors.createBtn, function (e) {
                        self.createWidget.show();
                    })
                    .on('click', this.selectors.editBtn, function (e) {
                        var car = self.$(e.target).closest(self.selectors.tableRow).data('model');
                        if (car) {
                            self.editWidget.show(car);
                        }
                    });

                /* Data events */
                /* @TODO: Think aboud common datachanged.webapp event */
                this.$(window)
                    .on(CarsList.events.carCreated, function () {
                        self.loadTable();
                    })
                    .on(CarsList.events.carChanged, function () {
                        self.loadTable();
                    })
                    .on(CarsList.events.carRemoved, function () {
                        self.loadTable();
                    })
                    .on(UI.BrandsList.events.brandCreated, function () {
                        self.loadTable();
                    })
                    .on(UI.BrandsList.events.brandChanged, function () {
                        self.loadTable();
                    })
                    .on(UI.BrandsList.events.brandRemoved, function () {
                        self.loadTable();
                    })
                    .on(UI.ModelsList.events.modelCreated, function () {
                        self.loadTable();
                    })
                    .on(UI.ModelsList.events.modelChanged, function () {
                        self.loadTable();
                    })
                    .on(UI.ModelsList.events.modelRemoved, function () {
                        self.loadTable();
                    });
            };

            /**
             * Shows widget
             *
             * @public
             */
            CarsList.prototype.show = function () {
                this.$(this.selectors.standaloneList, this.element).modal('show');
            };

            /**
             * Hides widget
             *
             * @public
             */
            CarsList.prototype.hide = function () {
                this.$(this.selectors.standaloneList, this.element).modal('hide');
            };

            /**
             * Events
             *
             * @public
             *
             * @type {{carCreated: string, carChanged: string, carRemoved: string}}
             */
            CarsList.events = {
                carCreated: 'carcreated.carslist',
                carChanged: 'carchanged.carslist',
                carRemoved: 'carremoved.carslist'
            };

            return CarsList;
        })();

        return UI;
    })(Webapp.UI || (Webapp.UI = {}));

    return Webapp;
})(Webapp || {}, window);