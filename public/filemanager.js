let currentPath = "";

async function loadFiles(path = "") {
  const res = await fetch(`/admin/fileapi?path=${encodeURIComponent(path)}`);
  const data = await res.json();

  currentPath = data.path;
  document.getElementById("path").innerText = "Path: /" + currentPath;

  const list = document.getElementById("list");
  list.innerHTML = "";

  // Back button
  if (currentPath) {
    const back = document.createElement("div");
    back.innerText = "⬅️ ..";
    back.className = "file-item";
    back.onclick = () => {
      loadFiles(currentPath.split("/").slice(0, -1).join("/"));
    };
    list.appendChild(back);
  }

  data.items.forEach(item => {
    const div = document.createElement("div");
    div.className = "file-item";

    // Left: icon + name
    const left = document.createElement("div");
    left.className = "file-name";
    const icon = document.createElement("span");
    icon.className = "file-icon";
    icon.innerText = item.type === "folder" ? "📁" : "📄";
    left.appendChild(icon);
    const name = document.createElement("span");
    name.innerText = item.name;
    left.appendChild(name);
    div.appendChild(left);

    // Right: Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerText = "Delete";
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      if (confirm(`Delete ${item.name}?`)) {
        await fetch("/admin/filedelete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: currentPath ? currentPath + "/" + item.name : item.name })
        });
        loadFiles(currentPath);
      }
    };
    div.appendChild(delBtn);

    // Folder click
    if (item.type === "folder") {
      div.onclick = () => {
        loadFiles(currentPath ? currentPath + "/" + item.name : item.name);
      };
    }else {
  // File click
  div.onclick = () => {
    const ext = item.name.split('.').pop().toLowerCase();
    const audioExt = ['mp3', 'wav', 'ogg'];
    const imageExt = ['jpg','jpeg','png','gif'];

    if (imageExt.includes(ext)) {
      // Image preview
      const fileUrl = `/nj/${currentPath ? currentPath + '/' : ''}${item.name}`;
      showImagePreview(fileUrl);
    } else if (audioExt.includes(ext)) {
      // Audio preview
      const fileUrl = `/nj/${currentPath ? currentPath + '/' : ''}${item.name}`;
      showAudioPlayer(fileUrl);
    } else {
      alert('Preview not supported for this file type');
    }
  };
}

    list.appendChild(div);
  });
}

// Upload
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const filekkk = document.getElementById("uploadfff");

  // 🔒 disable input while uploading
  filekkk.disabled = true;
  filekkk.textContent = "uploading...";
  
  //fileInput.innertexr

  if (!fileInput.files.length) {
    filekkk.textContent = "Upload";
    showAlert("অনুগ্রহ করে একটি ফাইল সিলেক্ট করুন", "Warning");
    filekkk.disabled = false; // আবার enable
    return;
  }
ShowLoading();
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("path", currentPath);

  try {
    const res = await fetch("/admin/fileupload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    showAlert("ফাইল সফলভাবে আপলোড হয়েছে", "Success");

    fileInput.value = "";
    loadFiles(currentPath);

  } catch (err) {
    showAlert("ফাইল আপলোড ব্যর্থ হয়েছে", "Error");
    console.error(err);

  } finally {
    // 🔓 enable input after upload
    filekkk.disabled = false;
    filekkk.textContent = "Upload";
    HideLoading();
  }
}


function showImagePreview(url) {
  // Overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 9999;

  // Image
  const img = document.createElement('img');
  img.src = url;
  img.style.maxWidth = '90%';
  img.style.maxHeight = '90%';
  img.style.borderRadius = '8px';

  // Close Button
  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '&times;';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '15px',
    right: '20px',
    fontSize: '35px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold'
  });

  // Only close button click = hide
  closeBtn.addEventListener('click', () => {
    overlay.remove();
  });

  overlay.appendChild(closeBtn);
  overlay.appendChild(img);
  document.body.appendChild(overlay);
}
function showAudioPlayer(url) {
  // Overlay create
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.cursor = 'pointer';
  overlay.onclick = () => overlay.remove();

  // Audio element
  const audio = document.createElement('audio');
  audio.src = url;
  audio.controls = true;
  audio.autoplay = true;
  audio.style.maxWidth = '90%';
  audio.style.borderRadius = '8px';
  overlay.appendChild(audio);

  document.body.appendChild(overlay);
}


// Initial load
loadFiles();
console.log(currentPath)


