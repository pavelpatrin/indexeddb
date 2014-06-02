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
        UI.CarsListCreate = (function () {
            function CarsListCreate($, mapper, element) {
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
                 * @type {{modal: string, error: string, brandId: string, modelId: string, year: string, price: string, saveBtn: string}}
                 */
                this.selectors = {
                    modal: '[data-role~="modal"]',
                    error: '[data-role~="error"]',
                    brandId: '[data-role~="brand-id"]',
                    modelId: '[data-role~="model-id"]',
                    year: '[data-role~="year"]',
                    price: '[data-role~="price"]',
                    saveBtn: '[data-role~="save-btn"]'
                };

                /**
                 * Constructor
                 *
                 * @this CarsListCreate
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
             * Initializes brand select elements
             *
             * @protected
             *
             * @param {number} brandId Id of selected brand
             */
            CarsListCreate.prototype.initBrandsSelect = function (brandId) {
                var self = this;

                this.mapper.getAll(Webapp.Model.Brand, function (brands) {
                    (function ($select) {
                        $select.empty().append('<option value="">Not selected...</option>');

                        brands.forEach(function (brand) {
                            var $option = self.$('<option />');
                            $option.val(brand.getId());
                            $option.text(brand.getName());
                            if (brandId === brand.getId()) {
                                $option.attr('selected', 'selected');
                            }
                            $option.appendTo($select);
                        });
                    })(self.$(self.selectors.brandId, self.element));
                }, function () {
                });
            };

            /**
             * Initializes select elements
             *
             * @protected
             *
             * @param {number} modelId Id of selected model
             */
            CarsListCreate.prototype.initModelsSelect = function (modelId) {
                var self = this;

                this.mapper.getAll(Webapp.Model.Model, function (models) {
                    (function ($select) {
                        $select.empty().append('<option value="">Not selected...</option>');

                        models.forEach(function (model) {
                            var $option = self.$('<option />');
                            $option.val(model.getId());
                            $option.text(model.getName());
                            if (modelId === model.getId()) {
                                $option.attr('selected', 'selected');
                            }
                            $option.appendTo($select);
                        });
                    })(self.$(self.selectors.modelId, self.element));
                }, function () {
                });
            };

            /**
             * Binds events on widget
             *
             * @protected
             */
            CarsListCreate.prototype.bindEvents = function () {
                var self = this;

                /* Edit form */
                this.$(this.element)
                    .on('click', this.selectors.saveBtn, function (e) {
                        var brandId = self.$(self.selectors.brandId, self.element).val();
                        if (!brandId) {
                            self.$(self.selectors.error, self.element).text("Brand is not selected").show();
                            return;
                        } else {
                            self.$(self.selectors.error, self.element).text("").hide();
                        }

                        var modelId = self.$(self.selectors.modelId, self.element).val();
                        if (!modelId) {
                            self.$(self.selectors.error, self.element).text("Model is not selected").show();
                            return;
                        } else {
                            self.$(self.selectors.error, self.element).text("").hide();
                        }

                        var year = self.$(self.selectors.year, self.element).val();
                        if (!year.length) {
                            self.$(self.selectors.error, self.element).text("Year must has non-zero length").show();
                            return;
                        } else {
                            self.$(self.selectors.error, self.element).text("").hide();
                        }

                        var price = self.$(self.selectors.price, self.element).val();
                        if (!price.length) {
                            self.$(self.selectors.error, self.element).text("Price must has non-zero length").show();
                            return;
                        } else {
                            self.$(self.selectors.error, self.element).text("").hide();
                        }

                        (function () {
                            var car = new Webapp.Model.Car();
                            car.setBrandId(brandId);
                            car.setModelId(modelId);
                            car.setYear(year);
                            car.setPrice(price);

                            self.mapper.put(
                                car,
                                function (result) {
                                    self.$(self.element).trigger(UI.CarsList.events.carCreated, {
                                        target: car
                                    });
                                },
                                function (result) {
                                }
                            );
                        })();

                        self.hide();
                    });

                /* Modal */
                this.$(this.element).on({
                    'show.bs.modal': function (e) {
                    },
                    'shown.bs.modal': function (e) {
                    },
                    'hide.bs.modal': function (e) {
                    },
                    'hiden.bs.modal': function (e) {
                    }
                });
            };

            /**
             * Shows widget
             *
             * @public
             */
            CarsListCreate.prototype.show = function () {
                this.initBrandsSelect(0);
                this.initModelsSelect(0);
                this.$(this.selectors.modal, this.element).modal('show');
            };

            /**
             * Hides widget
             *
             * @public
             */
            CarsListCreate.prototype.hide = function () {
                this.$(this.selectors.modal, this.element).modal('hide');
            };

            return CarsListCreate;
        })();

        return UI;
    })(Webapp.UI || (Webapp.UI = {}));

    return Webapp;
})(Webapp || {});
