import { DarkMode } from "./src/darkmode.js";
import { MarkDown, addMarkdown, downloadMarkdown, downloadPDF } from "./src/markdown.js";
import { SlashCommand } from "./src/slashcommand.js";

document.addEventListener('DOMContentLoaded', () => {
  DarkMode();
  MarkDown();
  SlashCommand();

  document.getElementById("h1-button").addEventListener("click", () => addMarkdown('# '));
  document.getElementById("h2-button").addEventListener("click", () => addMarkdown('## '));
  document.getElementById("h3-button").addEventListener("click", () => addMarkdown('### '));
  document.getElementById("bold-button").addEventListener("click", () => addMarkdown('**bold**'));
  document.getElementById("italic-button").addEventListener("click", () => addMarkdown('*italic*'));
  document.getElementById("unordered-list-button").addEventListener("click", () => addMarkdown('- '));
  document.getElementById("ordered-list-button").addEventListener("click", () => addMarkdown('1. '));
  document.getElementById("blockquote-button").addEventListener("click", () => addMarkdown('> '));
  document.getElementById("inline-code-button").addEventListener("click", () => addMarkdown('`inline code`'));
  document.getElementById("code-block-button").addEventListener("click", () => addMarkdown('```code block\n```'));
  document.getElementById("raw-code-button").addEventListener("click", downloadMarkdown);
  document.getElementById("download-pdf-button").addEventListener("click", downloadPDF);


  // POP UPS
  // Add event listeners for the LINK pop-up button
  document.getElementById("link-button").addEventListener("click", () => {
    const popup = document.getElementById("link-popup");
    popup.classList.remove("hidden");
  });

  document.getElementById("link-accept-button").addEventListener("click", () => {
    const linkText = document.getElementById("link-text").value.trim();
    const linkUrl = document.getElementById("link-url").value.trim();

    if (linkText && linkUrl) {
      addMarkdown(`[${linkText}](${linkUrl})`);
    }

    // Ocultar el pop-up y limpiar los campos
    document.getElementById("link-popup").classList.add("hidden");
    document.getElementById("link-text").value = '';
    document.getElementById("link-url").value = '';
  });

  document.getElementById("link-cancel-button").addEventListener("click", () => {
    // Ocultar el pop-up y limpiar los campos
    document.getElementById("link-popup").classList.add("hidden");
    document.getElementById("link-text").value = '';
    document.getElementById("link-url").value = '';
  });

  // Add event listeners for the IMAGE pop-up button
  document.getElementById("image-button").addEventListener("click", () => {
    const popup = document.getElementById("image-popup");
    popup.classList.remove("hidden");
  });

  document.getElementById("image-accept-button").addEventListener("click", () => {
    const imageAlt = document.getElementById("image-alt").value.trim();
    const imageUrl = document.getElementById("image-url").value.trim();

    if (imageUrl) {
      addMarkdown(`![${imageAlt}](${imageUrl})`);
    }

    // Ocultar el pop-up y limpiar los campos
    document.getElementById("image-popup").classList.add("hidden");
    document.getElementById("image-alt").value = '';
    document.getElementById("image-url").value = '';
  });

  document.getElementById("image-cancel-button").addEventListener("click", () => {
    // Ocultar el pop-up y limpiar los campos
    document.getElementById("image-popup").classList.add("hidden");
    document.getElementById("image-alt").value = '';
    document.getElementById("image-url").value = '';
  });

});