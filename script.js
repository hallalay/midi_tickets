document.getElementById('pdfForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    modifyPdf();
});

async function modifyPdf() {
    const existingPdfBytes = await fetch('./qrticket_151816767.pdf').then(res => res.arrayBuffer());

    const { PDFDocument, rgb } = PDFLib;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { r, g, b };
    }

    const {r,g,b} = hexToRgb('#0094aa')

    const page = pdfDoc.getPage(0); // Get the first page of the PDF

    // Draw white rectangles to cover old text
    page.drawRectangle({ x: 20, y: 710, width: 200, height: 27, color: rgb(1, 1, 1) });
    page.drawRectangle({ x: 20, y: 655, width: 200, height: 28, color: rgb(1, 1, 1) });
    page.drawRectangle({ x: 20, y: 590, width: 200, height: 28, color: rgb(1, 1, 1) });
    page.drawRectangle({ x: 265, y: 710, width: 200, height: 27, color: rgb(1, 1, 1) });
    page.drawRectangle({ x: 270, y: 610, width: 150, height: 14, color: rgb(1, 1, 1) });
    page.drawRectangle({ x: 420, y: 610, width: 150, height: 14, color: rgb(1, 1, 1) });


    // Repeat for other fields you want to cover

    cabine = "Cabine " + document.getElementById('newCabine').value
    const defaultTicket = "J127AC35-RWJ-ZFL";
    const defaultOrder = "217216867";
    const newTicketValue = document.getElementById('newTicket').value || defaultTicket;
    const newOrderValue = document.getElementById('newOrder').value || defaultOrder;

    // Convert the date from yyyy-mm-dd to dd/mm/yyyy format
    const dateValue = document.getElementById('newDate').value;
    const formattedDate = dateValue.split('-').reverse().join('/');
    // Add new text on top of the white rectangles
    page.drawText(formattedDate, { x: 23, y: 714 , color:rgb(r,g,b), fontweight:6});
    page.drawText(cabine, { x: 22, y: 660 , color:rgb(r,g,b), size:26});
    page.drawText(document.getElementById('newTime').value, { x: 24, y: 602 , color:rgb(r,g,b)});
    page.drawText(document.getElementById('newName').value, { x: 270.5, y: 715 , color:rgb(r,g,b), size: 21});
    page.drawText(newTicketValue, { x: 270.5, y: 612 , color:rgb(r,g,b), size: 13.5});
    page.drawText(newOrderValue, { x: 420.5, y: 611.5 , color:rgb(r,g,b), size: 15});

    // Repeat for other fields

    const pdfBytes = await pdfDoc.save();

    new_file_name = "qrticket_" + newOrderValue + ".pdf"

    download(pdfBytes, new_file_name, "application/pdf");
}

function download(data, filename, type) {
    const file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        const a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}