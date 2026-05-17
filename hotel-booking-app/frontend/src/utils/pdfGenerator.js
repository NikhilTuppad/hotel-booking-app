import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generateInvoicePDF = async (elementId, fileName = "Invoice.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Invoice element not found");
  }

  // Use a high scale for retina-quality crisp text
  const canvas = await html2canvas(element, {
    scale: 3, 
    useCORS: true,
    logging: false,
    backgroundColor: "#f9fafb", // Match a soft gray background
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const margin = 15; // 15mm margin
  const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
  pdf.save(fileName);
};
