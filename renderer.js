window.addEventListener("DOMContentLoaded", () => {
  require.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' } });

  require(['vs/editor/editor.main'], function () {
    monaco.editor.create(document.getElementById('container'), {
      value: "print('Hello, IDE!')",
      language: "python",
      theme: "vs-dark"   // 👈 dark theme
    });
  });
});
