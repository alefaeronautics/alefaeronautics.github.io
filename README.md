# Alef.aero Frontent Website

A public repository with static HTML pages and Javascript to be hosted on GitHub as serve as Alef.aero website.

## Components

### 1. CSS stylesheet files (`/css/`)

This directory contains all the stylesheets used throughout the website.

- **bootstrap.css**
  - **URL:** `/css/bootstrap.css`
  - **Contains:**
    - This stylesheet came with the original bootstrap template and hasn't been modified or cleaned. Potentially contains a lot of redundant styles. The base layout used is 12 column size-sensitive. See comments inside of the file for more information.

- **style.css**
  - **URL:** `/css/style.css`
  - **Contains:**
    - This stylesheet is an extention of the base bootstrap layout and have been modified as necessary to achive the Alef style outlook. See comments inside of the file for more information. Custom additional styles are mainly in the end of the stylesheet.

- **checkout.css**
  - **URL:** `/css/checkout.css`
  - **Contains:**
    - A small collection styles developed for preorder page particularly. Potentially some of the styles from style.css could be moved here to improve loading time.


### 2. Document files (`/documents/`)

Pdf files for Alef Preorder Agreement, Website Privacy Policy and Website terms of use.

### 3. Font files (`/fonts/`)

A collection of different font files required by the website, mostly different kinds of icons. The main is FontAwesome collection, plus some Material Design Icons, plus Symbola for mobile compartibility. Main text uses K2D font and some headers use XSpace (see `@font-face` defitions in `style.css`).

### 4. Image files (`/images/`)

- **root**
 - UX related images.

- **`/images/news/`**
 - Custom background for news links. See `press.html` info on how to add them.

- **`/images/preorder/`**
 - Car renders used on `Preorder` page.

- **`/images/story/`**
 - Photographs and images used on `Story` page.

### 5. Files to be included throughout different pages (`/includes/`)

Repeated blocks of HTML code which are used throughout the pages of the whole site are loaded programmatically from external files to allow easy update.

- **`/includes/endblock.html`**
 - Linksharer block for news pages hosted on Alef.aero + special `go back` link to improve UX. Since news items are loaded programmatically, it's necessary to use history.back() when the user is coming from news page and wants to go back to make sure he gets the page in the same state with all the items loaded. 

- **`/includes/footer.html`**
 - Footer contents for all the pages with social networks links and general info.

### 6. Javascript files (`/js/`)

The website relies on Javascript heavily for its functionality is not available when JS is disabled. Frameworks used are Vanilla JS and JQuery.

- **`/js/core.min.js`**
 - Compressed version of JQuery, must be included before all the other scripts on the page unless only Vanilla JS is used.

