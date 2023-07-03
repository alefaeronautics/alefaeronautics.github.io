/**
 * Global variables
 */
var salt = String.fromCharCode(97, 101, 114, 111);
"use strict";
(function () {
	var isNoviBuilder = window.xMode;
	var userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$document = $( document ),
		$window = $( window ),
		$html = $( "html" ),

		isDesktop = $html.hasClass( "desktop" ),
		isIE = userAgent.indexOf( "msie" ) != -1 ? parseInt( userAgent.split( "msie" )[ 1 ] ) : userAgent.indexOf( "trident" ) != -1 ? 11 : userAgent.indexOf( "edge" ) != -1 ? 12 : false,
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ),
		isSafari = !!navigator.userAgent.match( /Version\/[\d\.]+.*Safari/ ),
		plugins = {
			bootstrapTooltip:        $( "[data-toggle='tooltip']" ),
			copyrightYear:           $( '.copyright-year' ),
			rdNavbar:                $( ".rd-navbar" ),
			materialParallax:        $( ".parallax-container" ),
			rdMailForm:              $( ".rd-mailform" ),
			rdInputLabel:            $( ".form-label" ),
			regula:                  $( "[data-constraints]" ),
			owl:                     $( ".owl-carousel" ),
			isotope:                 $( ".isotope" ),
			radio:                   $( "input[type='radio']" ),
			checkbox:                $( "input[type='checkbox']" ),
			counter:                 $( ".counter" ),
			pageLoader:              $( "#page-loader" ),
			captcha:                 $( '.recaptcha' ),
			lightGallery:            $( '[data-lightgallery="group"]' ),
			lightGalleryItem:        $( '[data-lightgallery="item"]' ),
			lightDynamicGalleryItem: $( '[data-lightgallery="dynamic"]' ),
			bootstrapDateTimePicker: $( "[data-time-picker]" ),
			slick:                   $( '.slick-slider' )
		};

	// Initialize scripts that require a loaded window
	$window.on('load', function () {
		// Material Parallax
		if ( plugins.materialParallax.length ) {
			if ( !isNoviBuilder && !isIE && !isMobile) {
				plugins.materialParallax.parallax();
			} else {
				for ( var i = 0; i < plugins.materialParallax.length; i++ ) {
					var $parallax = $(plugins.materialParallax[i]);

					$parallax.addClass( 'parallax-disabled' );
					$parallax.css({ "background-image": 'url('+ $parallax.data("parallax-img") +')' });
				}
			}
		}
	});

	/**
	 * Initialize All Scripts
	 */
	$( function () {
		/**
		 * @desc Initialize owl carousel plugin
		 * @param {object} c - carousel jQuery object
		 */
		function initOwlCarousel ( c ) {
			var aliaces = [ "-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-" ],
				values = [ 0, 480, 576, 768, 992, 1200, 1600 ],
				responsive = {};

			for ( var j = 0; j < values.length; j++ ) {
				responsive[ values[ j ] ] = {};
				for ( var k = j; k >= -1; k-- ) {
					if ( !responsive[ values[ j ] ][ "items" ] && c.attr( "data" + aliaces[ k ] + "items" ) ) {
						responsive[ values[ j ] ][ "items" ] = k < 0 ? 1 : parseInt( c.attr( "data" + aliaces[ k ] + "items" ), 10 );
					}
					if ( !responsive[ values[ j ] ][ "stagePadding" ] && responsive[ values[ j ] ][ "stagePadding" ] !== 0 && c.attr( "data" + aliaces[ k ] + "stage-padding" ) ) {
						responsive[ values[ j ] ][ "stagePadding" ] = k < 0 ? 0 : parseInt( c.attr( "data" + aliaces[ k ] + "stage-padding" ), 10 );
					}
					if ( !responsive[ values[ j ] ][ "margin" ] && responsive[ values[ j ] ][ "margin" ] !== 0 && c.attr( "data" + aliaces[ k ] + "margin" ) ) {
						responsive[ values[ j ] ][ "margin" ] = k < 0 ? 30 : parseInt( c.attr( "data" + aliaces[ k ] + "margin" ), 10 );
					}
				}
			}

			// Enable custom pagination
			if ( c.attr( 'data-dots-custom' ) ) {
				c.on( "initialized.owl.carousel", function ( event ) {
					var carousel = $( event.currentTarget ),
						customPag = $( carousel.attr( "data-dots-custom" ) ),
						active = 0;

					if ( carousel.attr( 'data-active' ) ) {
						active = parseInt( carousel.attr( 'data-active' ) );
					}

					carousel.trigger( 'to.owl.carousel', [ active, 300, true ] );
					customPag.find( "[data-owl-item='" + active + "']" ).addClass( "active" );

					customPag.find( "[data-owl-item]" ).on( 'click', function ( e ) {
						e.preventDefault();
						carousel.trigger( 'to.owl.carousel', [ parseInt( this.getAttribute( "data-owl-item" ) ), 300, true ] );
					} );

					carousel.on( "translate.owl.carousel", function ( event ) {
						customPag.find( ".active" ).removeClass( "active" );
						customPag.find( "[data-owl-item='" + event.item.index + "']" ).addClass( "active" )
					} );
				} );
			}

			if ( c.attr( 'data-nav-custom' ) ) {
				c.on( "initialized.owl.carousel", function ( event ) {
					var carousel = $( event.currentTarget ),
						customNav = $( carousel.attr( "data-nav-custom" ) );

					// Custom Navigation Events
					customNav.find( ".owl-arrow-next" ).click( function ( e ) {
						e.preventDefault();
						carousel.trigger( 'next.owl.carousel' );
					} );
					customNav.find( ".owl-arrow-prev" ).click( function ( e ) {
						e.preventDefault();
						carousel.trigger( 'prev.owl.carousel' );
					} );
				} );
			}


			c.on( "initialized.owl.carousel", function () {
				initLightGalleryItem( c.find( '[data-lightgallery="item"]' ), 'lightGallery-in-carousel' );
			} );

			c.owlCarousel( {
				autoplay:      isNoviBuilder ? false : c.attr( "data-autoplay" ) === "true",
				loop:          isNoviBuilder ? false : c.attr( "data-loop" ) !== "false",
				items:         1,
				center:        c.attr( "data-center" ) === "true",
				dotsContainer: c.attr( "data-pagination-class" ) || false,
				navContainer:  c.attr( "data-navigation-class" ) || false,
				mouseDrag:     isNoviBuilder ? false : c.attr( "data-mouse-drag" ) !== "false",
				nav:           c.attr( "data-nav" ) === "true",
				dots:          c.attr( "data-dots" ) === "true",
				dotsEach:      c.attr( "data-dots-each" ) ? parseInt( c.attr( "data-dots-each" ), 10 ) : false,
				animateIn:     c.attr( 'data-animation-in' ) ? c.attr( 'data-animation-in' ) : false,
				animateOut:    c.attr( 'data-animation-out' ) ? c.attr( 'data-animation-out' ) : false,
				responsive:    responsive,
				navText:       c.attr( "data-nav-text" ) ? $.parseJSON( c.attr( "data-nav-text" ) ) : [],
				navClass:      c.attr( "data-nav-class" ) ? $.parseJSON( c.attr( "data-nav-class" ) ) : [ 'owl-prev', 'owl-next' ]
			} );
		}

		/**
		 * @desc Initialize the gallery with set of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGallery ( itemsToInit, addClass ) {
			if ( !isNoviBuilder ) {
				$( itemsToInit ).lightGallery( {
					thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
					selector: "[data-lightgallery='item']",
					autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
					pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
					addClass: addClass,
					mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
					loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false"
				} );
			}
		}

		/**
		 * @desc Initialize the gallery with dynamic addition of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initDynamicLightGallery ( itemsToInit, addClass ) {
			if ( !isNoviBuilder ) {
				$( itemsToInit ).on( "click", function () {
					$( itemsToInit ).lightGallery( {
						thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
						selector: "[data-lightgallery='item']",
						autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
						pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
						addClass: addClass,
						mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
						loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false",
						dynamic: true,
						dynamicEl: JSON.parse( $( itemsToInit ).attr( "data-lg-dynamic-elements" ) ) || []
					} );
				} );
			}
		}

		/**
		 * @desc Initialize the gallery with one image
		 * @param {object} itemToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGalleryItem ( itemToInit, addClass ) {
			if ( !isNoviBuilder ) {
				$( itemToInit ).lightGallery( {
					selector: "this",
					addClass: addClass,
					counter: false,
					youtubePlayerParams: {
						modestbranding: 1,
						showinfo: 0,
						rel: 0,
						controls: 0
					},
					vimeoPlayerParams: {
						byline: 0,
						portrait: 0
					}
				} );
			}
		}

		/**
		 * Init Bootstrap tooltip
		 * @description  calls a function when need to init bootstrap tooltips
		 */
		function initBootstrapTooltip ( tooltipPlacement ) {
			if ( window.innerWidth < 599 ) {
				plugins.bootstrapTooltip.tooltip( 'destroy' );
				plugins.bootstrapTooltip.tooltip( {
					placement: 'bottom'
				} );
			} else {
				plugins.bootstrapTooltip.tooltip( 'destroy' );
				plugins.bootstrapTooltip.tooltipPlacement;
				plugins.bootstrapTooltip.tooltip();
			}
		}

		/**
		 * isScrolledIntoView
		 * @description  check the element whas been scrolled into the view
		 */
		function isScrolledIntoView ( elem ) {
			if ( !isNoviBuilder ) {
				return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
			} else {
				return true;
			}
		}

		/**
		 * @desc Attach form validation to elements
		 * @param {object} elements - jQuery object
		 */
		function attachFormValidator(elements) {
			// Custom validator - phone number
			regula.custom({
				name: 'PhoneNumber',
				defaultMessage: 'Invalid phone number format',
				validator: function() {
					if ( this.value === '' ) return true;
					else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test( this.value );
				}
			});

			// Custom validator - file type pdf doc
			regula.custom({
				name: 'Resume',
				defaultMessage: 'Unacceptable file type (PDF,DOC,DOCX,ODT,RTF,TXT required)',
				validator: function() {
					this.style.color = (this.value=='') ? "rgba(0,0,0,0)" : "#293c98";
					if ( this.value === '' ) return true;
					else return /(\.pdf|\.doc|\.docx|\.txt|\.odt|\.rtf)$$/i.test( this.value );
				}
			});

			// Custom validator - file type pdf doc
			regula.custom({
				name: 'Less2mb',
				defaultMessage: 'Files less than 2Mb required',
				validator: function() {
					this.style.color = (this.value=='') ? "rgba(0,0,0,0)" : "#293c98";
					if ( this.value === '' ) return true;
					else { return (this.files[0].size < 2097152); }//return /(\.pdf|\.doc|\.docx|\.txt|\.odt|\.rtf)$$/i.test( this.value );
				}
			});

			// Custom validator - selected radio
			regula.custom({
				name: 'Select',
				defaultMessage: 'You need to live in that area',
				validator: function() {
				return this.checked;
				}
			});

			

			for (var i = 0; i < elements.length; i++) {
				var o = $(elements[i]), v;
				o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
				v = o.parent().find(".form-validation");
				if (v.is(":last-child")) o.addClass("form-control-last-child");
			}

			elements.on('input change propertychange blur', function (e) {
				var $this = $(this), results;

				if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
				if ($this.parents('.rd-mailform').hasClass('success')) return;

				if (( results = $this.regula('validate') ).length) {
					for (i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}).regula('bind');

			var regularConstraintsMessages = [
				{
					type: regula.Constraint.Required,
					newMessage: (CN) ? "这个是必填项目" : "This field is required."
				},
				{
					type: regula.Constraint.Email,
					newMessage: (CN) ? "这个电子邮件地址是无效的" : "The email is not a valid email."
				},
				{
					type: regula.Constraint.Numeric,
					newMessage: "Only numbers are required"
				},
				{
					type: regula.Constraint.Selected,
					newMessage: (CN) ? "这个是必填项目" : "Please choose an option."
				}
			];


			for (var i = 0; i < regularConstraintsMessages.length; i++) {
				var regularConstraint = regularConstraintsMessages[i];

				regula.override({
					constraintType: regularConstraint.type,
					defaultMessage: regularConstraint.newMessage
				});
			}
		}


		/**
		 * @desc Validate google reCaptcha
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function validateReCaptcha(captcha) {
			var captchaToken = captcha.find('.g-recaptcha-response').val();

			if (captchaToken.length === 0) {
				captcha
					.siblings('.form-validation')
					.html('Please, prove that you are not robot.')
					.addClass('active');
				captcha
					.closest('.form-wrap')
					.addClass('has-error');

				captcha.on('propertychange', function () {
					var $this = $(this),
						captchaToken = $this.find('.g-recaptcha-response').val();

					if (captchaToken.length > 0) {
						$this
							.closest('.form-wrap')
							.removeClass('has-error');
						$this
							.siblings('.form-validation')
							.removeClass('active')
							.html('');
						$this.off('propertychange');
					}
				});

				return false;
			}

			return true;
		}

		/**
		 * @desc Initialize Google reCaptcha
		 */
		window.onloadCaptchaCallback = function () {
			for (var i = 0; i < plugins.captcha.length; i++) {
				var
					$captcha = $(plugins.captcha[i]),
					resizeHandler = (function() {
						var
							frame = this.querySelector( 'iframe' ),
							inner = this.firstElementChild,
							inner2 = inner.firstElementChild,
							containerRect = null,
							frameRect = null,
							scale = null;

						inner2.style.transform = '';
						inner.style.height = 'auto';
						inner.style.width = 'auto';

						containerRect = this.getBoundingClientRect();
						frameRect = frame.getBoundingClientRect();
						scale = containerRect.width/frameRect.width;

						if ( scale < 1 ) {
							inner2.style.transform = 'scale('+ scale +')';
							inner.style.height = ( frameRect.height * scale ) + 'px';
							inner.style.width = ( frameRect.width * scale ) + 'px';
						}
					}).bind( plugins.captcha[i] );

				grecaptcha.render(
					$captcha.attr('id'),
					{
						sitekey: $captcha.attr('data-sitekey'),
						size: $captcha.attr('data-size') ? $captcha.attr('data-size') : 'normal',
						theme: $captcha.attr('data-theme') ? $captcha.attr('data-theme') : 'light',
						callback: function () {
							$('.recaptcha').trigger('propertychange');
						}
					}
				);

				$captcha.after("<span class='form-validation'></span>");

				if ( plugins.captcha[i].hasAttribute( 'data-auto-size' ) ) {
					resizeHandler();
					window.addEventListener( 'resize', resizeHandler );
				}
			}
		};

		// Google ReCaptcha
		if (plugins.captcha.length) {
			$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
		}

		/**
		 * Page loader
		 * @description Enables Page loader
		 */
		if ( plugins.pageLoader.length > 0 ) {
			setTimeout( function () {
				plugins.pageLoader.addClass( "loaded" );
				$window.trigger( "resize" );
			}, 50 );
		}

		/**
		 * Is Mac os
		 * @description  add additional class on html if mac os.
		 */
		if ( navigator.platform.match( /(Mac)/i ) ) $html.addClass( "mac-os" );

		/**
		 * Is Safari
		 * @description  add additional class on html if mac os.
		 */
		if ( isSafari ) $html.addClass( "safari-browser" );

		// Adds some loosing functionality to IE browsers (IE Polyfills)
		if (isIE) {
			if (isIE === 12) $html.addClass("ie-edge");
			if (isIE === 11) $html.addClass("ie-11");
			if (isIE < 10) $html.addClass("lt-ie-10");
			if (isIE < 11) $html.addClass("ie-10");
		}

		/**
		 * Bootstrap Tooltips
		 * @description Activate Bootstrap Tooltips
		 */
		if ( plugins.bootstrapTooltip.length ) {
			var tooltipPlacement = plugins.bootstrapTooltip.attr( 'data-placement' );
			initBootstrapTooltip( tooltipPlacement );
			$( window ).on( 'resize orientationchange', function () {
				initBootstrapTooltip( tooltipPlacement );
			} )
		}

		// Add custom styling options for input[type="radio"]
		if (plugins.radio.length) {
			for (var i = 0; i < plugins.radio.length; i++) {
				$(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
			}
		}

		// Add custom styling options for input[type="checkbox"]
		if (plugins.checkbox.length) {
			for (var i = 0; i < plugins.checkbox.length; i++) {
				$(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
			}
		}

		/**
		 * UI To Top
		 * @description Enables ToTop Button
		 */
		if ( isDesktop && !isNoviBuilder ) {
			$().UItoTop( {
				easingType:     'easeOutQuart',
				containerClass: 'ui-to-top fa fa-angle-up'
			} );
		}

		// RD Navbar
		if ( plugins.rdNavbar.length ) {
			var
				navbar = plugins.rdNavbar,
				aliases = { '-': 0, '-sm-': 768, '-md-': 992, '-lg-': 1200 },
				responsive = {};

			for ( var alias in aliases ) {
				var link = responsive[ aliases[ alias ] ] = {};
				if ( navbar.attr( 'data'+ alias +'layout' ) )          link.layout        = navbar.attr( 'data'+ alias +'layout' );
				if ( navbar.attr( 'data'+ alias +'device-layout' ) )   link.deviceLayout  = navbar.attr( 'data'+ alias +'device-layout' );
				if ( navbar.attr( 'data'+ alias +'hover-on' ) )        link.focusOnHover  = navbar.attr( 'data'+ alias +'hover-on' ) === 'true';
				if ( navbar.attr( 'data'+ alias +'auto-height' ) )     link.autoHeight    = navbar.attr( 'data'+ alias +'auto-height' ) === 'true';
				if ( navbar.attr( 'data'+ alias +'stick-up-offset' ) ) link.stickUpOffset = navbar.attr( 'data'+ alias +'stick-up-offset' );
				if ( navbar.attr( 'data'+ alias +'stick-up' ) )        link.stickUp       = navbar.attr( 'data'+ alias +'stick-up' ) === 'true';
				if ( isNoviBuilder ) link.stickUp = false;
				else if ( navbar.attr( 'data'+ alias +'stick-up' ) )   link.stickUp       = navbar.attr( 'data'+ alias +'stick-up' ) === 'true';
			}

			plugins.rdNavbar.RDNavbar({
				anchorNav: !isNoviBuilder,
				stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
				responsive: responsive,
				callbacks: {
					onStuck: function () {
						var navbarSearch = this.$element.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
						}
					},
					onDropdownOver: function () {
						return !isNoviBuilder;
					},
					onUnstuck: function () {
						if (this.$clone === null)
							return;

						var navbarSearch = this.$clone.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
							navbarSearch.trigger('blur');
						}

					}
				}
			});
		}

		// Isotope
		if ( plugins.isotope.length ) {
			var isogroup = [];
			for ( var i = 0; i < plugins.isotope.length; i++ ) {
				var isotopeItem = plugins.isotope[ i ],
					isotopeInitAttrs = {
						itemSelector: '.isotope-item',
						layoutMode:   isotopeItem.getAttribute( 'data-isotope-layout' ) ? isotopeItem.getAttribute( 'data-isotope-layout' ) : 'masonry',
						filter:       '*'
					};

				if ( isotopeItem.getAttribute( 'data-column-width' ) ) {
					isotopeInitAttrs.masonry = {
						columnWidth: parseFloat( isotopeItem.getAttribute( 'data-column-width' ) )
					};
				} else if ( isotopeItem.getAttribute( 'data-column-class' ) ) {
					isotopeInitAttrs.masonry = {
						columnWidth: isotopeItem.getAttribute( 'data-column-class' )
					};
				}

				var iso = new Isotope( isotopeItem, isotopeInitAttrs );
				isogroup.push( iso );
			}


			setTimeout( function () {
				for ( var i = 0; i < isogroup.length; i++ ) {
					isogroup[ i ].element.className += " isotope--loaded";
					isogroup[ i ].layout();
				}
			}, 200 );

			var resizeTimout;

			$( "[data-isotope-filter]" ).on( "click", function ( e ) {
				e.preventDefault();
				var filter = $( this );
				clearTimeout( resizeTimout );
				filter.parents( ".isotope-filters" ).find( '.active' ).removeClass( "active" );
				filter.addClass( "active" );
				var iso = $( '.isotope[data-isotope-group="' + this.getAttribute( "data-isotope-group" ) + '"]' ),
					isotopeAttrs = {
						itemSelector: '.isotope-item',
						layoutMode:   iso.attr( 'data-isotope-layout' ) ? iso.attr( 'data-isotope-layout' ) : 'masonry',
						filter:       this.getAttribute( "data-isotope-filter" ) === '*' ? '*' : '[data-filter*="' + this.getAttribute( "data-isotope-filter" ) + '"]'
					};
				if ( iso.attr( 'data-column-width' ) ) {
					isotopeAttrs.masonry = {
						columnWidth: parseFloat( iso.attr( 'data-column-width' ) )
					};
				} else if ( iso.attr( 'data-column-class' ) ) {
					isotopeAttrs.masonry = {
						columnWidth: iso.attr( 'data-column-class' )
					};
				}
				iso.isotope( isotopeAttrs );
			} ).eq( 0 ).trigger( "click" )
		}

		/**
		 * WOW
		 * @description Enables Wow animation plugin
		 */
		if ( isDesktop && !isNoviBuilder && $html.hasClass( "wow-animation" ) && $( ".wow" ).length ) {
			new WOW().init();
		}

		/**
		 * Slick carousel
		 * @description  Enable Slick carousel plugin
		 */
		if ( plugins.slick.length ) {
			var i;
			for ( i = 0; i < plugins.slick.length; i++ ) {
				var $slickItem = $( plugins.slick[ i ] );

				$slickItem.on( 'init', function ( slick ) {
					initLightGallery( $( '[data-lightgallery="group-slick"]' ), 'lightGallery-in-carousel' );
					initLightGallery( $( '[data-lightgallery="item-slick"]' ), 'lightGallery-in-carousel' );
				} );

				$slickItem.slick( {
					slidesToScroll: parseInt( $slickItem.attr( 'data-slide-to-scroll' ) ) || 1,
					asNavFor:       $slickItem.attr( 'data-for' ) || false,
					dots:           $slickItem.attr( "data-dots" ) == "true",
					infinite:       isNoviBuilder ? false : $slickItem.attr( "data-loop" ) == "true",
					focusOnSelect:  false,
					arrows:         $slickItem.attr( "data-arrows" ) == "true",
					swipe:          $slickItem.attr( "data-swipe" ) == "true",
					autoplay:       isNoviBuilder ? false : $slickItem.attr( "data-autoplay" ) == "true",
					centerMode:     $slickItem.attr( "data-center-mode" ) == "true",
					centerPadding:  $slickItem.attr( "data-center-padding" ) ? $slickItem.attr( "data-center-padding" ) : '0.50',
					mobileFirst:    true,
					responsive:     [
						{
							breakpoint: 0,
							settings:   {
								slidesToShow: parseInt( $slickItem.attr( 'data-items' ) ) || 1,
								swipe:        $slickItem.attr( 'data-swipe' ) || false
							}
						},
						{
							breakpoint: 479,
							settings:   {
								slidesToShow: parseInt( $slickItem.attr( 'data-xs-items' ) ) || 1,
								swipe:        $slickItem.attr( 'data-xs-swipe' ) || false
							}
						},
						{
							breakpoint: 767,
							settings:   {
								slidesToShow: parseInt( $slickItem.attr( 'data-sm-items' ) ) || 1,
								swipe:        $slickItem.attr( 'data-sm-swipe' ) || false
							}
						},
						{
							breakpoint: 992,
							settings:   {
								slidesToShow: parseInt( $slickItem.attr( 'data-md-items' ) ) || 1,
								swipe:        $slickItem.attr( 'data-md-swipe' ) || false
							}
						},
						{
							breakpoint: 1200,
							settings:   {
								slidesToShow: parseInt( $slickItem.attr( 'data-lg-items' ) ) || 1,
								swipe:        $slickItem.attr( 'data-lg-swipe' ) || false
							}
						}
					]
				} )
					.on( 'afterChange', function ( event, slick, currentSlide, nextSlide ) {
						var $this = $( this ),
							childCarousel = $this.attr( 'data-child' );

						if ( childCarousel ) {
							$( childCarousel + ' .slick-slide' ).removeClass( 'slick-current' );
							$( childCarousel + ' .slick-slide' ).eq( currentSlide ).addClass( 'slick-current' );
						}
					} );
			}
		}

		$( '.slick-style-1' ).on( 'click', '.slick-slide', function ( e ) {
			e.stopPropagation();
			var index = $( this ).data( "slick-index" ),
				targetSlider = $( '.slick-style-1' );
			if ( targetSlider.slick( 'slickCurrentSlide' ) !== index ) {
				targetSlider.slick( 'slickGoTo', index );
			}
		} );

		// lightGallery
		if (plugins.lightGallery.length) {
			for (var i = 0; i < plugins.lightGallery.length; i++) {
				initLightGallery(plugins.lightGallery[i]);
			}
		}

		// lightGallery item
		if (plugins.lightGalleryItem.length) {
			// Filter carousel items
			var notCarouselItems = [];

			for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
				if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
					!$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
					!$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
					notCarouselItems.push(plugins.lightGalleryItem[z]);
				}
			}

			plugins.lightGalleryItem = notCarouselItems;

			for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
				initLightGalleryItem(plugins.lightGalleryItem[i]);
			}
		}

		// Dynamic lightGallery
		if (plugins.lightDynamicGalleryItem.length) {
			for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
				initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
			}
		}

		// Owl carousel
		if ( plugins.owl.length ) {
			for ( var i = 0; i < plugins.owl.length; i++ ) {
				var c = $( plugins.owl[ i ] );
				plugins.owl[ i ].owl = c;

				initOwlCarousel( c );
			}
		}

		/**
		 * RD Input Label
		 * @description Enables RD Input Label Plugin
		 */
		if ( plugins.rdInputLabel.length ) {
			plugins.rdInputLabel.RDInputLabel();
		}

		/**
		 * Regula
		 * @description Enables Regula plugin
		 */
		if ( plugins.regula.length ) {
			attachFormValidator( plugins.regula );
		}

		// RD Mailform
		if (plugins.rdMailForm.length) {
			var i, j, k,
				msg = {
					'MF000': 'Successfully sent!',
					'MF001': 'Recipients are not set!',
					'MF002': 'Form will not work locally!',
					'MF003': 'Please, define email field in your form!',
					'MF004': 'Please, define type of your form!',
					'MF254': 'Something went wrong with PHPMailer!',
					'MF255': 'Aw, snap! Something went wrong.'
				};

			for (i = 0; i < plugins.rdMailForm.length; i++) {
				var $form = $(plugins.rdMailForm[i]),
					formHasCaptcha = false;

				$form.attr('novalidate', 'novalidate').ajaxForm({
					data: {
						"form-type": $form.attr("data-form-type") || "contact",
						"counter": i
					},
					beforeSubmit: function (arr, $form, options) {

						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
							inputs = form.find("[data-constraints]"),
							output = $("#" + form.attr("data-form-output")),
							captcha = form.find('.recaptcha'),
							captchaFlag = true;

						output.removeClass("active error success");

						if (isValidated(inputs, captcha)) {

							// veify reCaptcha
							if (captcha.length) {
								var captchaToken = captcha.find('.g-recaptcha-response').val(),
									captchaMsg = {
										'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
										'CPT002': 'Something wrong with google reCaptcha'
									};

								formHasCaptcha = true;

								$.ajax({
									method: "POST",
									url: "bat/reCaptcha.php",
									data: {'g-recaptcha-response': captchaToken},
									async: false
								})
									.done(function (responceCode) {
										if (responceCode !== 'CPT000') {
											if (output.hasClass("snackbars")) {
												output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

												setTimeout(function () {
													output.removeClass("active");
												}, 3500);

												captchaFlag = false;
											} else {
												output.html(captchaMsg[responceCode]);
											}

											output.addClass("active");
										}
									});
							}

							if (!captchaFlag) {
								return false;
							}

							form.addClass('form-in-process');

							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
								output.addClass("active");
							}

							sendMail();

						} else {
							return false;
						}
					},
					error: function (result) {
						return; // is now handled by sendMail function
						if (isNoviBuilder)
							return;

						var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
							form = $(plugins.rdMailForm[this.extraData.counter]);

						output.text(msg[result]);
						form.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}
					},
					success: function (result) {
						return; // is now handled by sendMail function

						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
							output = $("#" + form.attr("data-form-output")),
							select = form.find('select');

						form
							.addClass('success')
							.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}

						result = result.length === 5 ? result : 'MF255';
						output.text(msg[result]);

						if (result === "MF000") {
							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active success");
							}
						} else {
							if (output.hasClass("snackbars")) {
								output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active error");
							}
						}

						form.clearForm();

						if (select.length) {
							select.select2("val", "");
						}

						form.find('input, textarea').trigger('blur');

						setTimeout(function () {
							output.removeClass("active error success");
							form.removeClass('success');
						}, 3500);
					}
				});
			}
		}

		/**
		 * jQuery Count To
		 * @description Enables Count To plugin
		 */
		if ( plugins.counter.length ) {
			var i;

			for ( i = 0; i < plugins.counter.length; i++ ) {
				var $counterNotAnimated = $( plugins.counter[ i ] ).not( '.animated' );
				$document
					.on( "scroll", $.proxy( function () {
						var $this = this;

						if ( (!$this.hasClass( "animated" )) && (isScrolledIntoView( $this )) ) {
							$this.countTo( {
								refreshInterval: 40,
								from:            0,
								to:              parseInt( $this.text(), 10 ),
								speed:           $this.attr( "data-speed" ) || 1000,
								formatter:       function ( value, options ) {
									if ( $this.attr( 'data-zero' ) == 'true' ) {
										value = value.toFixed( options.decimals );
										if ( value < 10 ) {
											return '0' + value;
										}
										return value;
									} else {
										return value.toFixed( options.decimals );
									}
								}
							} );
							$this.addClass( 'animated' );
						}
					}, $counterNotAnimated ) )
					.trigger( "scroll" );
			}
		}

		/**
		 * Bootstrap Date time picker
		 */
		if ( plugins.bootstrapDateTimePicker.length ) {
			var i;
			for ( i = 0; i < plugins.bootstrapDateTimePicker.length; i++ ) {
				var $dateTimePicker = $( plugins.bootstrapDateTimePicker[ i ] );
				var options = {};

				options[ 'format' ] = 'dddd DD MMMM YYYY - HH:mm';
				if ( $dateTimePicker.attr( "data-time-picker" ) == "date" ) {
					options[ 'format' ] = 'dddd DD MMMM YYYY';
					options[ 'minDate' ] = new Date();
				} else if ( $dateTimePicker.attr( "data-time-picker" ) == "time" ) {
					options[ 'format' ] = 'HH:mm';
				}

				options[ "time" ] = ($dateTimePicker.attr( "data-time-picker" ) != "date");
				options[ "date" ] = ($dateTimePicker.attr( "data-time-picker" ) != "time");
				options[ "shortTime" ] = true;

				$dateTimePicker.bootstrapMaterialDatePicker( options );
			}
		}

		// Copyright Year (Evaluates correct copyright year)
		if ( plugins.copyrightYear.length ) {
			plugins.copyrightYear.text( initialDate.getFullYear() );
		}

	} );
}());


		/**
		 * @desc Check if all elements pass validation
		 * @param {object} elements - object of items for validation
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function isValidated(elements, captcha) {
			var results, errors = 0;

			if (elements.length) {
				for (var j = 0; j < elements.length; j++) {

					var $input = $(elements[j]);
					if ((results = $input.regula('validate')).length) {
						for (k = 0; k < results.length; k++) {
							errors++;
							$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
						}
					} else {
						$input.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (captcha) {
					if (captcha.length) {
						return validateReCaptcha(captcha) && errors === 0
					}
				}

				return errors === 0;
			}
			return true;
		}



$('.careers-position-title').each(function() {
	var option = document.createElement("option");
	option.text = $(this).text();
	option.value = $(this).text();
	document.getElementById('contact-position').add(option);
});

$('.careers-positions-list').on('click',function() { 
	var x = document.getElementById('contact-position');
	x.selectedIndex = $(this).index()+1;
	x.scrollIntoView();
	x.dispatchEvent(new Event('focus'));
	x.dispatchEvent(new Event('change'));
	return false;
});

var display = parseInt($(".post-item").length-$(".hide").length); 
var step = parseInt($("#news-items").attr('data-step'));

$("#load-more").on('click',function(){
	$(".post-item").each(function(index) {
		if (index<display+step)
		{
			if (index>=display) 
			{
				$(this).attr("data-wow-delay",(0.15*(index-display))+"s");
				$(this).removeClass('hide');
			}
		} 

		window.scroll(0,window.scrollY+1); //scrolling is necessary to trigger animation start
		if ((display+step)>=$(".post-item").length) $("#load-more").addClass('hide');
	});
	display += step;
});

function smartBack(e) {
	if ((document.referrer==e.target) && (history.length>1)) {
		e.preventDefault();
		e.stopPropagation();
		history.back();
	  }

}

function shareLinks() {	$("#sharer-block a").each(function(){
	var url = window.location.href;
	var link_url = $(this).get(0).href;
	url = url.substring(0,url.lastIndexOf('#'));
	$(this).get(0).href = link_url.substring(0,link_url.lastIndexOf("?")+1) + url + ( (referral_code) ? "#"+referral_code: "" );
});}


function getBase64(file,maildata) {

	//maildata["attachments"] = {
	//	"filename" : file.name,
	//	"id" : file.name,
	//	"content" : ""
	//}
	maildata["attachment"] = [{
		"content" : "",
		"name" : file.name
	}];
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function () {
		//maildata["attachments"]["content"] = reader.result,
		maildata["attachment"][0]["content"] = reader.result.split(',').pop();
		cUrl_request(maildata);
	};
	reader.onerror = function (error) {
		return null;
	};
 }

function sendMail()
{
	//var templates = { 'contact' : 'k68zxl275k94j905', 'position' : '0r83ql3p89pgzw1j' };
	var templates = { 'contact' : 1, 'position' : 2, 'investor' : 1 };
	var receiver = { 'contact' : 'contact@alef.aero', 'position' : 'jobs@alef.aero', 'investor' : 'investor@alef.aero' };
	var formtype = $(".rd-mailform").attr('data-form-type'); 
	var formdata = {};

	if (formtype == "order") { 
		formdata['date'] = fullDate(new Date());
		//var url = "?";
		//url += "date=" + encodeURIComponent(fullDate(new Date()));
	}

	$(".form-input").each(function(index) {
		formdata[String($(this).attr('name'))] = $(this).attr('value');
		//if (formtype == "order") url += "&" + String($(this).attr('name')) + "=" + encodeURIComponent($(this).attr('value'));
	});

	formdata['page'] = curPage;
	formdata['url'] =  window.location.href;

	var maildata = {
		//"from": {
		"sender": {
			"email": "robot@alef.aero",
			"name": "Alef Robot"
		},
		"to": [
			{
				"email": receiver[formtype]				
			}
		],
//		"personalization": [{
//			"email": "khandro.an@gmail.com",
//			"data": { formdata }
//		}],
//		"template_id": templates[formtype]
		"templateId":templates[formtype],
		"params": formdata,
		"headers":{  
			"X-Mailin-custom":"custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3",
			"charset":"iso-8859-1"}
	};

	if (formtype=="position")
	{
		getBase64(document.getElementById("contact-resume").files[0],maildata);
	}	
	else { cUrl_request(maildata); }
}


function confirmOrder(orderdata)
{
	var certificate = "https://louthbra.sirv.com/Images/certificate.jpg?text.size=15&text.color=000000&text.position.gravity=north&text.position.x=26.3%&text.position.y=24.5%&text=";
	certificate += orderdata['order_number'];

	var maildata = {
		"sender": {
			"email": "ceo@alef.aero",
			"name": "Jim Dukhovny"
		},
		"to": [
			{
				"email": orderdata['email']		
			}
		],
		"templateId":3,
		"params": orderdata,
		"headers":{  
			"X-Mailin-custom":"custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3",
			"charset":"iso-8859-1"},
		"attachment": [ 
			{
				"url" : certificate,
				"name" : "alef_certificate.jpg"
			}
		]
	};

	cUrl_request(maildata);

}


function collectData()
{
	var formdata = {};
	formdata['date'] = fullDate(new Date());
	$(".form-input").each(function(index) {
		formdata[String($(this).attr('name'))] = $(this).attr('value');
	});
	return formdata;
}


const crypt = (text) => {
	const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
	const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
	const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  
	return text
	  .split("")
	  .map(textToChars)
	  .map(applySaltToChar)
	  .map(byteHex)
	  .join("");
  };

const decrypt = (encoded) => {
	const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
	const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
	return encoded
	  .match(/.{1,2}/g)
	  .map((hex) => parseInt(hex, 16))
	  .map(applySaltToChar)
	  .map((charCode) => String.fromCharCode(charCode))
	  .join("");
  };

function cUrl_request(maildata) {
	let token = "61727c606a707b342a7b287d7f287a207f7c2e2c7d7d2c2c7b2d7d2f2c2d282a2b2e2021202f7b2c2c7b7a78287b2c78282c20782c7b2f7f287c297b2e202d2f2f7c2b2a782e2b2d344a775d405e7e52494b504c28202d617b";//"61727c606a707b3429292b2d20787f2e2e2f2f2d2d212d7a2a7b217f2f7f7c7c2c297f7f7b2a2c2a282c7c2a7a28202a20282f2b207a2c282d2e2f292f2d782c2e2e2c2d7b2d7b2c344d284f214e6f7f52745e72415a5d6877";
	let post = JSON.stringify(maildata);
 
//	const url = "https://api.mailersend.com/v1/email";
	const url = "https://api.sendinblue.com/v3/smtp/email";

	let xhr = new XMLHttpRequest();
 
	xhr.open('POST', url, true);
	//xhr.setRequestHeader('Authorization', 'Bearer '+token);
	xhr.setRequestHeader('accept', 'application/json');
	xhr.setRequestHeader('api-key', decrypt(token));
	xhr.setRequestHeader('content-type', 'application/json');
 
	xhr.onload = function () { formClear(xhr.status,201,"Mail sent!");}
	xhr.onerror = function () {
		log_data['data'] = "Mailsend error: " + post;
		aeLog(log_data);
	  };

	xhr.send(post);
}

function fullDate(now) {
	var result = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
	return result;
	//return now.getFullYear() + "/" + String(now.getMonth()+1).padStart(2,"0") + "/" + String(now.getDate()).padStart(2,"0") + " " + now.getHours().padStart(2,"0") + ":" + now.getMinutes().padStart(2,"0");
}

function updateSheets(/*dataurl,*/formdata) {
	//delete formdata['url'];
	//delete formdata['page'];
	var g_url = "https://script.google.com/macros/s/AKfycby8F7eb6BmJTSITGwWR2hDg7bQghiPGZ-ujoPMOA4NGBosLfmNtMSDfSgdL8SIDiOcB9Q/exec";
	formdata['user_ip'] = user_ip;

	/* just in case request won't be working anymore 
	var iframe = document.createElement('iframe');
	iframe.onload = function() { formClear(true,true,"Order sent!"); }; //there's no access to what the message is so we assume it's successful
	iframe.style = "visibility: hidden; position: absolute; top: 0; left: 0; width: 1px; height: 1px;";
	iframe.src = g_url + dataurl; 
	document.body.appendChild(iframe);
	// iframe displays 403 but spreadsheet is nevertheless updated
	*/

	var xhr = $.ajax({
		url: g_url,
		method: "GET",
		type: "GET",
		dataType: "json",
		data: formdata
	  }).success(
		  function () { console.log("list updated");}
	  ).error (
		function (xhrresponse) { 
			log_data['data'] = "Google sheets error: " + JSON.stringify(xhrresponse) + JSON.stringify(formdata); 
			aeLog(log_data);
		}
	  );

}

