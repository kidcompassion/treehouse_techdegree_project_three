$(document).ready(function(){
    //Basic Info Fieldset
    const nameField = $('#name');
    const titleField = $('#title');
    const otherTitleField = $('#other-title');
    
    //T-Shirt Info FieldSet
    const designField = $('#design');
    const colorField = $('#color');


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
        colorField.find('option').hide();
    }

    /**
     * Create a default "please select a t shirt theme option"
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
    }

    showCorrectPaymentOptions = () =>{
        $('#payment').on('change', function(){
            
            const desiredPaymentMethod = $(this).children("option:selected").val();
            const creditCardField = $('#credit-card');
            

            switch(desiredPaymentMethod){
                case 'Credit Card':
                    creditCardField.show();
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



    onFormLoad();
    toggleJobRoleVisibility();
    setTShirtColorDefaultOption();
    selectTShirtDesign();

    disableCompetingEvents();

    calculateRegistrationTotals();
    disableDefaultPaymentOption();
    showCorrectPaymentOptions();

});