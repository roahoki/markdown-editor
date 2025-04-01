// ====================== Markdrown ===========================
export function addMarkdown(syntax) {
    const textarea = document.getElementById('markdown-content');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    textarea.value =
        textarea.value.substring(0, startPos) +
        syntax +
        textarea.value.substring(endPos);

    textarea.focus();
    updatePreview();
}

export function markdownToHtml(markdown) {
    // Handle horizontal rules (---, ***)
    markdown = markdown.replace(/^---$|^\*\*\*$/gm, '<hr>');

    // Handle headers (H1 to H6)
    markdown = markdown.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    markdown = markdown.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    markdown = markdown.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    markdown = markdown.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    markdown = markdown.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // Alternative H1 H2
    markdown = markdown.replace(/^(.+)\n=+$/gm, '<h1>$1</h1>'); // H1 ====
    markdown = markdown.replace(/^(.+)\n-+$/gm, '<h2>$1</h2>'); // H2 ----

    // Handle bold and italic text
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // **bold**
    markdown = markdown.replace(/__(.*?)__/g, '<strong>$1</strong>'); // __bold__
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>'); // *italic*
    markdown = markdown.replace(/_(.*?)_/g, '<em>$1</em>'); // _italic_

    // Handle unordered lists 
    markdown = markdown.replace(/(?:^[-*]\s.*(?:\n[-*]\s.*)*)/gm, (match) => {
        const items = match
            .split('\n')
            .map(item => item.replace(/^[-*]\s/, '').trim())
            .filter(item => item.length > 0)
            .map(item => `<li>${item}</li>`)
            .join('');
        return items.length > 0 ? `<ul>${items}</ul>` : '';
    });

    // Handle ordered lists 
    markdown = markdown.replace(/(?:^\d+\.\s.*(?:\n\d+\.\s.*)*)/gm, (match) => {
        const items = match
            .split('\n')
            .map(item => item.replace(/^\d+\.\s/, '').trim())
            .filter(item => item.length > 0)
            .map(item => `<li>${item}</li>`)
            .join('');
        return items.length > 0 ? `<ol>${items}</ol>` : '';
    });

    // Handle images
    markdown = markdown.replace(/!\[(.*?)\]\((.*?)\s*("(.*?)")?\)/g, (match, alt, url, _, title) => {
        const encodedUrl = encodeURI(url.trim());
        return `<img src="${encodedUrl}" alt="${alt}" title="${title || ''}" />`;
    });

    // Handle links
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');


    // Handle blockquotes correctly
    markdown = markdown.replace(/(?:^> (.*)\n?)+/gm, (match) => {
        const quotes = match
            .trim()
            .split('\n')
            .map(line => line.replace(/^> /, '').trim())
            .filter(line => line.length > 0)
            .map(line => `<p>${line}</p>`)
            .join('');
        return `<blockquote>${quotes}</blockquote>`;
    });

    // Handle code blocks
    markdown = markdown.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Handle inline code
    markdown = markdown.replace(/`(.*?)`/g, '<code>$1</code>');

    return markdown;
}

export function addEnterKey(e){
        const textarea = document.getElementById('markdown-content');
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        const currentLine = textarea.value.substring(0, startPos).split('\n').pop();
        
        // lista ordenada
        if (currentLine.match(/^\d+\.\s/)) {
            const nextNumber = parseInt(currentLine.split('.')[0]) + 1;
            const nextLine = `${nextNumber}. `;
            textarea.value = textarea.value.substring(0, startPos) + '\n' + nextLine + textarea.value.substring(endPos);
            textarea.setSelectionRange(startPos + nextLine.length + 1, startPos + nextLine.length + 1);
            e.preventDefault();
        }
        // lista desordenada
        else if (currentLine.match(/^[-*]\s/)) {
            const nextLine = `- `;
            textarea.value = textarea.value.substring(0, startPos) + '\n' + nextLine + textarea.value.substring(endPos);
            textarea.setSelectionRange(startPos + nextLine.length + 1, startPos + nextLine.length + 1);
            e.preventDefault();
        }
    
        updatePreview();
    }


export function updatePreview() {
    const markdownContent = document.getElementById('markdown-content').value;
    document.getElementById('html-preview').innerHTML = markdownToHtml(markdownContent);
}

export function MarkDown() {
    const markdownContent = document.getElementById('markdown-content');
    markdownContent.value = localStorage.getItem('markdown') || '';
    updatePreview();
    markdownContent.addEventListener('input', () => {
        localStorage.setItem('markdown', markdownContent.value);
        updatePreview();
    });

    markdownContent.addEventListener('scroll', () => {
        document.getElementById('html-preview').scrollTop = markdownContent.scrollTop;
    });

    markdownContent.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            addEnterKey(e);
        }
    })

};

// ================== DOWNLOAD COMMANDS ===============

export function downloadMarkdown() {
    const markdownContent = document.getElementById('markdown-content').value;
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'RAW.md'; // File name (new feature could be added to change the name)
    a.click();

    URL.revokeObjectURL(url); // Clear the URL object
}


export async function downloadPDF() {
    const { jsPDF } = window.jspdf; // import jsPDF
    const pdf = new jsPDF();

    const htmlPreview = document.getElementById('html-preview');
    const titleTextarea = document.getElementById('document-title-textarea');
    const pdfTitle = titleTextarea.value.trim() || 'content';

    // Using html2canvas to capture the HTML content as an image
    const canvas = await html2canvas(htmlPreview);
    const imgData = canvas.toDataURL('image/png'); // Converting canvas to image data

    // Margin and size calculations
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 0;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const x = margin;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(`${pdfTitle}.pdf`);
}