- **`/js/script.js`**
 - Main Javascript file which initializes and plugins, functions and variables used throughout the whole website. Plugins available are:
    - **`bootstrapTooltip`**
     - Tooltips (currently not in use)
    - **`copyrightYear`**
     - Used to dynamically replace the copyright year to the current year
    - **`rdNavbar`**
     - Dynamic stick up navbar
    - **`materialParallax`**
     - Parallax effect for backgrounds
    - **`rdMailForm`**
     - Form validation and submit handling (used partially with modifications)
    - **`rdInputLabel`**
     - Form field labels
    - **`regula`**
     - Form validation rules with support for customization. Pre-defined rules in use are `@Required` for non-empty field, `@Email` for email address and `@Selected` for dropdowns. See documendation for "Regula" annotation-based form-validation on GitHub for more predefined rules. The custom rules which have been defined are:
         - **`@PhoneNumber`**
          - Checks if the field value is a valid form number and if not returns `Invalid phone number format` message. This custom rule was provided by the original template.
         - **`@PResume`**
          - Checks if file type chosen is acceptable (PDF,DOC,DOCX,ODT,RTF,TXT). If not returns `Unacceptable file type (PDF,DOC,DOCX,ODT,RTF,TXT required)` message.
         - **`@Less2mb`**
          - Checks if the file size is less than 2mb and if not returns `Files less than 2Mb required` message.
         - **`@Base64`**
          - Checks if the process of converting the file data into Base64 format has been completed and if not returns `Please wait, the file is processed` message. Has a setTimeout loop which keeps triggering `blur` event (that the validator is attached to) so that the field could become validated automatically and the message would disapper, without requiring the user to click anything.
         - **`@Select`**
          - Attached to radio element that needs to be selected, and if not returns `You need to live in this area` message. This custom rule was defined for `Careers` form specifically.
    - **`owl`**
     - Owl carousel (currently not in use)
    - **`isotope`**
     - Owl carousel (currently not in use)
    - **`radio`**
     - Custom radio buttons (partially in use, CSS has been redefined)
    - **`checkbox`**
     - Custom checkbox elements (partially in use, CSS has been redefined)
    - **`counter`**
     - ? Not sure what exactly (currently not in use)
    - **`pageLoader`**
     - Page loader (partially in use, visual loader elements have been removed)
    - **`captcha`**
     - Support for Google Captcha (currently not in use)
    - **`lightGallery`**
    - **`lightGalleryItem`**
    - **`lightDynamicGalleryItem`**
     - Light Gallery image viewer (currently not in use)
    - **`bootstrapDateTimePicker`**
     - Date and time picker field (currently not in use)
    - **`slick`**
     - Slick slider (currently not in use)

 - Custom functions are:
    - **`smartBack`**
     - Special go back function (see info on `/includes/endblock.html`)
    - **`shareLinks`**
     - When there is a block with icons for page URL sharing, the links are created dynamically by this function
    - **careers page specific**
     - **`.careers-position-title` attached**
      - Dynamically creates the dropdown list with names of positions from `careers-position-title` elements
     - **`.careers-positions-list` attached `click` event**
      - Scrolls down to the form and selects the position clicked from the dropdown. Dispatches `focus` and `change` events for the labels to be displayed properly.
     - **`#contact-file` attached `change` and `propertychange` events**
      - Mail API requires file in base64 format. The converting is done on the frontend as the actual file is selected by the user. File name and content are saved into hidden fields. As the form submit is handled by ajaxForm (see inside `script.js` and `rdMailForm` plugin), the actual file field is disabled to avoid submitting the same data twice and enabled back again when the form is reset.
    - **news page specific**
     - "Load more" button (`#load-more`) functionality for news elements (`.post-item`).
    - **preorder page specific**
     - **`collectData`**
      - Collects and returns data from the form also adding the "date" key via `fullDate`.
     - **`fullDate`**
      - Gets current date and time in particular form
     - **`thankYou` attached**
      - Old and currently unused version of displaying the succesful preorder info.
     - **`thankYouNew`**
      - Fills all the necessary elements in the success layer (`#thank-you`) with the preorder data (order number, customer name, etc), sets the CSS for display and triggers `scroll` event to activate the animation.
     - **`processOrder`**
      - This function is called as the form is validated and submitted by ajaxForm (see inside `script.js` and `rdMailForm` plugin) and "data-form-type" is "order" (corresponds to `Preorder` page). It fades the inactive choice to avoid payment amount confusion and callse `createClientAE` to create or display the payment form.
     - **`.preorder-input` attached**
      - Activates either General or Priority queue option based on `data-choice` attribute. Fills the hidden field with corresponding price amount and logs "Change/Click event" with `aeLog`. Depending on the choice, the text is changed in the `#order-label` element.
     - **`.preorder` attached**
      - Another layer of additional checks to make sure the General/Priority queue choice is recognized by all the browsers.
     - **`#payment-close` attached `click` event**
      - Hides the payment form and displays the preorder form.
     - **`#contact-country` attached `change` and `propertychange` events**
      - Checks if `data-link` of the selected dropdown option is a valid dictionary key in `alert_countries` and if so then uses its value to display the info message suggesting the user to switch to another language page. Currently only Chineese (`cn` key) is used. 
    - **`aeLog`**
     - Logging service used throughout the website. Calls to PHP page on `alef.ae-collective.com` and records the special event from the page along with time of the event and user IP. See particular pages for more info about which events are logged.

