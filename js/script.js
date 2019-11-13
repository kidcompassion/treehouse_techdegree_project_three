$(document).ready(function(){
    //Basic Info Fieldset
    const nameField = $('#name');
    const emailField = $('#mail');
    const titleField = $('#title');
    const otherTitleField = $('#other-title');
    
    //T-Shirt Info FieldSet
    const sizeField = $('#size');
    const designField = $('#design');
    const colorFieldWrap = $('#colors-js-puns');
    const colorField = $('#color');


    // Runs when form loads
    onFormLoad=()=> {
        // Move focus to name field on load
        nameField.focus();
        // Hide everything on load
        otherTitleField.hide();
        
    }



    // Toggle field visibility depending on selected title
    toggleJobRoleVisibility = (  )=>{
        titleField.on('change', function(){
            if(titleField.val() === 'other'){
                otherTitleField.show();
            }
        });
    }

    //Until a theme is selected from the “Design” menu, no color options appear in the “Color” drop down and the “Color” field reads “Please select a T-shirt theme”.
    toggleTshirtColorVisibility = (  )=>{
        designField.on('change', function(){
            colorFieldWrap.show();
        });
    }

    hideAllTShirtColors = () =>{
        colorField.find('option').hide();
    }
    setTShirtColorDefaultOption = () =>{
        const newOption = document.createElement('option');
        newOption.setAttribute('selected', 'selected');
        newOption.text = 'Please select a T-shirt theme';
        hideAllTShirtColors();
        colorField.prepend(newOption);
    }

    showTShirtColors= () => {
        //colorField.find('option').show();
    }

    selectTShirtDesign = ()=>{
        designField.on('change', function(){
            const str = $('#design option:selected').text();
            showColorBasedOnTheme(str);
            showTShirtColors();
          
  
       // console.log(jsPuns.test(str));
       
        });
    }

    showColorBasedOnTheme = (str) => {
        hideAllTShirtColors();
        const jsPuns = new RegExp('JS Puns');
        const heartJS = new RegExp('I ♥ JS');

        const colorSelector = $('#color > option');

        // if the regex comes up correct for jsPuns
        if(jsPuns.test(str) && !heartJS.test(str)){
            //loop through all options looking for the same string
            $.each(colorSelector, function(key, value){
                console.log(jsPuns.test(value.text));
                if(jsPuns.test(value.text) === true){
                    value.style.display = 'block';
                } else {
                    value.style.display = 'hide';
                };
            });
            
            
            

        } else if(heartJS.test(str) && !jsPuns.test(str)){
              //loop through all options looking for the same string
              $.each(colorSelector, function(key, value){
                if(heartJS.test(value.text)=== true){
                    value.style.display = 'block';
                } else {
                    value.style.display = 'hide';
                };
            });
            
        } else {
            setTShirtColorDefaultOption();
        }
 
        
        
        //console.log(heartJS.test('I ♥ JS'));
       // console.log(str.match(jsPuns);
       /* if(str.match(jsPuns)){

        } elseif(str.match(heartJS)) {

        } else {

        }*/
        
        
    }
    
    
    // For the T-Shirt "Color" menu, after a user selects a theme, only display the color options that match the design selected in the "Design" menu.



onFormLoad();
toggleJobRoleVisibility();
toggleTshirtColorVisibility();
setTShirtColorDefaultOption();
selectTShirtDesign();

});