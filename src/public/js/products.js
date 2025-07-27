console.log("Products frontend javascript file");

// Add missing validateForm function  
function validateForm() {
    console.log("Validating form...");
    
    const productName = $(".product-name").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCategory = $("select[name='productCategory']").val();
    const productStyleType = $("select[name='productStyleType']").val();
    const productMaterialType = $("select[name='productMaterialType']").val();
    
    console.log("Form values:", {
        productName, productPrice, productLeftCount, 
        productCategory, productStyleType, productMaterialType
    });
    
    if (!productName || !productPrice || !productLeftCount || !productCategory || !productStyleType || !productMaterialType) {
        alert("Please fill in all required fields");
        return false;
    }
    
    // Check if member is logged in
    if (!window.memberData || !window.memberData._id) {
        alert("User session expired. Please login again.");
        return false;
    }
    
    // Check if at least one image is selected
    const imageOne = document.querySelector('.image-one');
    if (!imageOne || !imageOne.files || !imageOne.files[0]) {
        alert("Please upload at least one product image");
        return false;
    }
    
    console.log("Form validation passed");
    return true;
}

// Search products function
function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        const productName = row.querySelector('.product-title').textContent.toLowerCase();
        const category = row.querySelector('.category-badge').textContent.toLowerCase();
        const material = row.querySelector('.material-cell')?.textContent?.toLowerCase() || '';
        
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
    console.log("Products page loaded");
    
    // Set founderId from server-side member data when page loads
    if (window.memberData && window.memberData._id) {
        $(".founder-id").val(window.memberData._id);
        console.log("FounderId set to:", window.memberData._id);
    } else {
        console.warn("No member data found");
    }
    
    // Show/hide product form
    $("#process-btn").on("click", () => {
        console.log("Add New Product button clicked");
        $(".dish-container").slideDown(500);
        $("#process-btn").hide();
    });

    $("#cancel-btn").on("click", () => {
        console.log("Cancel button clicked");
        $(".dish-container").slideUp(300);
        $("#process-btn").show();
        
        // Reset form
        $(".modern-form")[0].reset();
        
        // Reset image previews
        for(let i = 1; i <= 5; i++) {
            $(`#image-section-${i}`).attr("src", "/img/upload.svg");
        }
    });

    // Update product process codes 
    $(".new-product-status").on("change", async function(e) {
        const id = e.target.id;
        const productStatus = e.target.value;

        console.log("Updating product status - id:", id, "status:", productStatus);

        try {
            const response = await axios.post(`/admin/product/${id}`, 
                {productStatus: productStatus});
            console.log("Product status update response:", response);
            
            const result = response.data;
            if(result.data){
                console.log("Product updated!");
                $(".new-product-status").blur();
                alert("Product status updated successfully!");
            } else {
                alert("Product update failed!");
            }
        } catch (err) {
            console.error("Product status update error:", err);
            alert("ProductStatus update failed!");
        }
    });
    
    // Form submission handling
    $(".modern-form").on("submit", function(e) {
        console.log("Form submission started");
        
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
        
        // Show loading state
        $("#create-btn").prop("disabled", true).html('<i class="btn-icon">⏳</i> Creating...');
        
        console.log("Form submitted successfully");
        return true;
    });
});

// Image codes for add for button 
function previewFileHandler(input, order) {
    console.log("Image preview handler called for order:", order);
    
    const imgClassName = input.className;
    console.log("input:", input);

    // Corrected jQuery selector and used backticks for string interpolation
    const file = $(`.${imgClassName}`).get(0).files[0];
    
    if (!file) {
        console.log("No file selected");
        return;
    }
    
    const fileType = file["type"];
    const fileSize = file.size;
    
    console.log("File info:", { name: file.name, type: fileType, size: fileSize });
    
    // Check file size (limit to 5MB)
    if (fileSize > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        input.value = ""; // Clear the input
        return;
    }
    
    // Ensure the variable is properly declared before usage
    const validImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

    if (!validImageTypes.includes(fileType)) {
        alert("Please insert only jpeg, jpg, png, or webp images");
        input.value = ""; // Clear the input
        $(`#image-section-${order}`).attr("src", "/img/upload.svg"); // Reset preview
    } else {
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                $(`#image-section-${order}`).attr("src", reader.result);
                console.log(`Image ${order} preview updated`);
            };
            reader.readAsDataURL(file);
        }
    }
}




