$(document).ready(function(){
    //Basic Info Fieldset
    const nameField = $('#name');
    const emailField = $('#mail');
    const titleField = $('#title');
    const otherTitleField = $('#other-title');
    
    //T-Shirt Info FieldSet
    const designField = $('#design');
    const colorField = $('#color');
    const colorFieldWrapper = $('#colors-js-puns');

    // Payment Info Fieldset
    const creditCardField = $('#credit-card');
    const payPalField = $('#paypal');
    const bitcoinField = $('#bitcoin');
    
    //Set up var for desiredpaymentmethod so I can access it globally
    let desiredPaymentMethod = $('#payment').children("option:selected").val();

    // Check for errors
    let errorsExist = false;

    /**
     * Run this when form first loads 
     *  */ 

    onFormLoad=()=> {
        // Move focus to name field on load
        nameField.focus();
        // Hide all conditional fields on load
        otherTitleField.hide();
        payPalField.hide();
        bitcoinField.hide();
    }


    /*** JOB ROLE FIELDSET  */

    /** 
     * Toggle field visibility depending on selected title 
     * */ 

    toggleJobRoleVisibility = (  )=>{
        // As soon as the primary job role changes, switch on the visibility for the secondary title
        titleField.on('change', function(){
            if(titleField.val() === 'other'){
                otherTitleField.show();
            }
        });
    }

    /*** T SHIRT FIELDSET  */

    /**
     * Hide all color options by default
     */

    hideAllTShirtColors = () =>{
        colorFieldWrapper.hide();
        colorField.find('option').hide();
    }

    /**
     * Create a default "please select a t shirt theme option"
     * (I know the point of this exercise is to use jQuery, but I just wanted to do something in vanilla JS because it's the weaker of my skillsets)
     */
    setTShirtColorDefaultOption = () =>{
        const newOption = document.createElement('option');
        newOption.setAttribute('selected', 'selected');
        newOption.text = 'Please select a T-shirt theme';
        colorField.prepend(newOption);
        hideAllTShirtColors();
    }

    /**
     * When user selects a shirt type, run a RegEx on the option's text to see what they chose
     * and reveal the child color options
     */
    selectTShirtDesign = ()=>{
        // when design selected changes...
        designField.on('change', function(){
            // grab the option text
            const str = $('#design option:selected').text();
            //run reg ex to find matching options
            showColorBasedOnTheme(str);
            //show color select
            colorFieldWrapper.show();
        });
    }

    /**
     * Show the corresponding colors for the select shirt type
     */
    showColorBasedOnTheme = (str) => {
        
        //Hide all T-shirt colors by default, to avoid showing everything
        hideAllTShirtColors();

        //Set up RegExs
        const jsPuns = new RegExp('JS Puns');
        const heartJS = new RegExp('I ♥ JS');
        const colorSelector = $('#color > option');

        // If the strings for the puns shirt match...
        if(jsPuns.test(str) && !heartJS.test(str)){

            //...loop through all options in the select looking for the same string
            $.each(colorSelector, function(key, value){
               
                //If option has same string, show the corresponding values...
                if(jsPuns.test(value.text) === true){
                    value.style.display = 'block';
                } else { //...and hide everything else
                    value.style.display = 'hide';
                };
            });

        // Else if the strings for the heart shirt match...
        } else if(heartJS.test(str) && !jsPuns.test(str)){
              
            //...loop through all options in the select looking for the same string
              $.each(colorSelector, function(key, value){
                //If option has same string, show the corresponding values...
                if(heartJS.test(value.text)=== true){
                    value.style.display = 'block';
                } else { //...and hide everything else
                    value.style.display = 'hide';
                };
            });
        // Anything else, reset the color selector to its default state    
        } else {
            setTShirtColorDefaultOption();
        } 
    }
    
    /**
     * Event Registration 
    */

    disableCompetingEvents = () => {
        //Set var to determine whether user is checking or unchecking a box
        let selected = false;

        $(':checkbox').on('change', function(e){
            // Check if checking or unchecking, and update selected var
            if(e.target.checked === true){
                selected = true;
            } else {
                selected = false;
            }
            
            //Get data attr showing time for clicked elem
            const selectedTimeBlock = $(this).attr('data-day-and-time');
            //Get data attr showing name for clicked elem
            const selectedTimeName = $(this).attr('name');

            // Loop through all checkboxes...
            $('.activities :checkbox').each(function() {
               //...and grab the ones with timestamps that match the clicked elem, but have different name attr to avoid turning off the desired checkbox
                if($(this).attr('data-day-and-time') === selectedTimeBlock && $(this).attr('name') != selectedTimeName){
                    // If we're checking, DISable any other events at the same time
                    if(selected === true){
                        $(this).attr('disabled', true);
                    //If we're unchecking, ENable any other events at the same time
                    } else if(selected === false){
                        $(this).attr("disabled", false);
                    }
                }
            });
        });
    }

    /**
     * Keep running tally of the event admission totals
     */
    calculateRegistrationTotals = (e) => {
         
        let finalCost = 0; //Start total amount at 0
        let runningCost = [0]; //Set up array to keep track of all selected amounts
      
        // When user changes checkboxes...
        $(':checkbox').on('change', function(e){
            //..trim the $ sign off the data value
            let eventCost = $(e.target).attr('data-cost').slice(1);
            //make sure value is an int
            eventCost = parseInt(eventCost);
        
            //if a checkbox is selected, add the corresponding value into the array
            if($(e.target).is(':checked')){
                runningCost.push(eventCost);
            // If it's unchecked, take it out of the array
            } else if(!$(e.target).is(':checked'))  {
                let index = runningCost.indexOf(parseInt(eventCost));
                runningCost.splice( index, 1);
            }
            
            // Add up the amount total
            finalCost = runningCost.reduce((a, b) => a + b, 0); 

            // Check if there is a total showing on the page; if there is, remove it before updating to avoid repeating values
            if($('#registrationTotal').length > 0){
                $('#registrationTotal').remove();
            }
            //Append updated total to the activities class
            $('.activities').append('<span id="registrationTotal">Total: $' + finalCost + '</span>'); 
        });
    }

    /**
     * Disable the select payment option by default
     */

    disableDefaultPaymentOption = () =>{
        //Remove the select payment method option
        $('select#payment option:contains("Select Payment Method")').remove();
        // Set the select to show credit card by default
        $('select#payment option:contains("Credit Card")').attr('selected', 'selected');
    }

    /**
     * Toggle the payment fields on and off depending on the selected payment option
     */

    showCorrectPaymentOptions = () =>{
        // When user changes the payment select
        $('#payment').on('change', function(){     
            //..grab the value of the selected options
            desiredPaymentMethod = $(this).children("option:selected").val();
   
            // run the value from the select through a switch to determine what to show and hide, and what to validate
            switch(desiredPaymentMethod){
                case 'Credit Card':
                    creditCardField.show();
                    payPalField.hide();
                    bitcoinField.hide();
                    creditCardNumberValidation();
                    zipCodeNumberValidation();
                    cvvNumberValidation();
                break;
                case 'PayPal':
                    payPalField.show();
                    creditCardField.hide();
                    bitcoinField.hide();
                break;
                case 'Bitcoin':
                    bitcoinField.show();
                    payPalField.hide();
                    creditCardField.hide();
                break;
                default:
                    alert('Sorry, an error has occurred. Please try again later.');
                break;
            }
        });
    }

    /**
     * VALIDATION FUNCTIONS
     */

    /**
     * InsertErrorMsg: takes a specific field, a specific error message, and a specific error class
     */
    insertErrorMsg = (field, message, fieldClass) =>{
        removeErrorMsg(fieldClass);
        // Add an error message above the field in question
        $('<span class="error '+ fieldClass + '">'+message+'</span>').insertBefore(field);
        // Set errorsExist to True
        errorsExist = true;
    }

    /**
     * removeErrorMsg: takes fieldclass 
     */
    removeErrorMsg = (fieldClass) => {
        //if error class exists, remove it so we don't have repeating errors
        if(fieldClass.length > 0){
            $('.' + fieldClass).remove();
        }
        //set errorsexist to false
        errorsExist = false;
    }
    

    /**
     * Creates validation for the name fiels
     */
    nameValidation = (nameField) =>{
        const nameErrorMsg = 'Name field cannot be blank';
        const nameErrorClass= 'name-field-error';
        const nameValue = nameField.val();
            
        // If field is empty, throw an error
        if(nameValue === ''){
            insertErrorMsg(nameField, nameErrorMsg, nameErrorClass);
        }else {
            removeErrorMsg(nameErrorClass);
        }
    }


    /**
     * Creates validation for the email field
     */
    emailValidation = (emailField) =>{
        // Set up info for error
        const emailErrorMsg1 = 'Email field cannot be blank';
        const emailErrorMsg2 = 'Please provide a valid email';
        const emailErrorClass= 'email-field-error';

        // Check: 
        // If string has only alphanumeric characters before the @
        // If string has at least one . after the @
        const emailRegEx = /^[^@]+@[^@.]+\.[a-z]+$/i;
        const emailValue = emailField.val();
            
        // If email is not set...
        if(emailValue === ''){
            //remove any existing errors to avoid them stacking up
            removeErrorMsg(emailErrorClass);
            //insert error message
            insertErrorMsg(emailField, emailErrorMsg1, emailErrorClass);
        }     
        // check for valid email format; if it's not valid...
        else if (emailRegEx.test(emailValue) === false){
            //remove any existing errors to avoid them stacking up
            removeErrorMsg(emailErrorClass);
            //insert error message
            insertErrorMsg(emailField, emailErrorMsg2, emailErrorClass);
        } 
        else{
            // remove any error classes
            removeErrorMsg(emailErrorClass);
        }
    }


    /**
     * Creates validation for the other title field
     */

    otherTitleValidation = (otherTitleField) =>{
        const otherErrorMsg = 'Other title cannot be blank';
        const otherErrorClass= 'other-field-error';
        const otherTitleValue = otherTitleField.val();
        // If the title Field is set to other...
        if(titleField.val() === 'other'){
            //Check whether the other title field has anything in it
            if(otherTitleValue === ''){
                insertErrorMsg(otherTitleField, otherErrorMsg, otherErrorClass);
            }else {
                removeErrorMsg(otherErrorClass);
            }
        }
    }

    /**
     * Creates validation for the event registration
     */

    registrationValidation=()=>{
        const registrationErrorMsg = 'Please choose at least one event';
        const registrationErrorClass= 'registration-field-error';
        const registrationEvents = $('.activities input[type="checkbox"]:checked');
        // check how many boxes are selected
        const checkedEvents = $(registrationEvents).length;
        
        if(checkedEvents === 0){
            removeErrorMsg(registrationErrorClass);
            insertErrorMsg($('.activities legend'), registrationErrorMsg, registrationErrorClass);
        } 
    }

    /**
     * Creates validation for the Credit Card Number Field
     */

    creditCardNumberValidation = ()=>{
        const cardNumberField = $('#cc-num');
        const cardNumberEmptyErrorMsg = 'CC Number cannot be empty';
        const cardNumberTypeErrorMsg = 'CC Number is made up of numbers only';
        const cardNumberLengthErrorMsg = 'CC Number should have between 13 and 16 digits';
        const cardNumberErrorClass = 'card-error';
        const cardNumberVal = cardNumberField.val();
          
        // If card number field is empty, throw an error
        if(cardNumberVal === ''){
            insertErrorMsg(cardNumberField, cardNumberEmptyErrorMsg, cardNumberErrorClass);
        // If card number field contains anything but numbers, throw an error
        }else if( isNaN(cardNumberVal) ){
            insertErrorMsg(cardNumberField, cardNumberTypeErrorMsg, cardNumberErrorClass);
        // If card number field doesn't have 13-16 numbers, throw an error
        }else if(cardNumberVal.length < 13 || cardNumberVal.length > 17  ){
            insertErrorMsg(cardNumberField, cardNumberLengthErrorMsg, cardNumberErrorClass);
        }else{
            removeErrorMsg(cardNumberErrorClass);
        }
    }

    /**
     * Creates validation for the Zipcode Number Field
     */

    zipCodeNumberValidation = ()=>{
        const zipCodeField = $('#zip');
        const zipCodeEmptyErrorMsg = 'Zipcode cannot be blank';
        const zipCodeTypeErrorMsg = 'Zipcode is made up of numbers only';
        const zipCodeLengthErrorMsg = 'Zipcode should have 5 digits';
        const zipCodeErrorClass = 'zipcode-error';
        const zipCodeVal = zipCodeField.val();

        // If Zipcode field has no content, throw an error
        if(zipCodeVal ==='') {
            insertErrorMsg(zipCodeField, zipCodeEmptyErrorMsg, zipCodeErrorClass);
        }
        // If Zipcode field contains anything but numbers, throw an error
        else if(isNaN(zipCodeVal)){
            removeErrorMsg(zipCodeErrorClass);
            insertErrorMsg(zipCodeField, zipCodeTypeErrorMsg, zipCodeErrorClass);
        // If zipcode field isn't 5 numbers long, throw an error
        }else if(zipCodeVal.length != 5){
            removeErrorMsg(zipCodeErrorClass);
            insertErrorMsg(zipCodeField, zipCodeLengthErrorMsg, zipCodeErrorClass);
        }else{
            removeErrorMsg(zipCodeErrorClass);
        }
    }

    /**
     * Creates validation for the CVV Number Field
     */
    cvvNumberValidation = ()=>{
        const cvvNumberField = $('#cvv');
        const cvvNumberEmptyErrorMsg = 'CVV cannot be empty';
        const cvvNumberTypeErrorMsg = 'CVV is made up of numbers only';
        const cvvNumberLengthErrorMsg = 'CVV should have 3 digits';
        const cvvNumberErrorClass = 'cvv-error';
        const cvvNumberVal = cvvNumberField.val();
    
        // If field is blank, throw an error
        if(cvvNumberVal === ''){
            removeErrorMsg(cvvNumberErrorClass);
            insertErrorMsg(cvvNumberField, cvvNumberEmptyErrorMsg, cvvNumberErrorClass);
        // if field contains anything other than numbers, throw an error
        }else if(isNaN(cvvNumberVal)){
            removeErrorMsg(cvvNumberErrorClass);
            insertErrorMsg(cvvNumberField, cvvNumberTypeErrorMsg, cvvNumberErrorClass);
        // if field doesn't have 3 numbers, throw an error
        }else if(cvvNumberVal.length != 3){
            removeErrorMsg(cvvNumberErrorClass);
            insertErrorMsg(cvvNumberField, cvvNumberLengthErrorMsg, cvvNumberErrorClass);
        }else{
            removeErrorMsg(cvvNumberErrorClass);
        }
    }

    formSubmit = () => {
        // Grab the form so we can hook into its submit
        const form = $('form');
        //Get rid of all errors on submit, to avoid duplicating errors
        $('.error').remove();
        //On submit...
        form.submit(function(e){

            //..validate the name field
            nameValidation(nameField);
            //..validate the email field
            emailValidation(emailField);
            otherTitleValidation(otherTitleField);
            //..validate the event checkboxes
            registrationValidation();

            // If the payment method is the default or credit card, run credit card validation
            if(desiredPaymentMethod === 'Credit Card' || desiredPaymentMethod === 'select method'){
                creditCardNumberValidation();
                zipCodeNumberValidation();
                cvvNumberValidation();
            }

            // If errorsExist is true, don't let the form submit
            if(errorsExist === true){
                e.preventDefault();
            }else {
                $('.container').html('<h1 class="success-msg">You are now registered for the conference!</h1>');
            }
        });
    }

    /**
     * Add inline validation for name and email fields
     */
    nameField.on('blur', function(){
        nameValidation(nameField);
    });
    emailField.on('blur', function(){
        emailValidation(emailField);
    });

    /**
     * Load all default functionality
     */
    onFormLoad();
    toggleJobRoleVisibility();
    setTShirtColorDefaultOption();
    selectTShirtDesign();
    disableCompetingEvents();
    calculateRegistrationTotals();
    disableDefaultPaymentOption();
    showCorrectPaymentOptions();
    formSubmit();
});