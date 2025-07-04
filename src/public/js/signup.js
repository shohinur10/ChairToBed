console.log("Signup frontend javascript file");


$(function () {
    const fileTarget = $(".file-box .upload-hidden");

    fileTarget.on("change", function () {
        if (window.FileReader) {
            const uploadFile = $(this)[0].files[0];

            if (uploadFile) {
                const fileType = uploadFile.type;
                const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

                if (!validImageTypes.includes(fileType)) {
                    alert("Please insert only jpeg, jpg, or png!");
                } else {
                    const imageUrl = URL.createObjectURL(uploadFile);
                    console.log(imageUrl);

                    $(".upload-img-frame")
                        .attr("src", imageUrl)
                        .addClass("success");

                    const filename = uploadFile.name;
                    $(this).siblings(".upload-name").val(filename);
                }
            }
        }
    });
});

function validateSignupForm() {
    const memberNick = $(".member-nick").val();
    const memberPhone = $(".member-phone").val();
    const memberPassword = $(".member-password").val();
    const confirmPassword = $(".confirm-password").val();

    if (
        memberNick === "" ||
        memberPhone === "" ||
        memberPassword === "" ||
        confirmPassword === ""
    ) {
        alert("Please insert all required inputs!");
        return false;
    }

    if (memberPassword !== confirmPassword) {
        alert("Password differs, please check again!");
        return false;
    }

    return true;
}

