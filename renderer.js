const openFolderBtn = document.getElementById("openFolder");
const fileTree = document.getElementById("fileTree");

// Recursive function to build file explorer
function buildTree(dirPath) {
  const ul = document.createElement("ul");
  ul.classList.add("folder-tree");

  const items = window.electronAPI.readDir(dirPath);

  items.forEach(item => {
    const fullPath = window.electronAPI.joinPath(dirPath, item);
    const li = document.createElement("li");

    if (window.electronAPI.isDirectory(fullPath)) {
      li.textContent = "📂 " + item;
      li.classList.add("folder");

      const subTree = buildTree(fullPath);
      li.appendChild(subTree);
    } else {
      li.textContent = "📄 " + item;
      li.classList.add("file");
      li.onclick = () => {
        const content = window.electronAPI.readFile(fullPath);
        window.editor.setValue(content);
        window.currentFile = fullPath;
      };
    }

    ul.appendChild(li);
  });

  return ul;
}

// Open folder button handler
openFolderBtn.onclick = async () => {
  const folderPath = await window.electronAPI.openFolder();
  if (folderPath) {
    fileTree.innerHTML = "";
    fileTree.appendChild(buildTree(folderPath));
  }
};

// Monaco editor setup
require.config({ paths: { vs: "./node_modules/monaco-editor/min/vs" } });
require(["vs/editor/editor.main"], function () {
  window.editor = monaco.editor.create(document.getElementById("container"), {
    value: "// Open a file from Explorer...",
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true,
  });
});
