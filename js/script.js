$(document).ready(function(){
    const nameField = $('#name');
    const emailField = $('#mail');
    const titleField = $('#title');


    // Runs when form loads
    onFormLoad=()=> {
        // Move focus to name field on load
        nameField.focus();
    }

    // Toggle field visibility depending on selected title
    toggleJobRoleVisibility = (  )=>{
        titleField.on('change', function(){
            if(titleField.val() === 'other'){
                $('#other-title').show();
            }
        });
   
        // Hide it on load
        $('#other-title').hide();

    }


onFormLoad();
toggleJobRoleVisibility();
});