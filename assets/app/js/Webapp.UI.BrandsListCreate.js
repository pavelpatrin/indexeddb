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
        UI.BrandsListCreate = (function () {
            function BrandsListCreate($, mapper, element) {
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
                 * @type {{modal: string, error: string, brandName: string, saveBtn: string}}
                 */
                this.selectors = {
                    modal: '[data-role~="modal"]',
                    error: '[data-role~="error"]',
                    brandName: '[data-role~="brand-name"]',
                    saveBtn: '[data-role~="save-btn"]'
                };

                /**
                 * Constructor
                 *
                 * @this BrandsListCreate
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
            BrandsListCreate.prototype.bindEvents = function () {
                var self = this;

                /* Click events */
                this.$(this.element)
                    .on('click', this.selectors.saveBtn, function (e) {
                        var brandName = self.$(self.selectors.brandName, self.element).val();
                        if (!brandName.length) {
                            self.$(self.selectors.error, self.element).text("Brand must has non-zero length").show();
                        } else {
                            self.$(self.selectors.error, self.element).text("").hide();

                            (function () {
                                var brand = new Webapp.Model.Brand();
                                brand.setName(brandName);

                                self.mapper.put(brand, function (result) {
                                    self.$(self.element).trigger(UI.BrandsList.events.brandCreated, {
                                        target: brand
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
            BrandsListCreate.prototype.show = function () {
                this.$(this.selectors.modal, this.element).modal('show');
            };

            /**
             * Hides widget
             *
             * @public
             */
            BrandsListCreate.prototype.hide = function () {
                this.$(this.selectors.modal, this.element).modal('hide');
            };

            return BrandsListCreate;
        })();

        return UI;
    })(Webapp.UI || (Webapp.UI = {}));

    return Webapp;
})(Webapp || {});