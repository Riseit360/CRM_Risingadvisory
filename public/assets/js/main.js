// input file uploading
var fileUpload = document.querySelector('.uplodingFile');
var uploadmsg = document.querySelector('.uploadmsg')

// upload File Input and Msg 
var upmsgfoo = uploadmsg.querySelector('.adlinkfildiv');
var firstlabletag = uploadmsg.querySelector('.firstlable')
var singImgUpload = upmsgfoo.querySelector('.fileuplsinimg')

// Add Form URL Poupup
var addUrlPopup = upmsgfoo.querySelector('.adurlform')
var UrlInputSecPop = document.querySelector('.urlinpuform')
var popcloseURl = UrlInputSecPop.querySelector('.closeurllpopup')

// Form Url in Input To save Btn
var saveUrlBtn = UrlInputSecPop.querySelector('.sunbinpurl')
var InPutSaveUrl = UrlInputSecPop.querySelector('.uplod_URl_sinng_img')

// Directory File Update
var direFileimg = upmsgfoo.querySelector('.directoryfileimg')


// Defult Remove upmsgfoo
$(upmsgfoo).remove();


// Initialize sortable functionality
$(function () {
    $("#uploadPreview").sortable();
    $("#uploadPreview").disableSelection();
});


// Function to append image Html preview 
function appendPreview(file) {
    // Html Add Preview img
    var reader = new FileReader();
    reader.onload = function (e) {
        $("<div class='preview'><img src='" + e.target.result + "'><span class='delete'><i class='fa-solid fa-xmark'></i></span></div>").appendTo(uploadPreview);
    };
    reader.readAsDataURL(file);
}


// file Upload & Drop Down & Sijngle File funtions on Preview
$(fileUpload).on("change", function () {

    // File Path 
    var files = $(this)[0].files;
    $(uploadPreview).empty();

    // loop for images priview append
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            appendPreview(files[i]);
        }

        // Dom Modifitions to html Upload Msg First Lable & Upload Input, Url
        $(uploadmsg).append(upmsgfoo);
        $(upmsgfoo).css("display", "flex");
        $(firstlabletag).remove();
    }

    // Single file input change event
    $(singImgUpload).on("change", function () {
        var file = this.files;
        for (var i = 0; i < file.length; i++) {
            appendPreview(file[i]);
        }
    });

});


// directory files input Upload change event
$(direFileimg).on("change", function () {
    var file = this.files;
    for (var i = 0; i < file.length; i++) {
        appendPreview(file[i]);
    }
});


// Add Img With URL to upload Funtions on Preview
$(saveUrlBtn).on('click', function () {

    // Append the image preview and img path
    var imageUrl = $(InPutSaveUrl).val();

    // Create HTML for the image preview
    var previewHtml = `
        <div class='preview'>
            <img src='${imageUrl}' alt='Preview Image'>
            <span class='delete' onclick='deletePreview(this)'><i class='fa-solid fa-xmark'></i></span>
        </div>`;

    $(uploadPreview).append(previewHtml);

    // Hide the URL input section
    UrlInputSecPop.style.display = 'none';
});


// click to delet images
$(uploadPreview).on("click", ".delete", function () {

    //  Delete Button Click To Previes Img Remove
    $(this).parent(".preview").remove();
    $(fileUpload).val(""); // Clear input value if needed

    // Dom Modifitions to html Upload Msg First Lable & Upload Input, Url
    if ($(uploadPreview).is(':empty')) {
        $(uploadmsg).append(firstlabletag);
        $(upmsgfoo).remove();
    }
});


// Add Form URL to start Popup & close to Popup Close
$(addUrlPopup).on("click", function () {
    if (UrlInputSecPop.style.display === 'none' || UrlInputSecPop.style.display === '') {
        UrlInputSecPop.style.display = 'flex';
    } else {
        UrlInputSecPop.style.display = 'none';
    }
});
$(popcloseURl).on("click", function () {
    UrlInputSecPop.style.display = 'none';
});