function checkAmount(amount) {
	var choice = $('.form-check-input[name="advance"]:checked').attr('data-choice');
	var return_amount = (choice=='priority') ? 1500 : discount.getPrice();
	if (amount!=return_amount) {
		$("#contact-advance").attr('value',return_amount);
		log_data['data'] = "Price mismatch detected and fixed";
		aeLog(log_data);
	}
	return return_amount;
}

function formClear(status,required,success_message,reset=true) {
	var form = $(".rd-mailform"),
		output = $("#" + form.attr("data-form-output"));

    	if(status==required) {
			var cls = "success", msg = success_message, icon = "mdi-check";
		}
		else {
			var cls = "error", msg = "Something went wrong: "+String(status), icon = "mdi-alert-outline";
		}

		form
		.addClass(cls)
		.removeClass('form-in-process');

		if (reset) form.trigger('reset');


		output.text(msg);

		if (output.hasClass("snackbars")) {
			output.html('<p><span class="icon text-middle mdi '+icon+' icon-xxs"></span><span>' + msg + '</span></p>');
			} 
		else {
				output.addClass("active "+cls);
			}

		setTimeout(function () {
			output.removeClass("active");
		}, 3500);

}

function thankYou(order_number, order_name)
{
	document.getElementById('order-number').innerHTML = order_number;
	document.getElementById('referral-number').innerHTML = referral_number;
	document.getElementById('referral-link').value += order_number;
	//document.getElementById('order-customer').innerHTML = order_name;
	document.getElementById("order-block").style = "display: none";
	document.getElementById("thank-you").style = "display: block";
	document.getElementById('thank-you').scrollIntoView();
	window.scroll(0,window.scrollY+1);
}

