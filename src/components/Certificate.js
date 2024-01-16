import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const modifyPDF = async ({ userName, courseName }) => {
  const url = process.env.PUBLIC_URL + "/cert.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
  console.log(existingPdfBytes);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  const userNameFontSize = 32;
  const userNameWidth = helveticaFont.widthOfTextAtSize(
    userName,
    userNameFontSize
  );
  const courseNameFontSize = 14;
  const courseNameWidth = helveticaFont.widthOfTextAtSize(
    courseName,
    courseNameFontSize
  );
  const userXPosition = (width - userNameWidth) / 2;
  const courseNameXPosition = (width - courseNameWidth) / 2;
  firstPage.drawText(userName, {
    x: userXPosition,
    y: height / 2 + 20,
    size: userNameFontSize,
    font: helveticaFont,
    color: rgb(0.56, 0.62, 0.75),
  });

  firstPage.drawText(courseName, {
    x: courseNameXPosition,
    y: height / 2 - 60,
    size: courseNameFontSize,
    font: helveticaFont,
    color: rgb(0.56, 0.62, 0.75),
  });

  const pdfBytes = await pdfDoc.save();
  // Convert the PDF bytes to a Blob
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  // Create a data URL for the Blob
  const dataUrl = URL.createObjectURL(blob);

  // Open the modified PDF in a new window
  window.open(dataUrl);
};

export const Certificate = ({ userName, courseName }) => {
  const handleModifyPDF = async () => {
    try {
      const modifiedPdfBytes = await modifyPDF({ userName, courseName });
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
