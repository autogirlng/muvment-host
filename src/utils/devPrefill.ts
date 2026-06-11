/**
 * Helpers that generate placeholder `File` objects so testers can quickly
 * populate the vehicle photo and document upload steps without manually
 * selecting files for every field. The generated files are real, uploadable
 * files (PNG images / PDF documents) so the normal submit flow still works.
 */

/**
 * Draws a labelled placeholder PNG on a canvas and resolves it as a `File`.
 */
export function createPlaceholderImageFile(label: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Unable to create placeholder image"));
      return;
    }

    ctx.fillStyle = "#1f6feb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, canvas.width / 2, canvas.height / 2);
    ctx.font = "20px sans-serif";
    ctx.fillText("Placeholder (test)", canvas.width / 2, canvas.height / 2 + 48);

    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to create placeholder image"));
        return;
      }
      const safeName = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      resolve(new File([blob], `${safeName}-placeholder.png`, { type: "image/png" }));
    }, "image/png");
  });
}

/**
 * Builds a minimal, valid single-page PDF as a `File`.
 */
export function createPlaceholderPdfFile(label: string): File {
  const text = `${label} - placeholder document (test)`;
  const pdf = [
    "%PDF-1.1",
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj",
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj",
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj",
    `4 0 obj<</Length ${text.length + 44}>>stream`,
    `BT /F1 18 Tf 60 760 Td (${text}) Tj ET`,
    "endstream endobj",
    "5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj",
    "trailer<</Root 1 0 R>>",
    "%%EOF",
  ].join("\n");

  const safeName = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return new File([pdf], `${safeName}-placeholder.pdf`, {
    type: "application/pdf",
  });
}
