document.addEventListener('DOMContentLoaded', () => {

    // Selecting elements from the DOM
    const menuItemsList = document.getElementById('menuItemsList');
    const selectedMenuItems = document.getElementById('selectedMenuItems');
    const jsonOutput = document.getElementById('jsonOutput');

    // Function to update selected menu items based on checked checkboxes
    function updateSelectedMenuItems() {
        const selectedTitles = new Set();

        // Gather all checked items from the menuItemsList
        document.querySelectorAll('#menuItemsList input[type="checkbox"]:checked').forEach(checkbox => {
            const title = checkbox.getAttribute('data-title');
            if (title) selectedTitles.add(title);
        });

        // Clear the selectedMenuItems and add the checked items with input fields and remove buttons
        selectedMenuItems.innerHTML = '';
        selectedTitles.forEach((title, index) => {
            const li = `
                <li class="dd-item" data-id="${index}">
                    <div class="dd-handle">
                        <span>
                            <svg viewBox="0 0 20 20" class="Online-Store-UI-IconWrapper__Icon_1aflm">
                                <path d="M7.5 4.5a1 1 0 0 0-1 1V6a1 1 0 0 0 1 1H8a1 1 0 0 0 1-1v-.5a1 1 0 0 0-1-1zm0 4.25a1 1 0 0 0-1 1v.5a1 1 0 0 0 1 1H8a1 1 0 0 0 1-1v-.5a1 1 0 0 0-1-1zM6.5 14a1 1 0 0 1 1-1H8a1 1 0 0 1 1 1v.5a1 1 0 0 1-1 1h-.5a1 1 0 0 1-1-1zM12 4.5a1 1 0 0 0-1 1V6a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-.5a1 1 0 0 0-1-1zm-1 5.25a1 1 0 0 1 1-1h.5a1 1 0 0 1 1 1v.5a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1zM12 13a1 1 0 0 0-1 1v.5a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1V14a1 1 0 0 0-1-1z" />
                            </svg> 
                            <input type="text" class="form-control" id="${title}" name="0_${title}" value="${title}" aria-required="true">
                        </span>
                        <span class="remove"><i class="fa-solid fa-xmark"></i></span>
                    </div>
                </li>`;
            selectedMenuItems.insertAdjacentHTML('beforeend', li);
        });

        // Update the JSON output
        updateOutput();
    }

    // Function to update JSON output in textarea
    function updateOutput() {
        const list = $('#nestable').nestable('serialize');
        if (window.JSON) {
            jsonOutput.value = JSON.stringify(list, null, 2); // Set textarea value
        } else {
            jsonOutput.value = 'JSON browser support required for this application.';
        }
    }

    // Event listener to update selectedMenuItems when checkboxes change
    menuItemsList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            updateSelectedMenuItems();
        }
    });

    // Event delegation for remove buttons
    selectedMenuItems.addEventListener('click', (e) => {
        if (e.target.closest('.remove')) {
            const item = e.target.closest('.dd-item');
            if (item) {
                const title = item.querySelector('input[type="text"]').value;
                removeFromSelectedMenuItems(item, title);
            }
        }
    });

    // Function to remove item from selectedMenuItems and uncheck corresponding checkbox
    function removeFromSelectedMenuItems(item, title) {
        // Remove the item from selectedMenuItems
        item.remove();

        // Uncheck the corresponding checkbox in menuItemsList
        document.querySelector(`#menuItemsList input[data-title="${title}"]`).checked = false;

        // Update the JSON output
        updateOutput();
    }

    // Initialize Nestable
    $('#nestable').nestable({
        maxDepth: 3
    }).on('change', updateOutput);

});


// Messages Notification
document.addEventListener("DOMContentLoaded", function () {
    var messages = document.querySelectorAll(".errormessages");

    // Notification funtions 
    messages.forEach(function (msg) {

        // Check if the message container has any content
        var hasMessage = msg.querySelector('.errormsg') || msg.querySelector('.succesmsg');
        if (hasMessage) {

            var closeButton = msg.querySelector('.close');

            // Create the reverse progress bar
            var progressBar = document.createElement('div');
            progressBar.className = 'reverse-progress-bar';
            msg.appendChild(progressBar);

            // Start the reverse progress bar animation
            setTimeout(function () {
                progressBar.style.width = "0%"; // Shrink width from 100% to 0%
            }, 100); // Small delay to ensure transition works


            // Show the message with flip-in animation
            setTimeout(function () {
                msg.classList.add("show");
            }, 100);


            // Hide the message after 10 seconds
            setTimeout(function () {
                msg.classList.remove("show");
                msg.classList.add("hide");

                setTimeout(function () {
                    msg.remove(); // Completely remove the message
                }, 500);

            }, 10000); // 10 seconds = 10000 milliseconds

            // Close button functionality Remove the Notification
            if (closeButton) {
                closeButton.addEventListener('click', function () {
                    msg.classList.remove("show");
                    msg.classList.add("hide");
                    setTimeout(function () {
                        msg.remove(); // Remove the message 
                    }, 500); // Time for animation to complete
                });
            }

        }
    });
});