- **`/js/menu.js`**
 - To avoid having to edit multiple HTML files menu is initialized programmatically and loaded into `rd-navbar-nav` layer. `menu` variable is an array of dictionaries which must be structured as follows:
    - **`url`**
     - Address of the page
    - **`title`**
     - Title of the page as it appears on the menu. HTML is accepted
    - **`class`**
     - An array of names of addictionall classes to attach to the menu item

- **`/js/paypal.js`**
 - PayPal SDK functionality from previous frontend only version of the website. Contains broken dependencies, should not be initialized, could be removed potentially.

- **`/js/preorder.js`**
 - Non payment related functions used on `Preorder` page only. They are:
    - **`.round` attached**
     - Hopping from a block to block with animated arrows. Animation is done with CSS and page scrolling is JS based.
    - **`bgBehavior`**
     - The first block has a fixed background but as the user scrolls the page and moves out of the block the background is unfixed and scrolls away programmatically. After many trials and errors this was devised as the most smooth solution.
    - **page browse logging based on `IntersectionObserver`**
     - Logs when the user scrolls away from the order form and/or returns to it. Initially was developed to log each block browse separately but it overwhelmed the log and was cut back to these events only.

- **`/js/refer.js`**
 - Discount codes and referrals functionality. It is a contant object to avoid user tampering with preorder price. The script gets the referral code from the url (either preceeded by # or as a GET variable), calls `referral` service on backend via creating a dynamic script element which only contains `ocean_value` constant. Until that value becomes available, the default value of `150` is used and loading element is displayed near preorder price. For more info see `referral` info in the backend repository.

- **`/js/checkout.js`**
 - Stripe checkout and display order status functionality. Consists of 2 parts: 1. creating, capturing and submitting the payment which finally 2. opens the same `Preorder` page with GET variables necessary to retreive the payment info, retreives the payment info and displays all kinds of messages depending or payment status.

    - **`createClient`**
     - Previous version of creating a new payment, currently not in use
    - **`createClientAE`**
     - Collects data from the form, checks if payment amount is correct via `checkAmount` function. If the payment form has been initialized and loaded previously and variables `currentAmount` and `emailAddress` are equal to values inferred from the current state of the form then it just displays the payment form. If not or these crucial values have been changed, then the function initializes the new payment form and payment intent with `initialize` function and logs "Payment request created" with the current form data via `aeLog` function. This check helps UX in case the client has closed the form and then wishes to reopen without changing the queue type or email address.
    - **`initialize`**
     - Initializes the new Stripe payment intent via a backend call to `stripe` app. If succesfull, it configures and displays the payment form via `displayStripe` function. If not, the error is logged via `aeLog`.
    - **`displayStripe`**
     - Creating and mounting the payment form with existing `clientSecret` and `emailAddress` values. The following events are monitored:
        - **linkAuthenticationElement `change`**
         - If the client changes email address in the payment form from the address used previously to initialize the form.
        - **paymentElement `change`**
         - This event may signify typing in payment info but may also be clicking on anything inside the payment form. "Type in payment info" is logged via `aeLog` function.
        - **paymentElement `ready`**
         - Once the payment form has finished loading all the CSS loaders are removed and "Payment form loaded" is logged via `aeLog` function.
    - **`handleSubmit`**
     - Handles submit of the payment form. `setLoading` sets form state to loading, form data is collected via `collectData` from `script.js` (Preorder page specific functions) and passed to success page (which is the same preorder page) via GET variables. In case of error, they are displayed via `showMessage` and logged via `aeLog`. The form is set to available via `setLoading` function.
    - **`checkStatusOcean`**
     - The main function which processes the submitted payment and checks its status. Data is extracted from GET via `extractData` and submitted to backend `/preorder/` gateway to obtain `result` dictionary which is processed key by key. Keys are as follows:
        - **`css`**
         - A predefined class (either in `style.css` or on the page directly in case of Chinese) to be applied to the result layer. In the loading state these classes show particular messages, in the loaded state formatting is changed if the payment has been refunded or disputed.
        - **`content`**
         - If not empty fills the result layer with order related data and calls on `thankYouNew` and `shareLinks` (from `script.js`) to display the data and format share links with the proper referral.
        - **`message`**
         - If not empty calls `showMessage` with the given message
        - **`form`**
         - If not empty fills the form with given data via `fillForm` function and displays it with 1 second delay via `showFilledForm` function. The delay is necessary for labels to be displayed properly. 
        - **`repeat`**
         - If true sets timeout to check the payment status after a delay (returned when the payment status is "Processing")
        - **`ae`**
         - An array of log messages to be logged via `aeLog`.
        - **`maildata`**
         - If not empty then attaches `click` event to "Resend mail" button which resends the order confirmation email on click and logs "Mail resend success" or "Mail resend error" via `aeLog`. If resend is successful the button is disabled.
    - **`showMessage`**
     - Shows given message at the bottom of the form for 20 seconds
    - **`setLoading`**
     - Sets the form into either loading or available state by either disabling or enabling the submit button and changing the button text either to a spinner or back to the default.
    - **`fillForm`**
     - Tries to fill the form fields with data obtained from GET variables (available when the payment was submitted and the page was redirected). To make sure labels are displayed properly `focus` and `change` events are dispatched in case the data is valid. If `clientSecret` is available also tries to retrieve the existing payment intent from it and preload the payment form via `displayStripe` while logging "Payment request retrieved" with `aeLog`.
    - **`showFilledForm`**
     - Displays the filled form and activates the animations by dispatching `scroll` event.
    - **`extractData`**
     - Extracts all the GET variables from URL and returns the dictionary where keys are variable names and values are their values respectively.

### 7. HTML files (`/`)

To add new menu items see `/js/menu.js`. To modify footer content see `/includes/footer.html`. 

- **`/index.html`**
 - Home page. No log events are attached to this page. 

- **`/_*.html`**
 - Various old versions of pages, mostly `Preorder` page, likely to contain many broken dependencies. Potentially could all be removed. Underscode (`_`) before the name indicates for GitHub that the file is hidden and therefore is not to be displayed on Alef.aero.

- **`/contact.html`**
 - The form is submitted to backend directly after validation and processing via ajaxForm. `data-form-type` attribute is set to `contact` which routes it to the contact email. See backend documentation for more info. Success and errors (both validation and mail) errors are logged via `aeLog` along with the page name.  

- **`/investors.html`**
 - The form is submitted to backend directly after validation and processing via ajaxForm. `data-form-type` attribute is set to `investor` which routes it to the investor email. See backend documentation for more info. Success and errors (both validation and mail) errors are logged via `aeLog` along with the page name. 

- **`/press.html`**
 - **news links**
  - To add a new news link, copy div with `class="cell-sm-12 cell-md-6 post-item wow fadeInLeftSmall"` and change the elements inside as necessary. To add a custom hover image (like that of Time magazine) follow these steps:
   1. Prepare an image and put it inside `\images\news\` follder.
   2. Copy `.post-boxed.time:hover` style from `\css\style.css`, give it a new name instead of `.time` and replace `url()` property with the new image URL
   3. Find an element (`article`) with class of `post-boxed` inside the news div and add a new class to it.
  - To hide a news link, add `hide` class to the div which has `post-item` class. Please make sure that all the visible items come first and all the hidden ones come after with no mixing. The script may malfunction otherwise.
  - To change the amount of articles that are loaded when `Load more news` button is pressed, look for `data-step` attribute inside `id="news-items"` element and adjust it as necessary. 
 - **presskit link**
   - Is a simple link to Google drive in the format `https://drive.google.com/u/0/uc?id=GOOGLE_DRIVE_ID&export=download&confirm=t`. Replace `GOOGLE_DRIVE_ID` with the necessary ID. `export=download&confirm=t` try to enforce the direct download of the file instead of opening actual Google Drive.

- **`/story.html`**
 - The formatting is done using 12 cell bootstrap layout (`cell-sm-# cell-md-# cell-lg-#` etc). `text-image` class when applied to the parent element makes the image (`img` element) toned and the text (`p` element) styled as copyright. Years must have `fadeInLeft` animation, and the content must have `fadeInLeftSmall`. In case of more than 2 elements, set the delays manually by adding `data-wow-delay` property.

- **`/preorder.html`**
 - **visual flow**
   - User is presented with the main block containing the preorder form. 
   - Once scrolled to the end of the block, arrows appear and user can jump between blocks with the car description (see `.round`, `bgBehavior`)
   - If a country with own language page (see `#contact-country`, `alert_countries`) is selected, an info message with a link is shown
   - Once the filled and validated form is submitted, the payment form is displayed in the loading state
   - As the payment forms finishes loading, the user can proceed with the payment information
   - Some payment errors will display an immidiate error message, and some will be redirected to the `success` page (the same `Preorder` page but with variables in the URL) which will then show a prefilled order form and preload the payment form
   - If the payment status is successful and the payment hasn't been disputed or refunded, order confirmation and thank you message will be displayed
   - User will be able to resend the order confirmation email by clicking the "resend" button on the page
   - If the payment has been disputed or refunded (in case of repeated visits to the same page) the refunded order status info will be displayed
 - **script flow**
   - Language (`CN`) and log (`log_data`) variables are initialized
   - Set `tester` constant to true to see different values console logged
   - Referral script (see `/js/refer.js`) is run and if the referral value is not empty general preorder price is set in the loading state
   - Checkout script (see `/js/checkout.js`) is run, Stripe SDK is initialized and default values are set
   - Stripe payment button has `onclick="handleSubmit()"`
   - `updatePrice` function is called. It has to remove loading state from the General Queue preorder price if there was a referral code. It's also called at `onload` event of the attached backend script (see `refer.js` for more info) but that can happen before the actual preorder element has been initialized on the page. Therefore a backup call is necessary.  
   - A check for `payment_intent` variable in the url (GET) is performed. If it's there the order form is set to loading state and the actual form is hidden.
   - `checkStatusOcean` function is called (see `checkStatusOcean` for more info) and the page is changed into the necessary state based on the payment intent status
   - "Site visitor" is logged via `aeLog`
   - `js/preorder.js` script is run which adds more log events for page browsing (see `js/preorder.js` for more info)
- **payment flow**
   - When "Order now" button is clicked the form is validated via the same ajaxForm as all the other forms but is routed to `processOrder` function (if `data-form-type` equals `order`) instead of submitting it to the backend script
   - `processOrder` (see `processOrder` for more info) calls `createClientAE` (see `createClientAE` for more info)
   - `handleSubmit` (see `handleSubmit` for more info) processes Stripe call with the payment request which either diplays the immediate error or redirects which then initiates `checkStatusOcean` (see `checkStatusOcean` for more info)

- **`/preorder_cn.html`**
 - Same as default `Preorder` page except translated to Chinese. To make sure the translation is activated inside JS flow `var CN = true;` must be added to a first inline `script` element on the page. See the first inline `style` for CSS attached messages.

- **`/news_image.html`**
- **`/news.html`**
 - Unused templates for a news article with and without an image. Sharer and "back to news" block is added automatically (see `/includes/endblock.html` for more info). To add these elements to new templates please make sure the empty element with `id="news-endblock"` is added where those elements should be and that it is loaded by JS by adding `$()"#news-endblock").load("includes/endblock.html")` to the first inline `script` element on the page.

**Note: If you do not delete your app, charges for using DigitalOcean services will continue to accrue.**