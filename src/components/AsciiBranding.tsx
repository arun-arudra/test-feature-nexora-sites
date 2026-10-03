import fs from "fs";
import path from "path";

export async function AsciiBranding() {
  try {
    const brandingPath = path.join(process.cwd(), "public", "branding.txt");
    if (!fs.existsSync(brandingPath)) return null;
    
    const text = fs.readFileSync(brandingPath, "utf8");
    if (!text.trim()) return null;

    const asciiArt = `\n/*\n${text}\n*/\n`;

    return (
      <style dangerouslySetInnerHTML={{ __html: asciiArt }} />
    );
  } catch (e) {
    return null;
  }
}
