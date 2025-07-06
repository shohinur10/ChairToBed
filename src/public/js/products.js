console.log("Products frontend javascript file");
$(function(){
    $(".product-category").on("change",()=>{
        const selectedValue = $(".product-category ").val();
        if (selectedValue ==="Chair"){
            $("#product-category ").hide();
            $("#product-StyleType").show();
        }else{
            $("#product-MaterialType").hide();
            $("#product-category").show();
        }
    });
    // jquery orqali button larni bosish orqali

    $("#process-btn").on("click", () =>{
        $(".dish-container").slideToggle(500);
        $("#process-btn").css("display","none");
    });

    $("#cancel-btn").on("click", () =>{
        $(".dish-container").slideToggle(100);
        $("#process-btn").css("display","flex");
    });

// Update product process codes 
    $(".new-product-status").on("change",async function(e) {
        const id = e.target.id;
        const productStatus = $(`#${id}.new-product-status`).val();
        console.log("id:", id);
        console.log("productStatus:", productStatus);

        try {
            const response = await axios.post(`/admin/product/${id}`, 
                {productStatus: productStatus});
                console.log("response:", response );
                const result = response.data;
                if(result.data){
                    console.log("Product updated!");
                    $(".new-product-status").blur();
        
                }else alert ("Product update failed!");
        }catch (err) {
            console.log(err);
            alert("ProductStatus update failed!");
        }
    })
});

 // Validation codes 
function validateForm() {
    const productName = $(".product-name").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCategory  = $(".product-category").val();
    const productStatus = $(".product-status").val();
    const productDesc = $(".product-desc").val();
    
    if (
        productName === "" ||
        productPrice === "" ||
        productLeftCount === "" ||
        productCategory === "" ||
        productStatus === "" ||
        productDesc === "" 
    ) {
        alert("Please insert all required inputs!");
        return false;
    } else return true;
}

// Image codes for add for button 
function previewFileHandler(input, order) {
    const imgClassName = input.className;
    console.log("input:", input);

    // Corrected jQuery selector and used backticks for string interpolation
    const file = $(`.${imgClassName}`).get(0).files[0];
    const fileType = file["type"];
    
    // Ensure the variable is properly declared before usage
    const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (!validImageTypes.includes(fileType)) {
        alert("Please insert only jpeg, jpg, and png");
    } else {
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                $(`#image-section-${order}`).attr("src", reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
}

