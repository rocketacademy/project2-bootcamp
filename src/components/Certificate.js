import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const modifyPDF = async () => {
  const url = "https://pdf-lib.js.org/assets/with_update_sections.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
  console.log(existingPdfBytes);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  firstPage.drawText("This text was added with JavaScript!", {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
  });

  const pdfBytes = await pdfDoc.save();
  // Convert the PDF bytes to a Blob
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  // Create a data URL for the Blob
  const dataUrl = URL.createObjectURL(blob);

  // Open the modified PDF in a new window
  window.open(dataUrl);
};

export const Certificate = () => {
  const handleModifyPDF = async () => {
    try {
      const modifiedPdfBytes = await modifyPDF();
      // Do something with modifiedPdfBytes, for example, save it or display it.
    } catch (error) {
      console.error("Error modifying PDF:", error);
    }
  };

  return (
    <div>
      <button onClick={handleModifyPDF}>Modify PDF</button>
    </div>
  );
};
