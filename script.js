document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const itemList = document.getElementById('itemList');
    const newItemInput = document.getElementById('newItemInput');
    const addItemBtn = document.getElementById('addItemBtn');
    const parentItemSelect = document.getElementById('parentItemSelect');
    const newSubitemInput = document.getElementById('newSubitemInput');
    const addSubitemBtn = document.getElementById('addSubitemBtn');
    const emptyState = document.getElementById('emptyState');
    const contextMenu = document.getElementById('contextMenu');
    const addSubitemCtxBtn = document.getElementById('addSubitemCtxBtn');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const editModal = document.getElementById('editModal');
    const editInput = document.getElementById('editInput');
    const modalTitle = document.getElementById('modalTitle');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const deleteModal = document.getElementById('deleteModal');
    const deleteConfirmText = document.getElementById('deleteConfirmText');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const createFormBtn = document.getElementById('createFormBtn');
    const formspreeUrlInput = document.getElementById('formspreeUrlInput');
    const newItemImageInput = document.getElementById('newItemImageInput');
    const newSubitemImageInput = document.getElementById('newSubitemImageInput');

    // Initialize with your Excel data
    let items = [
        {
            id: '1',
            text: 'Rice',
            subitems: [
                { id: '1-1', text: 'Aaram (Green)' },
                { id: '1-2', text: 'Aaram (White)' },
                { id: '1-3', text: 'Local Sornamasori' },
                { id: '1-4', text: 'Other' }
            ]
        },
        {
            id: '2',
            text: 'Milk',
            subitems: [
                { id: '2-1', text: 'Amul Taaza (1L)' },
                { id: '2-2', text: 'Amul Taaza (500g)' },
                { id: '2-3', text: 'Amul Taaza (250g)' }
            ]
        },
        {
            id: '3',
            text: 'Dal',
            subitems: [
                { id: '3-1', text: 'Moong' },
                { id: '3-2', text: 'Masoor (Angoor)' },
                { id: '3-3', text: 'Boot' },
                { id: '3-4', text: 'Motor' }
            ]
        },
        {
            id: '4',
            text: 'Cooking Oil',
            subitems: [
                { id: '4-1', text: 'Engine' },
                { id: '4-2', text: 'Fortune Soyabean oil' }
            ]
        },
        {
            id: '5',
            text: 'Salt',
            subitems: [
                { id: '5-1', text: 'Tata' }
            ]
        },
        {
            id: '6',
            text: 'Muri',
            subitems: []
        },
        {
            id: '7',
            text: 'Chira',
            subitems: []
        },
        {
            id: '8',
            text: 'Potatoes',
            subitems: []
        },
        {
            id: '9',
            text: 'Onions',
            subitems: []
        },
        {
            id: '10',
            text: 'Rosun',
            subitems: []
        },
        {
            id: '11',
            text: 'Ginger(aadha)',
            subitems: []
        },
        {
            id: '12',
            text: 'Powder',
            subitems: [
                { id: '12-1', text: 'Jeera (250g)' },
                { id: '12-2', text: 'Jeera (100g)' },
                { id: '12-3', text: 'Dhanna (250g)' }
            ]
        },
        {
            id: '13',
            text: 'Miscellaneous',
            subitems: []
        }
    ];

    let selectedItemId = null;
    let selectedItemIsParent = false;
    let selectedItemText = '';

    // Render the item list
    function renderItems() {
        itemList.innerHTML = '';
        parentItemSelect.innerHTML = '<option value="">Select parent item...</option>';
        if (items.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        items.forEach(item => {
            // Add to parent item dropdown
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.text;
            parentItemSelect.appendChild(option);
            // Create main item
            const li = document.createElement('li');
            li.classList.add('item-header');
            li.dataset.id = item.id;
            // Add text first
            li.appendChild(document.createTextNode(item.text));
            // Add images (right side)
            if (item.images && Array.isArray(item.images)) {
                const imgWrap = document.createElement('span');
                imgWrap.style.float = 'right';
                imgWrap.style.display = 'flex';
                imgWrap.style.gap = '4px';
                item.images.forEach(img => {
                    const im = document.createElement('img');
                    im.src = img;
                    im.alt = 'item image';
                    im.style.width = '32px';
                    im.style.height = '32px';
                    im.style.objectFit = 'cover';
                    im.style.borderRadius = '6px';
                    im.style.cursor = 'pointer';
                    im.onclick = () => showZoomModal(img);
                    imgWrap.appendChild(im);
                });
                li.appendChild(imgWrap);
            }
            li.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                selectedItemId = item.id;
                selectedItemIsParent = true;
                selectedItemText = item.text;
                showContextMenu(e);
            });
            itemList.appendChild(li);
            // Add subitems if they exist
            if (item.subitems && item.subitems.length > 0) {
                item.subitems.forEach(subitem => {
                    const subLi = document.createElement('li');
                    subLi.classList.add('subitem');
                    subLi.dataset.id = subitem.id;
                    subLi.dataset.parentId = item.id;
                    subLi.appendChild(document.createTextNode(subitem.text));
                    // Add images (right side)
                    if (subitem.images && Array.isArray(subitem.images)) {
                        const imgWrap = document.createElement('span');
                        imgWrap.style.float = 'right';
                        imgWrap.style.display = 'flex';
                        imgWrap.style.gap = '4px';
                        subitem.images.forEach(img => {
                            const im = document.createElement('img');
                            im.src = img;
                            im.alt = 'subitem image';
                            im.style.width = '28px';
                            im.style.height = '28px';
                            im.style.objectFit = 'cover';
                            im.style.borderRadius = '6px';
                            im.style.cursor = 'pointer';
                            im.onclick = () => showZoomModal(img);
                            imgWrap.appendChild(im);
                        });
                        subLi.appendChild(imgWrap);
                    }
                    subLi.addEventListener('contextmenu', function(e) {
                        e.preventDefault();
                        selectedItemId = subitem.id;
                        selectedItemIsParent = false;
                        selectedItemText = subitem.text;
                        showContextMenu(e);
                    });
                    itemList.appendChild(subLi);
                });
            }
        });
    }

    // Show context menu
    function showContextMenu(e) {
        contextMenu.style.display = 'block';
        // Use pageX and pageY for accurate positioning
        const x = e.pageX;
        const y = e.pageY;
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        // Adjust position if near edge of window
        const adjustedX = x + menuWidth > windowWidth ? x - menuWidth : x;
        const adjustedY = y + menuHeight > windowHeight ? y - menuHeight : y;
        contextMenu.style.left = `${adjustedX}px`;
        contextMenu.style.top = `${adjustedY}px`;
        // Hide menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('mousedown', hideContextMenu, { once: true });
        }, 0);
    }
    // Hide context menu
    function hideContextMenu(e) {
        // Only hide if click is outside the menu
        if (!e || !contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    }

    // Show edit modal
    function showEditModal(isParent, currentText, currentImage) {
        modalTitle.textContent = isParent ? 'Edit Main Item' : 'Edit Subitem';
        editInput.value = currentText;
        // Add image input to modal if not present
        let imageInput = document.getElementById('editImageInput');
        if (!imageInput) {
            imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.accept = 'image/*';
            imageInput.id = 'editImageInput';
            imageInput.style.marginTop = '12px';
            editInput.parentNode.insertBefore(imageInput, editInput.nextSibling);
        }
        // Show current image if exists
        let preview = document.getElementById('editImagePreview');
        if (!preview) {
            preview = document.createElement('img');
            preview.id = 'editImagePreview';
            preview.style.display = 'block';
            preview.style.marginTop = '8px';
            preview.style.maxWidth = '80px';
            preview.style.maxHeight = '80px';
            editInput.parentNode.insertBefore(preview, imageInput.nextSibling);
        }
        if (currentImage) {
            preview.src = currentImage;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
        editModal.style.display = 'flex';
    }
    // Hide edit modal
    function hideEditModal() {
        editModal.style.display = 'none';
    }
    // Show delete confirmation modal
    function showDeleteModal(isParent, itemText) {
        const itemType = isParent ? 'main item' : 'subitem';
        deleteConfirmText.textContent = `Are you sure you want to delete this ${itemType}? "${itemText}"`;
        deleteModal.style.display = 'flex';
    }
    // Hide delete confirmation modal
    function hideDeleteModal() {
        deleteModal.style.display = 'none';
    }
    // Add new main item
    function addItem() {
        const text = newItemInput.value.trim();
        if (text === '') return;
        // Check for duplicate (case-insensitive)
        const exists = items.some(item => item.text.trim().toLowerCase() === text.toLowerCase());
        if (exists) {
            alert('An item with the same name already exists!');
            return;
        }
        // Handle image
        const file = newItemImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newItem = {
                    id: Date.now().toString(),
                    text: text,
                    subitems: [],
                    image: e.target.result
                };
                items.push(newItem);
                newItemInput.value = '';
                newItemImageInput.value = '';
                saveItemsToStorage();
                renderItems();
            };
            reader.readAsDataURL(file);
        } else {
            const newItem = {
                id: Date.now().toString(),
                text: text,
                subitems: []
            };
            items.push(newItem);
            newItemInput.value = '';
            newItemImageInput.value = '';
            saveItemsToStorage();
            renderItems();
        }
    }
    // Add subitem to selected parent item
    function addSubitem() {
        const parentId = parentItemSelect.value;
        const text = newSubitemInput.value.trim();
        if (!parentId || text === '') return;
        const parentItem = items.find(item => item.id === parentId);
        if (!parentItem) return;
        // Check for duplicate subitem (case-insensitive)
        const exists = parentItem.subitems.some(sub => sub.text.trim().toLowerCase() === text.toLowerCase());
        if (exists) {
            alert('A subitem with the same name already exists for this item!');
            return;
        }
        const files = Array.from(newSubitemImageInput.files).slice(0,5);
        if (files.length > 0) {
            const readers = files.map(f => new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(f); }));
            Promise.all(readers).then(imgs => {
                const newSubitem = {
                    id: `${parentId}-${Date.now()}`,
                    text: text,
                    images: imgs
                };
                newSubitemInput.value = '';
                newSubitemImageInput.value = '';
                parentItem.subitems.push(newSubitem);
                saveItemsToStorage();
                renderItems();
            });
        } else {
            const newSubitem = {
                id: `${parentId}-${Date.now()}`,
                text: text
            };
            newSubitemInput.value = '';
            newSubitemImageInput.value = '';
            parentItem.subitems.push(newSubitem);
            saveItemsToStorage();
            renderItems();
        }
    }
    // Add subitem via context menu
    function addSubitemViaContext() {
        if (!selectedItemId) return;
        // If selected item is a parent, use it as parent
        if (selectedItemIsParent) {
            parentItemSelect.value = selectedItemId;
            newSubitemInput.focus();
        } else {
            const subitemElement = document.querySelector(`[data-id="${selectedItemId}"]`);
            if (subitemElement) {
                const parentId = subitemElement.dataset.parentId;
                parentItemSelect.value = parentId;
                newSubitemInput.focus();
            }
        }
        hideContextMenu();
    }
    // Edit selected item or subitem
    function editItem() {
        if (!selectedItemId) return;
        if (selectedItemIsParent) {
            const item = items.find(i => i.id === selectedItemId);
            if (item) {
                showEditModal(true, item.text, item.image);
            }
        } else {
            for (const item of items) {
                const subitem = item.subitems.find(s => s.id === selectedItemId);
                if (subitem) {
                    showEditModal(false, subitem.text, subitem.image);
                    break;
                }
            }
        }
        hideContextMenu();
    }
    // Show edit modal
    function showEditModal(isParent, currentText, currentImages) {
        modalTitle.textContent = isParent ? 'Edit Main Item' : 'Edit Subitem';
        editInput.value = currentText;
        // Add image input to modal if not present
        let imageInput = document.getElementById('editImageInput');
        if (!imageInput) {
            imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.accept = 'image/*';
            imageInput.id = 'editImageInput';
            imageInput.multiple = true;
            imageInput.style.marginTop = '12px';
            editInput.parentNode.insertBefore(imageInput, editInput.nextSibling);
        }
        // Show current images if exist
        let preview = document.getElementById('editImagePreview');
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'editImagePreview';
            preview.style.display = 'flex';
            preview.style.gap = '6px';
            preview.style.marginTop = '8px';
            editInput.parentNode.insertBefore(preview, imageInput.nextSibling);
        }
        preview.innerHTML = '';
        if (currentImages && Array.isArray(currentImages) && currentImages.length) {
            currentImages.forEach(img => {
                const im = document.createElement('img');
                im.src = img;
                im.style.maxWidth = '48px';
                im.style.maxHeight = '48px';
                im.style.borderRadius = '6px';
                im.style.cursor = 'pointer';
                im.onclick = () => {
                    // Show zoom modal (reuse main modal if available)
                    const modal = document.getElementById('imgZoomModal');
                    const modalImg = document.getElementById('imgZoomModalImg');
                    if (modal && modalImg) {
                        modalImg.src = img;
                        modal.classList.add('active');
                    }
                };
                preview.appendChild(im);
            });
            preview.style.display = 'flex';
        } else {
            preview.style.display = 'none';
        }
        editModal.style.display = 'flex';
    }
    // Hide edit modal
    function hideEditModal() {
        editModal.style.display = 'none';
    }
    // Save edited text and images
    function saveEditedItem() {
        const newText = editInput.value.trim();
        const imageInput = document.getElementById('editImageInput');
        const preview = document.getElementById('editImagePreview');
        if (!newText || !selectedItemId) {
            hideEditModal();
            return;
        }
        function updateAndRender(imagesData) {
            if (selectedItemIsParent) {
                const item = items.find(i => i.id === selectedItemId);
                if (item) {
                    item.text = newText;
                    if (imagesData !== undefined) item.images = imagesData;
                }
            } else {
                for (const item of items) {
                    const subitem = item.subitems.find(s => s.id === selectedItemId);
                    if (subitem) {
                        subitem.text = newText;
                        if (imagesData !== undefined) subitem.images = imagesData;
                        break;
                    }
                }
            }
            saveItemsToStorage();
            hideEditModal();
            renderItems();
        }
        if (imageInput && imageInput.files && imageInput.files.length > 0) {
            const files = Array.from(imageInput.files).slice(0,5);
            const readers = files.map(f => new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(f); }));
            Promise.all(readers).then(imgs => {
                updateAndRender(imgs);
            });
        } else {
            // If preview is hidden, remove images
            if (preview && preview.style.display === 'none') {
                updateAndRender([]);
            } else {
                updateAndRender();
            }
        }
    }
    // Delete selected item or subitem
    function deleteItem() {
        if (!selectedItemId) return;
        showDeleteModal(selectedItemIsParent, selectedItemText);
        hideContextMenu();
    }
    // Confirm deletion
    function confirmDelete() {
        if (!selectedItemId) {
            hideDeleteModal();
            return;
        }
        if (selectedItemIsParent) {
            // Delete main item (and all its subitems)
            items = items.filter(item => item.id !== selectedItemId);
        } else {
            // Delete subitem
            for (const item of items) {
                item.subitems = item.subitems.filter(sub => sub.id !== selectedItemId);
            }
        }
        saveItemsToStorage();
        hideDeleteModal();
        renderItems();
    }
    // Add Create Form button logic
    function openCustomerForm() {
        const formspreeUrl = formspreeUrlInput.value.trim();
        if (!formspreeUrl || !/^https:\/\/formspree\.io\//.test(formspreeUrl)) {
            alert('Please enter a valid Formspree URL.');
            formspreeUrlInput.focus();
            return;
        }
        // Build the form HTML (without Download button)
        let baseFormHtml = `<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Order Form</title><link rel='stylesheet' href='style.css'><style>
body { background: #f4f6fb; margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; }
.container { max-width: 480px; margin: 36px auto; background: #fff; border-radius: 14px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); padding: 32px 20px 24px 20px; }
h2 { text-align: center; color: #222; margin-bottom: 18px; font-weight: 600; letter-spacing: 0.5px; }
label { font-weight: 500; color: #333; display: block; margin-top: 22px; margin-bottom: 6px; font-size: 1rem; }
.main-label { font-size: 1.08rem; color: #1a237e; margin-top: 28px; margin-bottom: 0; }
.subitem-label { margin-left: 18px; color: #555; font-size: 0.98rem; margin-top: 12px; margin-bottom: 0; }
input[type=text], input[type=tel] { width: 100%; padding: 12px; margin-top: 4px; margin-bottom: 8px; border: 1.5px solid #e0e0e0; border-radius: 6px; font-size: 1rem; background: #fafbfc; transition: border 0.2s; }
input[type=text]:focus, input[type=tel]:focus { border: 1.5px solid #1976d2; outline: none; background: #fff; }
.img-thumb { display:inline-block; vertical-align:middle; margin-left:8px; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.08); background:#fafafa; max-width:48px; max-height:48px; cursor: zoom-in; }
.img-zoom-modal { display:none; position:fixed; z-index:2000; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); justify-content:center; align-items:center; }
.img-zoom-modal.active { display:flex; }
.img-zoom-modal img { display:block; width:auto; height:auto; max-width:none; max-height:none; border-radius:0; box-shadow:0 8px 32px rgba(0,0,0,0.25); background:#fff; margin:0 auto; border:2px solid #fff; }
.img-zoom-modal .close-btn { position:absolute; top:18px; right:24px; font-size:2.2rem; color:#fff; background:none; border:none; cursor:pointer; z-index:2010; }
@media(max-width:600px){ .container{padding:12px 4vw;} }
.submit-btn {
  width: 100%;
  margin: 24px 0 0 0;
  padding: 16px 0;
  font-size: 1.18rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(24,90,157,0.13);
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.22s, transform 0.15s, box-shadow 0.22s;
  outline: none;
  text-align: center;
  position: relative;
  animation: fadeInBtn 0.6s cubic-bezier(.4,2,.6,1);
}
@keyframes fadeInBtn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.submit-btn:hover, .submit-btn:focus {
  background: linear-gradient(90deg, #185a9d 0%, #43cea2 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 8px 32px rgba(24,90,157,0.18);
  outline: none;
}
.submit-btn:active {
  background: linear-gradient(90deg, #185a9d 0%, #43cea2 100%);
  transform: scale(0.98);
}
</style></head><body><div class='container'><div style='color:#b71c1c;font-size:1.01em;margin-bottom:12px;text-align:center;'>Customers Have No Use of This 'Download form' Option. Fill the form below and submit to order your items.</div><h2>Order Form</h2><form id='orderForm' autocomplete='off' method='POST' action='${formspreeUrl}'>`;
        baseFormHtml += `<label for='customerName'>Name</label><input type='text' id='customerName' name='customerName' placeholder='Enter your name' required autocomplete='name'>`;
        baseFormHtml += `<label for='customerPhone'>Phone Number</label><input type='tel' id='customerPhone' name='customerPhone' placeholder='Enter your phone number' required autocomplete='tel'>`;
        baseFormHtml += `<label for='address'>Address</label><input type='text' id='address' name='address' placeholder='Enter your address' required autocomplete='street-address'>`;
        items.forEach(item => {
            function makeFieldName(label) {
                return label.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
            }
            if (item.subitems && item.subitems.length > 0) {
                baseFormHtml += `<label class='main-label'>`;
                if (item.images && Array.isArray(item.images)) {
                    item.images.forEach(img => { baseFormHtml += `<img src='${img}' class='img-thumb' alt='item image'>`; });
                } else if (item.image) {
                    baseFormHtml += `<img src='${item.image}' class='img-thumb' alt='item image'>`;
                }
                baseFormHtml += `${item.text}</label>`;
                item.subitems.forEach(subitem => {
                    const fieldName = makeFieldName(item.text + '_' + subitem.text);
                    baseFormHtml += `<label class='subitem-label'>`;
                    if (subitem.images && Array.isArray(subitem.images)) {
                        subitem.images.forEach(img => { baseFormHtml += `<img src='${img}' class='img-thumb' alt='subitem image'>`; });
                    } else if (subitem.image) {
                        baseFormHtml += `<img src='${subitem.image}' class='img-thumb' alt='subitem image'>`;
                    }
                    baseFormHtml += `${subitem.text}</label>`;
                    baseFormHtml += `<div class='input-row'><input type='text' name='${fieldName}' placeholder='Enter value for ${subitem.text}' autocomplete='off'></div>`;
                });
            } else {
                const fieldName = makeFieldName(item.text);
                baseFormHtml += `<label class='main-label'>`;
                if (item.images && Array.isArray(item.images)) {
                    item.images.forEach(img => { baseFormHtml += `<img src='${img}' class='img-thumb' alt='item image'>`; });
                } else if (item.image) {
                    baseFormHtml += `<img src='${item.image}' class='img-thumb' alt='item image'>`;
                }
                baseFormHtml += `${item.text}</label>`;
                baseFormHtml += `<div class='input-row'><input type='text' name='${fieldName}' placeholder='Enter value for ${item.text}' autocomplete='off'></div>`;
            }
        });
        baseFormHtml += `<button type='submit' class='submit-btn'>Submit</button></form>
        <div id='imgZoomModal' class='img-zoom-modal'><button class='close-btn' id='imgZoomCloseBtn' aria-label='Close'>&times;</button><img id='imgZoomModalImg' src='' alt='Zoomed image'></div>
        <script>
        // Image zoom modal logic
        var imgZoomModal=document.getElementById('imgZoomModal');
        var imgZoomModalImg=document.getElementById('imgZoomModalImg');
        var imgZoomCloseBtn=document.getElementById('imgZoomCloseBtn');
        function handleImageZoom(e){e.preventDefault();imgZoomModalImg.src=e.target.src;imgZoomModal.classList.add('active');}
        function closeImgZoomModal(){imgZoomModal.classList.remove('active');imgZoomModalImg.src='';}
        imgZoomCloseBtn.addEventListener('click',closeImgZoomModal);
        imgZoomModal.addEventListener('click',function(e){if(e.target===imgZoomModal)closeImgZoomModal();});
        document.querySelectorAll('.img-thumb').forEach(function(img){img.addEventListener('click',handleImageZoom);});
        <\/script></body></html>`;

        // Now, show the form in a popup with the Download button (not included in the downloadable HTML)
        let popupHtml = baseFormHtml.replace(
            "<div class='container'>",
            "<div class='container'><div style='text-align:center;'><button id='downloadBtn' class='download-btn'>Download Form</button></div>"
        );
        // Add preview-only submit handler to the popup (so only the preview has the custom JS)
        popupHtml = popupHtml.replace(
            '<\/script></body></html>',
            `\ndocument.getElementById('orderForm').addEventListener('submit',function(e){\n    e.preventDefault();\n    var form = e.target;\n    var data = {};\n    Array.from(form.elements).forEach(function(el){\n        if(el.name && el.value) data[el.name] = el.value;\n    });\n    if(window.opener){\n        window.opener.postMessage({type:'customer_order_submit',order:data},'*');\n    }\n    setTimeout(function(){alert('Order submitted! Thank you.');window.close();}, 500);\n});\n<\/script></body></html>`
        );
        const win = window.open('', '_blank');
        win.document.write(popupHtml);
        win.document.close();
        // Wait for popup to load, then add download logic
        win.onload = function() {
            const downloadBtn = win.document.getElementById('downloadBtn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function() {
                    // Download HTML without the Download button
                    const downloadHtml = baseFormHtml;
                    const blob = new Blob([downloadHtml], { type: 'text/html' });
                    const a = win.document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'order-form.html';
                    win.document.body.appendChild(a);
                    a.click();
                    setTimeout(()=>{win.document.body.removeChild(a);}, 100);
                });
            }
        };
    }

    // --- LocalStorage Auto-Save/Load ---
    const STORAGE_KEY = 'grocery_items_v1';
    function saveItemsToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) { /* ignore quota errors */ }
    }
    function loadItemsFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const loaded = JSON.parse(data);
                // Patch for multi-image support
                loaded.forEach(item => {
                    if (item.image && !item.images) item.images = [item.image];
                    if (item.images && !Array.isArray(item.images)) item.images = [item.images];
                    if (item.subitems) item.subitems.forEach(sub => {
                        if (sub.image && !sub.images) sub.images = [sub.image];
                        if (sub.images && !Array.isArray(sub.images)) sub.images = [sub.images];
                    });
                });
                items = loaded;
            }
        } catch (e) { /* ignore */ }
    }

    // --- Multi-image upload logic ---
    // Patch addItem and addSubitem to support up to 5 images
    function addItem() {
        const text = newItemInput.value.trim();
        if (text === '') return;
        // Check for duplicate (case-insensitive)
        const exists = items.some(item => item.text.trim().toLowerCase() === text.toLowerCase());
        if (exists) {
            alert('An item with the same name already exists!');
            return;
        }
        const files = Array.from(newItemImageInput.files).slice(0,5);
        if (files.length > 0) {
            const readers = files.map(f => new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(f); }));
            Promise.all(readers).then(imgs => {
                const newItem = {
                    id: Date.now().toString(),
                    text: text,
                    subitems: [],
                    images: imgs
                };
                newItemInput.value = '';
                newItemImageInput.value = '';
                items.push(newItem);
                saveItemsToStorage();
                renderItems();
            });
        } else {
            const newItem = {
                id: Date.now().toString(),
                text: text,
                subitems: []
            };
            newItemInput.value = '';
            newItemImageInput.value = '';
            items.push(newItem);
            saveItemsToStorage();
            renderItems();
        }
    }
    function addSubitem() {
        const parentId = parentItemSelect.value;
        const text = newSubitemInput.value.trim();
        if (!parentId || text === '') return;
        const parentItem = items.find(item => item.id === parentId);
        if (!parentItem) return;
        // Check for duplicate subitem (case-insensitive)
        const exists = parentItem.subitems.some(sub => sub.text.trim().toLowerCase() === text.toLowerCase());
        if (exists) {
            alert('A subitem with the same name already exists for this item!');
            return;
        }
        const files = Array.from(newSubitemImageInput.files).slice(0,5);
        if (files.length > 0) {
            const readers = files.map(f => new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(f); }));
            Promise.all(readers).then(imgs => {
                const newSubitem = {
                    id: `${parentId}-${Date.now()}`,
                    text: text,
                    images: imgs
                };
                newSubitemInput.value = '';
                newSubitemImageInput.value = '';
                parentItem.subitems.push(newSubitem);
                saveItemsToStorage();
                renderItems();
            });
        } else {
            const newSubitem = {
                id: `${parentId}-${Date.now()}`,
                text: text
            };
            newSubitemInput.value = '';
            newSubitemImageInput.value = '';
            parentItem.subitems.push(newSubitem);
            saveItemsToStorage();
            renderItems();
        }
    }
    // Patch edit modal for multi-image
    function showEditModal(isParent, currentText, currentImages) {
        modalTitle.textContent = isParent ? 'Edit Main Item' : 'Edit Subitem';
        editInput.value = currentText;
        // Add image input to modal if not present
        let imageInput = document.getElementById('editImageInput');
        if (!imageInput) {
            imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.accept = 'image/*';
            imageInput.id = 'editImageInput';
            imageInput.multiple = true;
            imageInput.style.marginTop = '12px';
            editInput.parentNode.insertBefore(imageInput, editInput.nextSibling);
        }
        // Show current images if exist
        let preview = document.getElementById('editImagePreview');
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'editImagePreview';
            preview.style.display = 'flex';
            preview.style.gap = '6px';
            preview.style.marginTop = '8px';
            editInput.parentNode.insertBefore(preview, imageInput.nextSibling);
        }
        preview.innerHTML = '';
        if (currentImages && Array.isArray(currentImages) && currentImages.length) {
            currentImages.forEach(img => {
                const im = document.createElement('img');
                im.src = img;
                im.style.maxWidth = '48px';
                im.style.maxHeight = '48px';
                im.style.borderRadius = '6px';
                im.style.cursor = 'pointer';
                im.onclick = () => {
                    // Show zoom modal (reuse main modal if available)
                    const modal = document.getElementById('imgZoomModal');
                    const modalImg = document.getElementById('imgZoomModalImg');
                    if (modal && modalImg) {
                        modalImg.src = img;
                        modal.classList.add('active');
                    }
                };
                preview.appendChild(im);
            });
            preview.style.display = 'flex';
        } else {
            preview.style.display = 'none';
        }
        editModal.style.display = 'flex';
    }
    // Hide edit modal
    function hideEditModal() {
        editModal.style.display = 'none';
    }
    // --- Render items with images right-aligned ---
    function renderItems() {
        itemList.innerHTML = '';
        parentItemSelect.innerHTML = '<option value="">Select parent item...</option>';
        if (items.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        items.forEach(item => {
            // Add to parent item dropdown
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.text;
            parentItemSelect.appendChild(option);
            // Create main item
            const li = document.createElement('li');
            li.classList.add('item-header');
            li.dataset.id = item.id;
            // Add text first
            li.appendChild(document.createTextNode(item.text));
            // Add images (right side)
            if (item.images && Array.isArray(item.images)) {
                const imgWrap = document.createElement('span');
                imgWrap.style.float = 'right';
                imgWrap.style.display = 'flex';
                imgWrap.style.gap = '4px';
                item.images.forEach(img => {
                    const im = document.createElement('img');
                    im.src = img;
                    im.alt = 'item image';
                    im.style.width = '32px';
                    im.style.height = '32px';
                    im.style.objectFit = 'cover';
                    im.style.borderRadius = '6px';
                    im.style.cursor = 'pointer';
                    im.onclick = () => showZoomModal(img);
                    imgWrap.appendChild(im);
                });
                li.appendChild(imgWrap);
            }
            li.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                selectedItemId = item.id;
                selectedItemIsParent = true;
                selectedItemText = item.text;
                showContextMenu(e);
            });
            itemList.appendChild(li);
            // Add subitems if they exist
            if (item.subitems && item.subitems.length > 0) {
                item.subitems.forEach(subitem => {
                    const subLi = document.createElement('li');
                    subLi.classList.add('subitem');
                    subLi.dataset.id = subitem.id;
                    subLi.dataset.parentId = item.id;
                    subLi.appendChild(document.createTextNode(subitem.text));
                    // Add images (right side)
                    if (subitem.images && Array.isArray(subitem.images)) {
                        const imgWrap = document.createElement('span');
                        imgWrap.style.float = 'right';
                        imgWrap.style.display = 'flex';
                        imgWrap.style.gap = '4px';
                        subitem.images.forEach(img => {
                            const im = document.createElement('img');
                            im.src = img;
                            im.alt = 'subitem image';
                            im.style.width = '28px';
                            im.style.height = '28px';
                            im.style.objectFit = 'cover';
                            im.style.borderRadius = '6px';
                            im.style.cursor = 'pointer';
                            im.onclick = () => showZoomModal(img);
                            imgWrap.appendChild(im);
                        });
                        subLi.appendChild(imgWrap);
                    }
                    subLi.addEventListener('contextmenu', function(e) {
                        e.preventDefault();
                        selectedItemId = subitem.id;
                        selectedItemIsParent = false;
                        selectedItemText = subitem.text;
                        showContextMenu(e);
                    });
                    itemList.appendChild(subLi);
                });
            }
        });
    }
    // --- Zoom modal for main page ---
    function showZoomModal(imgSrc) {
        let modal = document.getElementById('imgZoomModal');
        let modalImg = document.getElementById('imgZoomModalImg');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'imgZoomModal';
            modal.className = 'img-zoom-modal';
            modal.innerHTML = `<button class='close-btn' id='imgZoomCloseBtn' aria-label='Close'>&times;</button><img id='imgZoomModalImg' src='' alt='Zoomed image'>`;
            document.body.appendChild(modal);
            document.getElementById('imgZoomCloseBtn').onclick = function() {
                modal.classList.remove('active');
                modalImg.src = '';
            };
            modal.onclick = function(e) { if (e.target === modal) { modal.classList.remove('active'); modalImg.src = ''; } };
            modalImg = document.getElementById('imgZoomModalImg');
        }
        modalImg.src = imgSrc;
        modal.classList.add('active');
    }
    // --- Add multi-image support to input fields ---
    newItemImageInput.setAttribute('multiple', 'multiple');
    newItemImageInput.setAttribute('max', '5');
    newSubitemImageInput.setAttribute('multiple', 'multiple');
    newSubitemImageInput.setAttribute('max', '5');

    // --- Orders display logic ---
    let ordersBtn = document.getElementById('ordersBtn');
    if (!ordersBtn) {
        ordersBtn = document.createElement('button');
        ordersBtn.id = 'ordersBtn';
        ordersBtn.textContent = 'Current orders';
        ordersBtn.style.display = 'block';
        ordersBtn.style.margin = '24px auto 0 auto';
        ordersBtn.style.background = '#1976d2';
        ordersBtn.style.color = '#fff';
        ordersBtn.style.border = 'none';
        ordersBtn.style.borderRadius = '8px';
        ordersBtn.style.padding = '12px 32px';
        ordersBtn.style.fontSize = '1.08rem';
        ordersBtn.style.fontWeight = '600';
        ordersBtn.style.boxShadow = '0 2px 8px rgba(25,118,210,0.08)';
        ordersBtn.style.cursor = 'pointer';
        ordersBtn.style.transition = 'background 0.2s';
        ordersBtn.onmouseover = function() { ordersBtn.style.background = '#1251a3'; };
        ordersBtn.onmouseout = function() { ordersBtn.style.background = '#1976d2'; };
        document.body.appendChild(ordersBtn);
    }
    let ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) {
        ordersContainer = document.createElement('div');
        ordersContainer.id = 'ordersContainer';
        ordersContainer.style.maxWidth = '1200px';
        ordersContainer.style.margin = '32px auto';
        ordersContainer.style.display = 'none';
        document.body.appendChild(ordersContainer);
    }
    ordersBtn.onclick = function() {
        window.location.href = 'orders.html';
    };
    // Helper: Convert order object to CSV string
    function orderToCSV(order) {
        let csv = 'Field,Value\n';
        for (const key in order) {
            if (order.hasOwnProperty(key)) {
                csv += `"${key}","${order[key]}"\n`;
            }
        }
        return csv;
    }

    // Show order summary modal (View)
    function showOrderSummaryModal(order, idx) {
        // ...existing code for showing order summary modal...
        // Add "+ Add Item" button that calls openOrderFormPopup(order, idx)
    }

    // Open order form as popup/modal for editing (Edit/Add Item)
    function openOrderFormPopup(order, idx) {
        // ...existing code for showing order form as popup, pre-filled with order data...
        // On submit, update localStorage and refresh cards
    }

    // On load, restore items
    loadItemsFromStorage();

    // --- Save customer order to localStorage on form submit ---
    // Listen for messages from the order form window
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'customer_order_submit') {
            // Save order to localStorage
            let orders = JSON.parse(localStorage.getItem('customer_orders')||'[]');
            event.data.order._date = new Date().toISOString();
            orders.push(event.data.order);
            localStorage.setItem('customer_orders', JSON.stringify(orders));
            // Optionally, refresh the orders view if open
            if (ordersContainer && ordersContainer.style.display !== 'none') {
                ordersBtn.click();
            }
        }
    });

    if(createFormBtn){createFormBtn.addEventListener('click',openCustomerForm);}
    addItemBtn.addEventListener('click', addItem);
    newItemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addItem();
    });
    addSubitemBtn.addEventListener('click', addSubitem);
    newSubitemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addSubitem();
    });
    addSubitemCtxBtn.addEventListener('click', addSubitemViaContext);
    editBtn.addEventListener('click', editItem);
    deleteBtn.addEventListener('click', deleteItem);
    cancelEditBtn.addEventListener('click', hideEditModal);
    saveEditBtn.addEventListener('click', saveEditedItem);
    cancelDeleteBtn.addEventListener('click', hideDeleteModal);
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    // Close modals when clicking outside
    editModal.addEventListener('mousedown', function(e) {
        if (e.target === editModal) {
            hideEditModal();
        }
    });
    deleteModal.addEventListener('mousedown', function(e) {
        if (e.target === deleteModal) {
            hideDeleteModal();
        }
    });
    // --- Image zoom modal for all devices ---
    const imgZoomModal = document.getElementById('imgZoomModal');
    const imgZoomModalImg = document.getElementById('imgZoomModalImg');
    const imgZoomCloseBtn = document.getElementById('imgZoomCloseBtn');

    function handleImageZoom(e) {
        e.preventDefault();
        imgZoomModalImg.src = e.target.src;
        imgZoomModal.classList.add('active');
    }
    function closeImgZoomModal() {
        imgZoomModal.classList.remove('active');
        imgZoomModalImg.src = '';
    }
    imgZoomCloseBtn.addEventListener('click', closeImgZoomModal);
    imgZoomModal.addEventListener('click', function(e) {
        if (e.target === imgZoomModal) closeImgZoomModal();
    });
    // Patch renderItems to add tap/click-to-zoom for images
    const origRenderItems = renderItems;
    renderItems = function() {
        origRenderItems();
        document.querySelectorAll('.item-header img, .subitem img').forEach(img => {
            img.addEventListener('click', handleImageZoom);
        });
    };
    // Initial render
    renderItems();

    // === Item Manager Feature (Isolated, does not affect existing logic) ===
    (function(){
      const container = document.getElementById('itemManagerContainer');
      if (!container) return;
      let items = [];
      try {
        items = JSON.parse(localStorage.getItem('grocery_items_v1')||'[]');
      } catch(e) { items = []; }
      let html = '';
      items.forEach((item, idx) => {
        html += `<div class='item-manager-card' style='border:1px solid #e0e0e0;border-radius:8px;padding:14px 18px 10px 18px;margin-bottom:14px;background:rgba(255,255,255,0.98);box-shadow:0 2px 8px rgba(44,62,80,0.04);transition:box-shadow 0.22s,transform 0.18s;'>`;
        html += `<div style='font-weight:600;font-size:1.1em;margin-bottom:8px;'>${item.text}</div>`;
        if (item.subitems && item.subitems.length > 0) {
          item.subitems.forEach((sub, sidx) => {
            html += `<div style='margin-left:18px;margin-bottom:8px;display:flex;align-items:center;gap:8px;'>`;
            html += `<span style='font-weight:500;'>${sub.text}</span>`;
            html += `<input type='number' step='0.01' min='0' class='wholesale-price-input' data-item='${idx}' data-sub='${sidx}' placeholder='Wholesale Price' value='${sub.wholesalePrice||''}' style='width:110px;'>`;
            html += `<select class='unit-select' data-item='${idx}' data-sub='${sidx}' data-type='wholesale'></select>`;
            html += `<input type='number' step='0.01' min='0' class='customer-price-input' data-item='${idx}' data-sub='${sidx}' placeholder='Customer Price' value='${sub.customerPrice||''}' style='width:110px;margin-left:8px;'>`;
            html += `<select class='unit-select' data-item='${idx}' data-sub='${sidx}' data-type='customer'></select>`;
            html += `<button class='save-price-btn' data-item='${idx}' data-sub='${sidx}' title='Save Prices'>💾</button>`;
            html += `</div>`;
          });
        } else {
          html += `<div style='margin-bottom:8px;display:flex;align-items:center;gap:8px;'>`;
          html += `<input type='number' step='0.01' min='0' class='wholesale-price-input' data-item='${idx}' placeholder='Wholesale Price' value='${item.wholesalePrice||''}' style='width:110px;'>`;
          html += `<select class='unit-select' data-item='${idx}' data-type='wholesale'></select>`;
          html += `<input type='number' step='0.01' min='0' class='customer-price-input' data-item='${idx}' placeholder='Customer Price' value='${item.customerPrice||''}' style='width:110px;margin-left:8px;'>`;
          html += `<select class='unit-select' data-item='${idx}' data-type='customer'></select>`;
          html += `<button class='save-price-btn' data-item='${idx}' title='Save Prices'>💾</button>`;
          html += `</div>`;
        }
        html += `</div>`;
      });
      container.innerHTML = html;
      // Populate unit dropdowns
      const units = (function(){ try { return JSON.parse(localStorage.getItem('units_v1')||'null') || ['Kg','g','L','ml','pkt','piece']; } catch(e){ return ['Kg','g','L','ml','pkt','piece']; } })();
      container.querySelectorAll('.unit-select').forEach(sel => {
        sel.style.background = '#fff'; // Ensure white background for visibility
        sel.style.color = '#222'; // Dark text for contrast
        sel.style.fontWeight = '500';
        sel.style.border = '1.5px solid #b0b8c1';
        sel.style.boxShadow = '0 1.5px 6px rgba(44,62,80,0.04)';
        const itemIdx = sel.getAttribute('data-item');
        const subIdx = sel.getAttribute('data-sub');
        const type = sel.getAttribute('data-type');
        let selected = '';
        let obj = null;
        if (subIdx !== null && subIdx !== undefined) {
          obj = items[itemIdx].subitems[subIdx];
          selected = (type==='wholesale'?obj.wholesaleUnit:obj.customerUnit)||units[0];
        } else {
          obj = items[itemIdx];
          selected = (type==='wholesale'?obj.wholesaleUnit:obj.customerUnit)||units[0];
        }
        units.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u;
          opt.textContent = u;
          if (u === selected) opt.selected = true;
          sel.appendChild(opt);
        });
        const addOpt = document.createElement('option');
        addOpt.value = '__add__';
        addOpt.textContent = '+ Add/Edit Units';
        sel.appendChild(addOpt);
        sel.onchange = function() {
          if (sel.value === '__add__') {
            window.showUnitManager && window.showUnitManager(() => {
              // Re-populate all unit dropdowns after managing units
              const newUnits = (function(){ try { return JSON.parse(localStorage.getItem('units_v1')||'null') || ['Kg','g','L','ml','pkt','piece']; } catch(e){ return ['Kg','g','L','ml','pkt','piece']; } })();
              document.querySelectorAll('.unit-select').forEach(s2 => {
                const prev = s2.value;
                s2.innerHTML = '';
                newUnits.forEach(u => {
                  const opt = document.createElement('option');
                  opt.value = u;
                  opt.textContent = u;
                  s2.appendChild(opt);
                });
                const addOpt2 = document.createElement('option');
                addOpt2.value = '__add__';
                addOpt2.textContent = '+ Add/Edit Units';
                s2.appendChild(addOpt2);
                s2.value = newUnits.includes(prev) ? prev : newUnits[0];
              });
            });
          }
        };
      });
      // Remove '+ Add/Edit Units' after first use to prevent stuck dropdown
      setTimeout(() => {
        container.querySelectorAll('.unit-select').forEach(sel => {
          Array.from(sel.options).forEach(opt => {
            if (opt.value === '__add__') sel.removeChild(opt);
          });
        });
      }, 500);
      // Save button logic (isolated)
      container.querySelectorAll('.save-price-btn').forEach(btn => {
        btn.onclick = function() {
          const itemIdx = parseInt(btn.getAttribute('data-item'));
          const subIdx = btn.hasAttribute('data-sub') ? parseInt(btn.getAttribute('data-sub')) : null;
          let items = [];
          try {
            items = JSON.parse(localStorage.getItem('grocery_items_v1')||'[]');
          } catch(e) { items = []; }
          if (subIdx !== null) {
            // Subitem
            const wInput = container.querySelector(`.wholesale-price-input[data-item='${itemIdx}'][data-sub='${subIdx}']`);
            const cInput = container.querySelector(`.customer-price-input[data-item='${itemIdx}'][data-sub='${subIdx}']`);
            const wUnit = container.querySelector(`.unit-select[data-item='${itemIdx}'][data-sub='${subIdx}'][data-type='wholesale']`).value;
            const cUnit = container.querySelector(`.unit-select[data-item='${itemIdx}'][data-sub='${subIdx}'][data-type='customer']`).value;
            items[itemIdx].subitems[subIdx].wholesalePrice = wInput.value;
            items[itemIdx].subitems[subIdx].customerPrice = cInput.value;
            items[itemIdx].subitems[subIdx].wholesaleUnit = wUnit;
            items[itemIdx].subitems[subIdx].customerUnit = cUnit;
          } else {
            // Main item
            const wInput = container.querySelector(`.wholesale-price-input[data-item='${itemIdx}']:not([data-sub])`);
            const cInput = container.querySelector(`.customer-price-input[data-item='${itemIdx}']:not([data-sub])`);
            const wUnit = container.querySelector(`.unit-select[data-item='${itemIdx}'][data-type='wholesale']`).value;
            const cUnit = container.querySelector(`.unit-select[data-item='${itemIdx}'][data-type='customer']`).value;
            items[itemIdx].wholesalePrice = wInput.value;
            items[itemIdx].customerPrice = cInput.value;
            items[itemIdx].wholesaleUnit = wUnit;
            items[itemIdx].customerUnit = cUnit;
          }
          localStorage.setItem('grocery_items_v1', JSON.stringify(items));
          btn.textContent = '✔';
          setTimeout(()=>{ btn.textContent = '💾'; }, 1000);
        };
      });
    })();
    // === Unit Manager Modal Logic (Robust, Non-Destructive) ===
    (function(){
      // Modal elements
      var modal = document.getElementById('unitManagerModal');
      var content = document.getElementById('unitManagerContent');
      var closeBtn = document.getElementById('closeUnitManagerBtn');
      // Expose a global function for dropdowns to call
      window.showUnitManager = function(onClose) {
        renderUnitManager();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Optional: callback after closing
        modal._onClose = onClose;
      };
      function getUnits() {
        try {
          return JSON.parse(localStorage.getItem('units_v1')||'null') || ['Kg','g','L','ml','pkt','piece'];
        } catch(e) { return ['Kg','g','L','ml','pkt','piece']; }
      }
      function setUnits(units) {
        localStorage.setItem('units_v1', JSON.stringify(units));
      }
      function renderUnitManager() {
        var units = getUnits();
        var html = "<div class='modal-title'>Manage Units</div>";
        html += "<ul style='padding-left:0;list-style:none;'>";
        units.forEach(function(unit, idx) {
          html += "<li style='display:flex;align-items:center;gap:8px;margin-bottom:8px;'><input type='text' value='"+unit+"' data-idx='"+idx+"' style='flex:1;padding:6px 8px;border-radius:4px;border:1px solid #ccc;'>";
          if (units.length > 1) html += "<button data-del='"+idx+"' style='background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;'>Delete</button>";
          html += "</li>";
        });
        html += "</ul>";
        html += "<button id='addUnitBtn' style='background:#1976d2;color:#fff;border:none;border-radius:6px;padding:8px 18px;font-weight:600;cursor:pointer;margin-top:8px;'>+ Add Unit</button>";
        html += "<div class='modal-actions' style='margin-top:18px;'><button id='saveUnitsBtn'>Save</button><button type='button' class='cancel' id='cancelUnitsBtn'>Cancel</button></div>";
        content.innerHTML = html;
        // Delete logic
        Array.from(content.querySelectorAll('[data-del]')).forEach(function(btn){
          btn.onclick = function() {
            var idx = parseInt(btn.getAttribute('data-del'));
            var units = getUnits();
            units.splice(idx,1);
            setUnits(units);
            renderUnitManager();
          };
        });
        // Add logic
        content.querySelector('#addUnitBtn').onclick = function() {
          var units = getUnits();
          units.push('');
          setUnits(units);
          renderUnitManager();
        };
        // Save logic
        content.querySelector('#saveUnitsBtn').onclick = function() {
          var inputs = content.querySelectorAll('input[type=text]');
          var newUnits = [];
          for (var i=0; i<inputs.length; ++i) {
            var val = inputs[i].value.trim();
            if (val && newUnits.indexOf(val)===-1) newUnits.push(val);
          }
          if (newUnits.length === 0) newUnits = ['Kg','g','L','ml','pkt','piece'];
          setUnits(newUnits);
          closeUnitManager();
        };
        // Cancel logic
        content.querySelector('#cancelUnitsBtn').onclick = closeUnitManager;
      }
      function closeUnitManager() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        if (typeof modal._onClose === 'function') { modal._onClose(); modal._onClose = null; }
      }
      closeBtn.onclick = closeUnitManager;
      modal.onclick = function(e) { if (e.target === modal) closeUnitManager(); };
    })();
    // Place '+ Add/Edit Units' and 'Current orders' buttons side by side
    (function() {
      var addEditUnitsBtn = document.getElementById('addEditUnitsBtn');
      var ordersBtn = document.getElementById('ordersBtn');
      if (addEditUnitsBtn && ordersBtn) {
        // Create a wrapper div for the buttons
        var btnRow = document.getElementById('mainBtnRow');
        if (!btnRow) {
          btnRow = document.createElement('div');
          btnRow.id = 'mainBtnRow';
          btnRow.style.display = 'flex';
          btnRow.style.justifyContent = 'center';
          btnRow.style.gap = '18px';
          btnRow.style.margin = '32px auto 0 auto';
          // Insert the wrapper before the first button
          addEditUnitsBtn.parentNode.insertBefore(btnRow, addEditUnitsBtn);
          // Move both buttons into the wrapper
          btnRow.appendChild(addEditUnitsBtn);
          btnRow.appendChild(ordersBtn);
        }
        // Optional: Make both buttons the same height
        addEditUnitsBtn.style.margin = '0';
        ordersBtn.style.margin = '0';
        addEditUnitsBtn.style.minWidth = '170px';
        ordersBtn.style.minWidth = '170px';
      }
    })();
});
const profilePic = document.getElementById('profile-pic');
const profileUpload = document.getElementById('profile-upload');
const profileMenu = document.getElementById('profile-menu');
const profileContainer = document.getElementById('profile-pic-container');

