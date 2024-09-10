// Mobile Click Drop Down
$('.dropnav > a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass('active');
});


// toggle 
$(".nav-toggle").click(function () {
    $(this).toggleClass("on");
    $(".sitenav, .containbody").toggleClass("activated");

    if ($(".sitenav").hasClass("activated")) {
        $(".sitenav").animate({ left: "-100%" }, 100);
    } else {
        $(".sitenav").animate({ left: "0" }, 100);
    }
});


// Tinymce Text Editer

// tinymce.init({
//     selector: '.summernote',
//     plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
//     toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
//     tinycomments_mode: 'embedded',
//     tinycomments_author: 'Author name',
//     mergetags_list: [
//         { value: 'First.Name', title: 'First Name' },
//         { value: 'Email', title: 'Email' },
//     ],
//     ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
// });

tinymce.init({
    selector: '.summernote',
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
    imagetools_cors_hosts: ['picsum.photos'],
    menubar: 'file edit view insert format tools table help',
    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
    toolbar_sticky: true,
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    content_css: '//www.tiny.cloud/css/codepen.min.css',
    link_list: [
        { title: 'My page 1', value: 'http://www.tinymce.com' },
        { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_list: [
        { title: 'My page 1', value: 'http://www.tinymce.com' },
        { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_class_list: [
        { title: 'None', value: '' },
        { title: 'Some class', value: 'class-name' }
    ],
    importcss_append: true,
    file_picker_callback: function (callback, value, meta) {
        /* Provide file and text for the link dialog */
        if (meta.filetype === 'file') {
            callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
        }

        /* Provide image and alt text for the image dialog */
        if (meta.filetype === 'image') {
            callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
        }

        /* Provide alternative source and posted for the media dialog */
        if (meta.filetype === 'media') {
            callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
        }
    },
    templates: [
        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
        { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
        { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
    ],
    template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
    template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
    height: 520,
    image_caption: true,
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: 'sliding',
    contextmenu: "link image imagetools table",
});


// SHow Nad hidden
document.addEventListener('DOMContentLoaded', function () {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        accordion.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const detailsRow = document.getElementById('details-' + index);
            if (detailsRow.style.display === 'none' || detailsRow.style.display === '') {
                detailsRow.style.display = 'table-row';
            } else {
                detailsRow.style.display = 'none';
            }
        });
    });
});


// Date and time 
let visibilityDateInputs = document.querySelectorAll('.Visibilitydate');
let currentDate = new Date();
let year = currentDate.getFullYear();
let month = String(currentDate.getMonth() + 1).padStart(2, '0');
let day = String(currentDate.getDate()).padStart(2, '0');
let hours = String(currentDate.getHours()).padStart(2, '0');
let minutes = String(currentDate.getMinutes()).padStart(2, '0');

let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

// Set the formatted date and time as the value for each input element
visibilityDateInputs.forEach(input => {
    input.value = formattedDate;
});



// Images Upload and select preivew  //
function handleFileSelect(event) {
    const input = event.target;
    const imagePreview = document.getElementById('previewImage');
    const removeButton = document.getElementById('removeButton');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            removeButton.style.display = 'flex';
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        imagePreview.src = "#";
        imagePreview.style.display = 'none';
        removeButton.style.display = 'none';
    }
}

function handleRemoveButtonClick(event) {
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('previewImage');
    imageInput.value = ""; // Reset the file input value to clear the selected image
    imagePreview.src = "#";
    imagePreview.style.display = 'none';
    event.target.style.display = 'none';
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    const imageInput = document.getElementById('imageInput');
    imageInput.files = event.dataTransfer.files;
    handleFileSelect(event);
}

document.getElementById('imageInput').addEventListener('change', handleFileSelect);

const imagePreview = document.getElementById('previewImage');
const removeButton = document.getElementById('removeButton');
imagePreview.addEventListener('dragover', handleDragOver);
imagePreview.addEventListener('drop', handleDrop);
removeButton.addEventListener('click', handleRemoveButtonClick);

// Additional code to handle case when the user cancels file selection
document.getElementById('imageInput').addEventListener('click', function () {
    // Use a timeout to wait for the file input value to be updated after the user cancels
    setTimeout(function () {
        handleFileSelect(event);
    }, 100);
});


// Select to canvert slug meta tag
// Class to generate a URL slug based on selected page name
class URLGenerator {
    constructor(pageSelector, handleSelector, baseURL) {
        this.pageElement = document.querySelector(pageSelector);
        this.handleElement = document.querySelector(handleSelector);
        this.baseURL = baseURL;
        this.initialize();
    }

    initialize() {
        if (this.pageElement && this.handleElement) {
            // Add event listener for changes in the page selector
            this.pageElement.addEventListener('change', () => this.generateURL());
        }
    }

    generateURL() {
        const selectedPage = this.pageElement.value;
        const pageURL = this.convertToSlug(selectedPage);
        const fullURL = `${this.baseURL}${pageURL}`;
        this.handleElement.value = fullURL;
    }

    convertToSlug(text) {
        return text
            .toLowerCase() // Convert to lower case
            .trim() // Remove leading and trailing spaces
            .replace(/[^\w\s-]/g, '') // Remove all non-word characters except spaces and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
    }
}

// Instantiate URLGenerator with the selector for page name and handle inputs
const urlGenerator = new URLGenerator('.page_name_select', '.canvert_slug', '');

// Select elements for page title and URL handle
let urlHandleInput = document.querySelector('input[name="URL_handle"]');
let pageTitleInput = document.querySelector('input[name="Page_Title"]');

// Use the URLGenerator instance's convertToSlug method for consistent slug conversion
pageTitleInput.addEventListener('input', function () {
    const pageTitle = pageTitleInput.value;
    const slug = urlGenerator.convertToSlug(pageTitle); // Use method from URLGenerator
    urlHandleInput.value = slug;
});