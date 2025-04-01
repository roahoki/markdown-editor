// ================== SLASH COMAND ===============
import { updatePreview } from "./markdown.js";

export function SlashCommand() {
    const slash = document.getElementById('markdown-content');
    const dropdown = document.getElementById('dropdown');
    const dropdownQuery = document.querySelector('.dropdown');
    const dropdownItems = dropdownQuery.children
    let isScrolling = false;
    let active = 0;

    //Si se activa el scroll cambio el valor de isScrolling y viceversa
    slash.addEventListener('scroll', function () {
        isScrolling = true;
        if (!checkScrollAvailability(slash)) {
            isScrolling = false;
        }
    });

    //Si hago click en el documento aguera del dropdown, lo oculto
    document.addEventListener('click', function (e) {
        if (e.target !== dropdown) {
            dropdown.style.display = 'none';
            active = -1;
        }
    });

    //Lógica para mostrar el dropdown
    slash.addEventListener('input', async function (e) {

        localStorage.setItem("markdown", slash.value);
        updatePreview();
        if (!checkScrollAvailability(slash)) {
            isScrolling = false;
        }

        const text = e.target.value;
        const lines = text.split('\n');
        const currentLine = lines[lines.length - 1];

        // Verificar si la línea actual contiene exactamente un solo '/'
        if (currentLine === '/') {
            dropdown.style.display = 'block';
            active = 0
            await positionDropdown(text, slash, isScrolling);
            dropdownItems[active].classList.remove('active');
            dropdownItems[active + 1].classList.remove('active');
            dropdownItems[active].classList.add('active');
            document.addEventListener('keydown', function(e) {
                if (dropdown.style.display === 'block') {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (active < dropdownItems.length - 1) {
                            if (active >= 0) {
                                dropdownItems[active].classList.remove('active');
                            }
                            active++;
                            dropdownItems[active].classList.add('active');

                        }
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (active == dropdownItems.length - 1) {
                            if (active > 0) {
                                dropdownItems[active].classList.remove('active');
                            }
                            active--;
                            dropdownItems[active].classList.add('active');
                        }
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
            
                        if (active >= 0) {
                            dropdownItems[active].click();
                        }
                    }

                }
            });
        } else {
            dropdown.style.display = 'none';
            active = -1;
        }
    });

    dropdown.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('dropdown-item')) {
            const command = e.target.innerText;
            insertCommand(command, slash);
        }
    });

};

//Reviso si se activó o no el scroll
export function checkScrollAvailability(slash) {
    return slash.scrollHeight > slash.clientHeight;
}

export function positionDropdown(text, slash, isScrolling) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const editor = document.getElementById("markdown-content");
            const dropdown = document.getElementById("dropdown");
            const dropdownSize = dropdown.getBoundingClientRect();
            const editorPosition = editor.getBoundingClientRect();
            const cursorPosition = slash.selectionStart;

            // Creamos un span para conocer ubicación del '/'
            const textBeforeCursor = text.slice(0, cursorPosition);
            const span = document.createElement("span");
            span.style.visibility = "hidden";
            span.style.position = "absolute";
            span.style.whiteSpace = "pre";
            span.textContent = textBeforeCursor;

            // Agregamos el span al documento
            document.body.appendChild(span);
            const slashPosition = span.getBoundingClientRect();

            if (!dropdown.dataset.initialSlashPositionRight) {
                dropdown.dataset.initialSlashPositionRight = slashPosition.right;
            }
            const initialSlashPositionRight = parseFloat(dropdown.dataset.initialSlashPositionRight);

            if (!isScrolling) {
                dropdown.style.left = `${editorPosition.left + initialSlashPositionRight * 4}px`;
                dropdown.style.top = `${editorPosition.top + slashPosition.bottom}px`;
            } else {
                dropdown.style.left = `${editorPosition.left + initialSlashPositionRight * 4}px`;
                dropdown.style.top = `${editorPosition.bottom - dropdownSize.height}px`;
            }

            document.body.removeChild(span);
            resolve();
        }, 0);
    });
}

export function insertCommand(command, slash) {
    const cursorPosition = slash.selectionStart;
    let text = slash.value;
    let insertedText = '';

    if (command === 'Code Block') {
        insertedText = '``` \n \n```';
    } else if (command === 'Details') {
        insertedText = '<details><summary>Details</summary>\n<p>\n\n\n\n</p>\n</details>';
    }

    slash.value = text.slice(0, cursorPosition - 1) + insertedText + text.slice(cursorPosition);

    localStorage.setItem("markdown", slash.value);
    updatePreview();

    if (command === 'Code Block') {
        slash.selectionStart = slash.selectionEnd = cursorPosition + (insertedText.length) / 2 - 1;
    } else if (command === 'Details') {
        const positionInDetails = cursorPosition - 1 + insertedText.indexOf('\n\n\n\n') + 2;
        slash.selectionStart = slash.selectionEnd = positionInDetails;
    }
    document.getElementById('markdown-content').focus();
    dropdown.style.display = 'none';
}