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

    /**
     * Run this when form first loads 
     *  */ 
    onFormLoad=()=> {
        // Move focus to name field on load
        nameField.focus();
        // Hide secondary title field by default
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
        designField.on('change', function(){
            const str = $('#design option:selected').text();
            
            showColorBasedOnTheme(str);
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
    
    
  
    /* SCHEDULING */

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


    calculateRegistrationTotals = (e) => {
         let finalCost = 0;
         let runningCost = [0];
      
         $(':checkbox').on('change', function(e){
            let eventCost = $(e.target).attr('data-cost').slice(1);
            eventCost = parseInt(eventCost);
         if($(e.target).is(':checked')){
                 runningCost.push(eventCost);
            
             
         } else if(!$(e.target).is(':checked'))  {
           console.log('blong');
           let index = runningCost.indexOf(parseInt(eventCost));
         
           //console.log(eventCost);
               runningCost.splice( index, 1);
         }
         

        finalCost = runningCost.reduce((a, b) => a + b, 0);

         if($('#registrationTotal').length > 0){
             $('#registrationTotal').remove();
         }
         $('.activities').append('<span id="registrationTotal">Total: $' + finalCost + '</span>');
         
        });
   
       
       
    }



    disableDefaultPaymentOption = () =>{
        $('select#payment option:contains("Select Payment Method")').attr('disabled', 'true');
        $('select#payment option:contains("Credit Card")').attr('selected', 'selected');
    }

    showCorrectPaymentOptions = () =>{
        $('#payment').on('change', function(){
            
            const desiredPaymentMethod = $(this).children("option:selected").val();
            const creditCardField = $('#credit-card');
            

            switch(desiredPaymentMethod){
                case 'Credit Card':
                    creditCardField.show();
                    creditCardNumberValidation();
                    zipCodeNumberValidation();
                    cvvNumberValidation();
                    payPalField.hide();
                    bitcoinField.hide();
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
                    alert('Sorry, an error has occurred.');
                break;
            }

        });
    }




    /**
     * VALIDATION
     */



    insertErrorMsg = (field, message, fieldClass) =>{
        $('<span class="error '+ fieldClass + '">'+message+'</span>').insertBefore(field);
    }
    removeErrorMsg = (fieldClass) => {
        if(fieldClass.length > 0){
            $('.' + fieldClass).remove();
        }
    }
    

    nameValidation = (nameField) =>{
        // When user leaves name field, check validation
        const nameErrorMsg = 'Name field cannot be blank';
        const nameErrorClass= 'name-field-error';
        nameField.on('blur', function(){

            const nameValue = nameField.val();
            
            if(nameValue === ''){
                insertErrorMsg(nameField, nameErrorMsg, nameErrorClass);
            }else {
                removeErrorMsg(nameErrorClass);
            }
        });
    }



    emailValidation = (emailField) =>{
        // Set up info for error
        const emailErrorMsg1 = 'Email field cannot be blank';
        const emailErrorMsg2 = 'Please provide a valid email';
        const emailErrorClass= 'email-field-error';

        //use literal syntax bc it performs better
        // If string has only alphanumeric characters before the @
            // is there is at least one . after the @
        const emailRegEx = /^[^@]+@[^@.]+\.[a-z]+$/i;

  
        emailField.on('blur', function(){

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
        });
    }


    registrationValidation=()=>{
        // Set up info for error
        const registrationErrorMsg = 'Please choose at least one event';
        const registrationErrorClass= 'registration-field-error';
        const registrationEvents = $('.activities input[type="checkbox"]:checked');
        const checkedEvents = $(registrationEvents).length;
        
        if(checkedEvents === 0){
            insertErrorMsg($('.activities legend'), registrationErrorMsg, registrationErrorClass);
        } 
        
    }



    creditCardNumberValidation = ()=>{
        const cardNumberField = $('#cc-num');
        const cardNumberEmptyErrorMsg = 'CC Number cannot be empty';
        const cardNumberTypeErrorMsg = 'CC Number is made up of numbers only';
        const cardNumberLengthErrorMsg = 'CC Number should have between 13 and 16 digits';
        const cardNumberErrorClass = 'card-error';
        cardNumberField.on('blur', function(){
        
            const cardNumberVal = cardNumberField.val();
            
            if(cardNumberVal === ''){
            
                insertErrorMsg(cardNumberField, cardNumberEmptyErrorMsg, cardNumberErrorClass);
            }else if( isNaN(cardNumberVal) ){
                insertErrorMsg(cardNumberField, cardNumberTypeErrorMsg, cardNumberErrorClass);
            }else if(cardNumberVal.length > 13 && cardNumberVal.length < 16 ){
                insertErrorMsg(cardNumberField, cardNumberLengthErrorMsg, cardNumberErrorClass);
            }else{
                removeErrorMsg(cardNumberErrorClass);
            }
        });
    }



    zipCodeNumberValidation = ()=>{
        //if is numbers
        //if between 13 to 16 digits

        const zipCodeField = $('#zip');

        const zipCodeEmptyErrorMsg = 'Zipcode cannot be blank';
        const zipCodeTypeErrorMsg = 'Zipcode is made up of numbers only';
        const zipCodeLengthErrorMsg = 'Zipcode should have 5 digits';
        const zipCodeErrorClass = 'zipcode-error';

        zipCodeField.on('blur', function(){
                
            const zipCodeVal = zipCodeField.val();
            if(zipCodeVal ==='') {
                insertErrorMsg(zipCodeField, zipCodeEmptyErrorMsg, zipCodeErrorClass);
            }
            else if(isNaN(zipCodeVal)){
                insertErrorMsg(zipCodeField, zipCodeTypeErrorMsg, zipCodeErrorClass);
            }else if(zipCodeVal.length != 5){
                insertErrorMsg(zipCodeField, zipCodeLengthErrorMsg, zipCodeErrorClass);
            }else{
                removeErrorMsg(zipCodeErrorClass);
            }
        });
    }

    
    cvvNumberValidation = ()=>{
        const cvvNumberField = $('#cvv');
        const cvvNumberEmptyErrorMsg = 'CVV cannot be empty';
        const cvvNumberTypeErrorMsg = 'CVV is made up of numbers only';
        const cvvNumberLengthErrorMsg = 'CVV should have 3 digits';
        const cvvNumberErrorClass = 'cvv-error';

        cvvNumberField.on('blur', function(){
            const cvvNumberVal = cvvNumberField.val();
      


            if(cvvNumberVal === ''){
                insertErrorMsg(cvvNumberField, cvvNumberEmptyErrorMsg, cvvNumberErrorClass);
            }else if(isNaN(cvvNumberVal)){
                insertErrorMsg(cvvNumberField, cvvNumberTypeErrorMsg, cvvNumberErrorClass);
            }else if(zipCodeVal.length != 5){
                insertErrorMsg(cvvNumberField, cvvNumberLengthErrorMsg, cvvNumberErrorClass);
            }else{
                removeErrorMsg(cvvNumberErrorClass);
            }
        });

    }

    preventFormSubmit = () => {
        const submitBtn = $('input[type="submit"]');
        const form = $('form');

        form.submit(function(e){
            registrationValidation();
            creditCardNumberValidation();
            zipCodeNumberValidation();
            cvvNumberValidation();
            e.preventDefault();
        });
        
    }


    

   preventFormSubmit();
    //Name field can't be blank.
    // Error Message- User Name Cannot be Blank. Please enter your name.

  //validateField(nameField);

    //Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com for example.
    // Email cannot be blank. Please enter your email address.
    //Please enter a valid email address. This address has a problem format.
    //validateField(emailField);
    
    //User must select at least one checkbox under the "Register for Activities" section of the form.
    // You must select at least one activity
    /**
     * If the selected payment option is "Credit Card," make sure the user has supplied a Credit Card number, a Zip Code, and a 3 number CVV value before the form can be submitted.
Credit Card field should only accept a number between 13 and 16 digits.
// This is not a valid CC number
The Zip Code field should accept a 5-digit number.
//This is not a valid zipcode
The CVV should only accept a number that is exactly 3 digits long.
//This is not a valid CVV
     */

    onFormLoad();
    toggleJobRoleVisibility();
    setTShirtColorDefaultOption();
    selectTShirtDesign();

    disableCompetingEvents();

    calculateRegistrationTotals();
    disableDefaultPaymentOption();
    showCorrectPaymentOptions();


    nameValidation(nameField);
    emailValidation(emailField);
    creditCardNumberValidation();
    zipCodeNumberValidation();
    cvvNumberValidation();
    

});