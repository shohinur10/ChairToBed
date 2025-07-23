console.log("Products frontend javascript file");

// Add missing validateForm function  
function validateForm() {
    const productName = $(".product-name").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCategory = $("select[name='productCategory']").val();
    const productStyleType = $("select[name='productStyleType']").val();
    const productMaterialType = $("select[name='productMaterialType']").val();
    
    if (!productName || !productPrice || !productLeftCount || !productCategory || !productStyleType || !productMaterialType) {
        alert("Please fill in all required fields");
        return false;
    }
    
    // Check if member is logged in
    if (!window.memberData || !window.memberData._id) {
        alert("User session expired. Please login again.");
        return false;
    }
    
    return true;
}

// Search products function
function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        const productName = row.querySelector('.product-title').textContent.toLowerCase();
        const category = row.querySelector('.category-badge').textContent.toLowerCase();
        const material = row.querySelector('.material-cell').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || 
            category.includes(searchTerm) || 
            material.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update visible count
    const visibleRows = document.querySelectorAll('.table-row[style=""], .table-row:not([style])');
    console.log(`Showing ${visibleRows.length} of ${tableRows.length} products`);
}

$(function(){
    // Set founderId from server-side member data when page loads
    if (window.memberData && window.memberData._id) {
        $(".founder-id").val(window.memberData._id);
        console.log("FounderId set to:", window.memberData._id);
    }
    
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
        const productStatus = e.target.value;

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

