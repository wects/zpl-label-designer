export function imageDataToHex(imageData: ImageData, threshold = 150) {
  const { width, height } = imageData;
  const bytesPerRow = Math.ceil(width / 8);
  const totalBytes = bytesPerRow * height;
  let hexString = '';

  for (let y = 0; y < height; y++) {
    for (let byteIndex = 0; byteIndex < bytesPerRow; byteIndex++) {
      let byteValue = 0;
      for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
        const x = byteIndex * 8 + bitIndex;
        if (x < width) {
          // Use natural imageData.width for correct buffer indexing
          const idx = (y * width + x) * 4;
          const r = imageData.data[idx];
          const g = imageData.data[idx + 1];
          const b = imageData.data[idx + 2];
          const a = imageData.data[idx + 3];

          // Calculate lightness
          const grayscale = r * 0.299 + g * 0.587 + b * 0.114;
          
          // Alpha > 128 and Color < threshold is treated as Black/Ink (1)
          const isDark = (a > 128) && (grayscale < threshold);
          if (isDark) {
            byteValue |= (1 << (7 - bitIndex));
          }
        }
      }
      let hexPart = byteValue.toString(16).toUpperCase();
      hexString += hexPart.padStart(2, '0');
    }
  }

  return {
    hexString,
    bytesPerRow,
    totalBytes
  };
}

/**
 * Clips ZPL Hex data on the left side to prevent "right-shifting" when components are partially off-screen (x < 0)
 * @param hex Original hex string
 * @param originalWidth Original width in pixels
 * @param clipX Number of pixels to clip from the left
 */
export function clipZplHex(hex: string, originalWidth: number, clipX: number) {
  if (clipX <= 0) return null;
  const originalBytesPerRow = Math.ceil(originalWidth / 8);
  
  // Split hex into rows
  const rows: string[] = [];
  for (let i = 0; i < hex.length; i += originalBytesPerRow * 2) {
    rows.push(hex.substring(i, i + originalBytesPerRow * 2));
  }
  
  const newWidth = originalWidth - clipX;
  if (newWidth <= 0) return null;
  
  const newBytesPerRow = Math.ceil(newWidth / 8);
  let newHex = '';
  
  for (const row of rows) {
    let bits = '';
    // Hex to Bits
    for (let i = 0; i < row.length; i += 2) {
      const byte = parseInt(row.substring(i, i + 2), 16);
      bits += byte.toString(2).padStart(8, '0');
    }
    
    // Clip bits from left
    // We take the bit corresponding to clipX and keep until newWidth
    const clippedBits = bits.substring(clipX, originalWidth);
    
    // Pad to newBytesPerRow * 8
    const paddedBits = clippedBits.padEnd(newBytesPerRow * 8, '0');
    
    // Bits back to Hex
    for (let i = 0; i < paddedBits.length; i += 8) {
      const byte = parseInt(paddedBits.substring(i, i + 8), 2);
      newHex += byte.toString(16).toUpperCase().padStart(2, '0');
    }
  }
  
  return {
    hexString: newHex,
    bytesPerRow: newBytesPerRow,
    totalBytes: newBytesPerRow * rows.length
  };
}

// Generate ZPL for Native Target (English/1D)
export function generateNativeTextZPL(text: string, x: number, y: number, fontWidth: number, fontHeight: number) {
  // Use zero-based font A (or 0) scalable
  // ^A0N,height,width. If width=0, it uses proportional defaults.
  // We use Math.round(fontWidth) if we want absolute control, but 0 is often better for "Natural" look.
  return `^FO${Math.round(x)},${Math.round(y)}^A0N,${Math.round(fontHeight)},${Math.round(fontWidth)}^FD${text}^FS`;
}

export function generateNativeBarcodeZPL(data: string, x: number, y: number, height: number, widthRatio: number, humanReadable = true, textAbove = false) {
  // ^BC orientation, height, human_readable, human_readable_above, check_digit
  const hr = humanReadable ? 'Y' : 'N';
  const ta = textAbove ? 'Y' : 'N';
  const w = Math.max(1, Math.round(widthRatio));
  return `^FO${Math.round(x)},${Math.round(y)}^BY${w}^BCN,${Math.round(height)},${hr},${ta},N^FD${data}^FS`;
}

export function generateNativeQrZPL(data: string, x: number, y: number, magnification: number) {
  // ^BQN,2,magnification. Magnification is 1-20.
  // Full data format: ^FD (Error Correction Level) (Mode) , (Data) ^FS
  // EC Level: Q (25%), M (15%), L (7%), H (30%). Defaulting to M.
  const m = Math.max(1, Math.min(20, Math.round(magnification)));
  return `^FO${Math.round(x)},${Math.round(y)}^BQN,2,${m}^FDMA,${data}^FS`;
}

export function generateNativeDataMatrixZPL(data: string, x: number, y: number, moduleSize: number) {
  // ^BXN, module_size, quality_level (200=ECC200)
  const m = Math.max(1, Math.round(moduleSize));
  return `^FO${Math.round(x)},${Math.round(y)}^BXN,${m},200^FD${data}^FS`;
}

// Generate ZPL Graphic Command (Non-English / QR / Image)
export function generateGraphicZPL(hexData: string, x: number, y: number, totalBytes: number, bytesPerRow: number) {
  // ^GFA, compression (A for Hex), binary bytes, graphic bytes per row, hex string
  return `^FO${Math.round(x)},${Math.round(y)}^GFA,${totalBytes},${totalBytes},${bytesPerRow},\n${hexData}^FS`;
}

export function buildZPL(commands: string[], labelWidth = 812, labelHeight = 1370, baseTemplate = '') {
  let innerCommands = commands.join('\n\n');
  if (!innerCommands.trim()) {
    innerCommands = '^FX Blank Label'; 
  }
  
  if (!baseTemplate || !baseTemplate.trim()) {
    // Standard blank canvas approach
    return `^XA\n^PW${labelWidth}\n^LL${labelHeight}\n\n${innerCommands}\n\n^XZ`;
  }
  
  let result = baseTemplate.trim();

  // Proactively update ^PW (Print Width) and ^LL (Label Length) to match selected label size
  // This ensures the render matches the designer settings even if the template had different dimensions
  if (result.toUpperCase().includes('^PW')) {
    result = result.replace(/\^PW\d+/gi, `^PW${labelWidth}`);
  } else {
    result = result.replace(/\^XA/i, `^XA\n^PW${labelWidth}`);
  }

  if (result.toUpperCase().includes('^LL')) {
    result = result.replace(/\^LL\d+/gi, `^LL${labelHeight}`);
  } else {
    // If ^LL is missing, we insert it. Note: some templates use ^LS or other ways, but ^LL is standard for length.
    result = result.replace(/\^XA/i, `^XA\n^LL${labelHeight}`);
  }

  // Inject precisely before the last ^XZ if it exists, otherwise append
  const xzRegex = /\^XZ/gi;
  let lastMatch = null;
  let match;
  while ((match = xzRegex.exec(result)) !== null) {
    lastMatch = match;
  }

  if (lastMatch !== null) {
    const closeIndex = lastMatch.index;
    const before = result.substring(0, closeIndex);
    const after = result.substring(closeIndex);
    return `${before}\n${innerCommands}\n\n${after}`;
  } else {
    // If no ^XZ found, just append our commands
    return `${result}\n\n${innerCommands}`;
  }
}


