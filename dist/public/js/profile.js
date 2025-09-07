console.log("Profile upload - NEW VERSION");

document.addEventListener('DOMContentLoaded', function() {
    const profileImageInput = document.getElementById('profile-image-input');
    const fileNameSpan = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload-btn');
    const profileImageDisplay = document.getElementById('profile-image-display');
    const profileForm = document.getElementById('profile-image-form');

    console.log("Profile elements found:", {
        profileImageInput: !!profileImageInput,
        fileNameSpan: !!fileNameSpan,
        uploadBtn: !!uploadBtn,
        profileImageDisplay: !!profileImageDisplay,
        profileForm: !!profileForm
    });

    if (!profileForm) {
        console.error("Profile form not found!");
        return;
    }

    // Handle file selection with vanilla JavaScript
    profileImageInput.addEventListener('change', function() {
        const file = this.files[0];
        console.log("File selected:", file);
        
        if (!file) {
            fileNameSpan.textContent = '';
            uploadBtn.disabled = true;
            return;
        }

        // Validate file type
        const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        if (!validImageTypes.includes(file.type)) {
            alert('Please select only JPEG, JPG, or PNG files!');
            this.value = '';
            fileNameSpan.textContent = '';
            uploadBtn.disabled = true;
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB!');
            this.value = '';
            fileNameSpan.textContent = '';
            uploadBtn.disabled = true;
            return;
        }

        // Display file name and enable upload button
        fileNameSpan.textContent = file.name;
        uploadBtn.disabled = false;

        // Preview the image
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImageDisplay.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Handle form submission with vanilla JavaScript
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = profileImageInput.files[0];
        if (!file) {
            alert('Please select an image first!');
            return;
        }

        console.log('🔥 UPLOADING FILE:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Create FormData object with EXACT field name
        const formData = new FormData();
        formData.append('memberImage', file);  // CRITICAL: This must be 'memberImage'
        
        // Debug: Verify FormData contents
        console.log('📤 FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value);
        }

        // Show loading state
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        // Upload using fetch API (more reliable than axios)
        fetch('/member/update-image', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('📥 Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('✅ Upload success:', data);
            alert('Profile image updated successfully!');
            
            // Update the displayed image
            if (data.member && data.member.memberImage) {
                profileImageDisplay.src = '/' + data.member.memberImage;
            }
            
            // Reset form
            profileForm.reset();
            fileNameSpan.textContent = '';
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Update Image';
        })
        .catch(error => {
            console.error('❌ Upload error:', error);
            alert('Failed to update profile image: ' + error.message);
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Update Image';
        });
    });
}); 