profileContainer.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  profileMenu.style.top = `${e.pageY}px`;
  profileMenu.style.left = `${e.pageX}px`;
  profileMenu.style.display = 'block';
});

document.addEventListener('click', () => {
  profileMenu.style.display = 'none';
});

profileUpload.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;
    profilePic.src = imageData;
    profilePic.style.display = 'block';
    profilePic.classList.add('zoom-out');
    localStorage.setItem('profileImage', imageData); // auto-save
  };
  reader.readAsDataURL(file);
});
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('profileImage');
  if (saved) {
    profilePic.src = saved;
    profilePic.style.display = 'block';
  }
});

profilePic.addEventListener('click', () => {
  const container = document.getElementById('profile-pic-container');
  const glowTrail = document.getElementById('profile-glow-trail');

  // Hide container styles
  container.style.border = 'none';
  container.style.background = 'transparent';

  // Activate glow trail
  glowTrail.classList.add('active');

  // Animate the image
  profilePic.classList.add('zoom-out');

  // Reset after animation
  setTimeout(() => {
    profilePic.classList.remove('zoom-out');
    glowTrail.classList.remove('active');
    container.style.border = '2px solid #ccc';
    container.style.background = '#f0f0f0';
  }, 900);
});

function triggerProfileUpload() {
  profileUpload.click();
}
function deleteProfilePicture() {
  profilePic.src = '';
  profilePic.style.display = 'none';
}
