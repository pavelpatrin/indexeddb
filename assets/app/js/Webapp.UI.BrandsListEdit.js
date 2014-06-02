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
        UI.BrandsListEdit = (function () {
            function BrandsListEdit($, mapper, element) {
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
                 * @type {{modal: string, error: string, brandId: string, brandName: string, saveBtn: string}}
                 */
                this.selectors = {
                    modal: '[data-role~="modal"]',
                    error: '[data-role~="error"]',
                    brandId: '[data-role~="brand-id"]',
                    brandName: '[data-role~="brand-name"]',
                    saveBtn: '[data-role~="save-btn"]'
                };

                /**
                 * Constructor
                 *
                 * @this BrandsListEdit
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
             * Loads brand
             *
             * @protected
             *
             * @param {Webapp.Model.Brand} brand
             */
            BrandsListEdit.prototype.load = function (brand) {
                this.$(this.selectors.brandId, this.element).text(brand.getId());
                this.$(this.selectors.brandName, this.element).val(brand.getName());
                this.$(this.selectors.error, this.element).text("").hide();
            };

            /**
             * Clears widget to default state
             *
             * @protected
             */
            BrandsListEdit.prototype.clear = function () {
                this.$(this.selectors.brandId, this.element).html("");
                this.$(this.selectors.brandName, this.element).val("");
                this.$(this.selectors.error, this.element).text("").hide();
            };

            /**
             * Binds events on widget
             *
             * @protected
             */
            BrandsListEdit.prototype.bindEvents = function () {
                var self = this;

                /* Click events */
                this.$(this.element)
                    .on('click', this.selectors.saveBtn, function (e) {
                        var brandId = self.$(self.selectors.brandId, self.element).text();
                        var brandText = self.$(self.selectors.brandName, self.element).val();
                        if (!brandText.length) {
                            self.$(self.selectors.error, self.element).text("Brand must has non-zero length").show();
                        } else {
                            self.$(self.selectors.error, self.element).text("").hide();

                            (function () {
                                var brand = new Webapp.Model.Brand();
                                brand.setId(brandId);
                                brand.setName(brandText);

                                self.mapper.put(brand, function (reslut) {
                                    self.$(self.element).trigger(UI.BrandsList.events.brandChanged, {
                                        target: brand
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
             * @param {Webapp.Model.Brand} brand
             */
            BrandsListEdit.prototype.show = function (brand) {
                this.load(brand);
                this.$(this.selectors.modal, this.element).modal('show');
            };

            /**
             * Hides widget
             *
             * @public
             */
            BrandsListEdit.prototype.hide = function () {
                this.$(this.selectors.modal, this.element).modal('hide');
            };

            return BrandsListEdit;
        })();

        return UI;
    })(Webapp.UI || (Webapp.UI = {}));

    return Webapp;
})(Webapp || {});