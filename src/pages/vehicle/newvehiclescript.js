const form = document.getElementById("newVehicleForm");

form.addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Log to check if the event is firing properly
    console.log('Form submit prevented');

    // Create an empty object to store form data
    const formData = {};

    // Use FormData to get form contents
    const formElements = new FormData(form);

    // Log formElements to see the values
    console.log('FormData:', formElements);

    // Loop through each field in the form
    formElements.forEach((value, key) => {
        formData[key] = value;
    });

    // Log the form data object to the console
    console.log('Form data:', formData);
    removeSelfDestructScript()
    
    function removeSelfDestructScript() {
        const scriptElement = document.currentScript; // This refers to the currently executing script
        if (scriptElement) {
          scriptElement.remove();
          console.log('Self-destruct: Script removed after form submission');
        }
      }
});