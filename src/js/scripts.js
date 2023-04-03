(function ($) {

    'use strict';

    const functions = {
        init: () => {
            functions.fixedHeader();
            functions.mobileToggle();
            functions.sliders();
            functions.carousels();
            functions.calculator();
            functions.tabs();
            functions.accordion();
            functions.contactForm();
            functions.signinForm();
            functions.signupForm();
            functions.masonry();
            functions.modals();
            functions.common();
            functions.onResize();
        },

        fixedHeader: () => {
            const $header = $('[data-header-fixed]')

            $(window).scroll((e) => {
                $('.header').offset().top > 10 ? $header.addClass('fixed') : $header.removeClass('fixed')
            });
        },

        mobileToggle: () => {
            const $toggle = $('[data-menu-toggle]')
            const $nav = $('[data-menu-nav]')

            $toggle.on('click', () => {
                $toggle.toggleClass('open')
                $nav.toggleClass('open')
            })
        },

        sliders: () => {
            $('[data-hero-slider]').owlCarousel({
                items: 1,
                margin: 0,
                autoHeight: true,
                loop: true,
                autoplay: true,
                nav: true,
                dots: false,
                autoplayTimeout: 30000,
                autoplayHoverPause: true
            });

            $('[data-reviews-slider]').owlCarousel({
                items: 1,
                margin: 0,
                autoHeight: true,
                loop: false,
                nav: true,
                dots: false,
            });

            $('[data-deposit-slider]').owlCarousel({
                items: 1,
                margin: 0,
                autoHeight: true,
                loop: false,
                nav: true,
                dots: false,
            });

            $('[data-history-slider]').owlCarousel({
                items: 1,
                margin: 0,
                autoHeight: true,
                loop: false,
                nav: true,
                dots: false,
                touchDrag: false,
                mouseDrag: false,
            });
        },

        carousels: () => {
            try{
                const carouselResult = new Carousel(document.querySelector('[data-result-carousel]'), {
                    'slidesPerPage': 'auto',
                    'friction' : 0.8,
                    'center' : false,
                    Dots: false,
                });

                if ( $(window).width() > 1900) carouselResult.destroy();

                const carouselRoadmap = new Carousel(document.querySelector('[data-roadmap-carousel]'), {
                    'slidesPerPage': 'auto',
                    'infinite' : false,
                    'fill' : true,
                    'friction' : 0.8,
                    'center' : false,
                    Dots: false,
                    on: {
                        change: (carousel) => {
                            if(carousel.pages.length === (carousel.page + 1)){
                                $('.roadmap__wrap').addClass('after--hide')
                            } else {
                                $('.roadmap__wrap').removeClass('after--hide')
                            }
                        },
                    },
                });
            } catch (e) {}
        },

        calculator: () => {
            const $dailyProfit = $('[data-daily-profit]');
            const $totalProfit = $('[data-total-profit]');
            const $amount = $('[data-amount]');
            const $form = $('#calcForm');

            const calculate = () => {
                const amountVal = parseFloat($amount.val());
                const currency = $('[data-currency]:checked').val();
                let daily = (amountVal / 100 * 2)
                let total = 0

                switch (currency) {
                    case 'BTC':
                        daily = daily * 20209.5;
                        total = daily * 30;
                        break;
                    case 'ETH':
                        daily = daily * 1622.13;
                        total = daily * 30;
                        break;
                    case 'LTC':
                        daily = daily * 60;
                        total = daily * 30;
                        break;
                    case 'TRC':
                        daily = daily * 1;
                        total = daily * 30;
                        break;
                    case 'XRP':
                        daily = daily * 0.3427;
                        total = daily * 30;
                        break;
                    case 'BNB':
                        daily = daily * 120.27;
                        total = daily * 30;
                        break;
                    default:
                        daily = daily * 1;
                        total = daily * 30;
                }
                
                $dailyProfit.text((!isNaN(daily) ? daily.toFixed(2) : '0.00') + '$');
                $totalProfit.text((!isNaN(total) ? total.toFixed(2) : '0.00') + '$');
            }

            // calculate
            calculate()
            $amount.on('keyup', () => {
                calculate()
                $amount.removeClass('error').next('.error-text').hide()
            });

            $('[data-currency]').on('change', () => calculate())

            $('[data-tab-nav]').on('click', function() {
                $('[data-currency]').prop('checked', false);
                $amount.val('');
                calculate()
            })

            // check form
            $form.on('submit', (e) => {
                const valid = !validator.isEmpty($amount.val())

                if (valid) {
                    return true
                } else {
                    $amount.addClass('error').next('.error-text').show()
                }

                return false
            });
        },

        tabs: () => {
            const $tab = $('[data-tab-body]');
            const $nav = $('[data-tab-nav]');

            $tab.hide().filter(':first').show();

            $nav.on('click', function(e) {
                e.preventDefault()

                $tab.hide();
                $tab.filter(this.hash).show();
                $nav.removeClass('active');
                $(this).addClass('active');
                return false;
            }).filter(':first').click();
        },
        
        accordion: () => {
            const $acc = $('[data-acc-body]');
            const $nav = $('[data-acc-nav]');

            $acc.hide().filter(':first').show();

            $nav.on('click', function(e) {
                e.preventDefault()

                $acc.hide();
                $acc.filter(this.hash).show();
                $nav.removeClass('active');
                $(this).addClass('active');
                return false;
            }).filter(':first').click();
        },

        contactForm: () => {
            const $form = $('#contactForm');
            const $name = $('input[name="name"]');
            const $email = $('input[name="email"]');
            const $captcha = $('input[name="captcha"]');
            const $message = $('textarea[name="message"]');

            let requared = false;
            const error = ($el) => {
                requared = false;
                $el.parents('.form-line').addClass('error');
            }
            const valid = ($el) => {
                requared = true;
                $el.parents('.form-line').removeClass('error');
            }

            $form.on('click', 'button', (e) => {
                e.preventDefault()

                // check name
                validator.isEmpty($name.val()) ? error($name) : valid($name);

                // check email
                !validator.isEmail($email.val()) ? error($email) : valid($email);

                // check captcha
                validator.isEmpty($captcha.val()) ? error($captcha) : valid($captcha);

                // check message
                validator.isEmpty($message.val()) ? error($message) : valid($message);

                if (requared) return true;

                return false;
            })
        },

        signinForm: () => {
            const $form = $('#signinForm');
            const $login = $('input[name="login"]', $form);
            const $password = $('input[name="password"]', $form);
            const $captcha = $('input[name="captcha"]', $form);

            let requared = false;
            const error = ($el) => {
                requared = false;
                $el.parents('.form-line').addClass('error');
            }
            const valid = ($el) => {
                requared = true;
                $el.parents('.form-line').removeClass('error');
            }

            $form.on('click', 'button', (e) => {
                e.preventDefault()

                // check login
                validator.isEmpty($login.val()) ? error($login) : valid($login);

                // check password
                !validator.isStrongPassword($password.val()) ? error($password) : valid($password);

                // check captcha
                validator.isEmpty($captcha.val()) ? error($captcha) : valid($captcha);

                if (requared) return true;

                return false;
            })
        },

        signupForm: () => {
            const $form = $('#signupForm');
            const $name = $('input[name="name"]', $form);
            const $surname = $('input[name="surname"]', $form);
            const $invites = $('input[name="invites"]', $form);
            const $email = $('input[name="email"]', $form);
            const $password = $('input[name="password"]', $form);
            const $passwordRepeat = $('input[name="password_repeat"]', $form);
            const $captcha = $('input[name="captcha"]', $form);
            const $agrees = $('input[name="agrees"]', $form);

            let requared = false;
            const error = ($el) => {
                requared = false;
                $el.parents('.form-line').addClass('error');
            }
            const valid = ($el) => {
                requared = true;
                $el.parents('.form-line').removeClass('error');
            }

            $form.on('click', 'button', (e) => {
                e.preventDefault()

                // check name
                validator.isEmpty($name.val()) ? error($name) : valid($name);

                // check surname
                validator.isEmpty($surname.val()) ? error($surname) : valid($surname);

                // check email
                !validator.isEmail($email.val()) ? error($email) : valid($email);

                // check password
                !validator.isStrongPassword($password.val()) ? error($password) : valid($password);
                !validator.isStrongPassword($passwordRepeat.val()) || ($passwordRepeat.val() !== $password.val()) ? error($passwordRepeat) : valid($passwordRepeat);

                // check invites
                validator.isEmpty($invites.val()) ? error($invites) : valid($invites);

                // check captcha
                validator.isEmpty($captcha.val()) ? error($captcha) : valid($captcha);

                // check agrees
                !$agrees.is(':checked') ? error($agrees) : valid($agrees)

                if (requared) return true;

                return false;
            })
        },

        masonry: () => {
            $('[data-masonry]').masonry({
                itemSelector: '.masonry-grid__item',
                horizontalOrder: true,
                percentPosition: true,
                transitionDuration: 0
            });
        },

        modals: () => {
            const $modal = $('[data-modal]')
            const $openModal = $('[data-modal-opened]')
            const id = $openModal.attr('id')

            if ($openModal.length > 0) {
                Fancybox.show([{ src: `#${id}`, type: "inline" }]);
            }

            $modal.on('click', '[data-modal-close]', function(e) {
                Fancybox.close();
            });
        },

        common: () => {
            // selectric.js
            try {
                $('select').selectric();
            } catch (e){}

            // clipboard.js
            try {
                const clipboard = new ClipboardJS('[data-clipboard]');

                clipboard.on('success', function (e) {
                    const id = e.trigger.getAttribute('data-clipboard-target');
                    id ? $(id).select() : $(e).select()
                });
            } catch (e){}

            // fancybox.js
            Fancybox.bind("[data-fancybox]", {
                Html: {
                    video: {
                        autoplay: true,
                    }
                },
            });
        },

        onResize: () => {
            setTimeout(() => {
                functions.masonry()
            }, 1000)

            window.addEventListener("resize", function () {
                functions.carousels()
                functions.masonry()
            }, false);
        },
    };

    // Run the function
    $(function () {
        functions.init();
    });
})(jQuery);