function showForm() {
	var startpoint = window.scrollY; //keep the scroll offset for the user
	document.getElementById('order-button').style.display = 'none'; 
	document.getElementById('order-form').style.display = 'block'; 
	//document.getElementById('contact-name').scrollIntoView();
	//scrolling exactly to the end of the form layer
	var endpoint = document.getElementById("first-block").scrollHeight-window.innerHeight-42; // must calculate after the layer is made visible
	if (window.scrollY < endpoint ) window.scroll(0,endpoint+startpoint); 
	else window.scroll(0,window.scrollY+1);
	setTimeout( bgBehavior, 100 );
	setTimeout( bgBehavior, 300 );
	//bgBehavior();
	//document.getElementById("page-body").style = "background-size: cover;";
}

window.addEventListener('load', shareLinks);
$('.round').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
	//$('.arrow').toggleClass('bounceAlpha');
	const list =   $('.round');   //all containers
   const index =  list.index($(this));  //current container
   const target = (index + 1) % list.length;    //increment with wrap
   $('.arrow-toggler')[target].scrollIntoView();
});


function aeLog(data) {
	var xhr = $.ajax({
		url: 'https://alef.ae-collective.com/log.php',
		method: "GET",
		type: "GET",
		dataType: "json",
		data: data
	  }).setRequestHeader( 'referer', 'https://alef.aero' )
	  .success(
		  function(response) { 
			console.log("ae logged"); 
		}
	  ).error (
		function(response) { 
			console.log('ae logged');
		}
	  );
}

var log_data = { 'date' : new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}) };
var user_ip = "";
$.getJSON("https://api.ipify.org?format=json", function(data) {	user_ip = data.ip;});


$(".preorder-input, .preorder").each(function(){
	$(this).on('click',function(e){
		var amount = ($(this).attr('data-choice')=='priority') ? 1500 : discount.getPrice();
		$(".order-form").find("h3")[ (amount>150) ? 1 : 0].style = "font-weight: bold;";
		$(".order-form").find("h3")[ (amount>150) ? 0 : 1].style = "font-weight: normal;";
		var choice = (amount>150) ? ( (CN) ? "优先" : "Priority Queue" ) : ( (CN) ? "普通" : "General Queue");
		$("#order-label").text(choice); 
		$("#contact-advance").attr('value', amount);
	});
})

$(".preorder").each(function(){
	$(this).on('click',function(e){
		var choice = $(this).attr('data-choice');
		$(".form-check-input[data-choice='"+choice+"']").attr('checked',true);
	});
})