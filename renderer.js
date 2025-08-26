document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "I") {
    window.electronAPI.openDevTools();
  }
});

let editor;

window.addEventListener("DOMContentLoaded", () => {
  require.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' } });

  require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('container'), {
      value: "print('Hello, IDE!')",
      language: "python",
      theme: "vs-dark"
    });
  });

  document.getElementById("openFile").addEventListener("click", async () => {
    const result = await window.electronAPI.openFile();
    if (result) {
      editor.setValue(result.content);
    }
  });

  document.getElementById("saveFile").addEventListener("click", async () => {
    const content = editor.getValue();
    const savedPath = await window.electronAPI.saveFile({ content });
    if (savedPath) {
      alert(`Saved to: ${savedPath}`);
    }
  });
});
