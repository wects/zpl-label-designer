import bwipjs from 'bwip-js'
import * as zplRenderer from 'zpl-renderer-js'
const zplToBase64MultipleAsync = (zplRenderer as any).zplToBase64MultipleAsync || (zplRenderer as any).default?.zplToBase64MultipleAsync
import { imageDataToHex } from './zpl'

/**
 * rasterize Barcode from bwip-js raw vector data (sbs/bhs) to ZPL ^GF format.
 * Strictly mirrors the logic in api_zpl_render_js/zpl-utils.mjs.
 */
export const rasterizeBarcode = (raw: any, scale: number) => {
  const sbs = raw.sbs
  const bhs = raw.bhs
  const height = Math.max(...bhs)
  const totalWidthUnits = sbs.reduce((a: number, b: number) => a + b, 0)
  const width = totalWidthUnits * scale
  
  const bytesPerRow = Math.ceil(width / 8)
  const totalBytes = bytesPerRow * height
  
  // Generate the monochrome pattern for one row
  const rowBytes = new Uint8Array(bytesPerRow)
  let currentX = 0
  let isBar = true
  
  for (const w of sbs) {
    const pixWidth = w * scale
    if (isBar) {
      for (let i = 0; i < pixWidth; i++) {
        const x = currentX + i
        const byteIdx = Math.floor(x / 8)
        const bitIdx = 7 - (x % 8)
        rowBytes[byteIdx] |= (1 << bitIdx)
      }
    }
    currentX += pixWidth
    isBar = !isBar
  }
  
  // Convert row pattern to hex and repeat for all rows
  const rowHex = Array.from(rowBytes)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join('')
    
  const fullHex = rowHex.repeat(height)
  
  return `^GFA,${totalBytes},${totalBytes},${bytesPerRow},${fullHex}`
}

/**
 * Pre-process ZPL to handle missing barcodes like ^BK (Codabar).
 * Strictly mirrors the logic in api_zpl_render_js/zpl-utils.mjs.
 */
export const preprocessZpl = async (zpl: string) => {
  let processedZpl = zpl
  
  // Helper to extract ^BY scale
  const getScale = (currentZpl: string, index: number) => {
    const beforeZpl = currentZpl.substring(0, index)
    const byMatch = beforeZpl.match(/\^BY(\d+)/g)
    return byMatch ? parseInt(byMatch[byMatch.length - 1].replace('^BY', '')) || 2 : 2
  }

  // Helper to extract nearest ^FO coordinates before an index
  const getFO = (currentZpl: string, index: number) => {
    const beforeZpl = currentZpl.substring(0, index)
    const foMatches = [...beforeZpl.matchAll(/\^FO(\d+),(\d+)/g)]
    if (foMatches.length > 0) {
      const last = foMatches[foMatches.length - 1]
      return { x: parseInt(last[1]), y: parseInt(last[2]) }
    }
    return { x: 0, y: 0 }
  }


  // 1. Polyfill ^BK (Codabar)
  const bkRegex = /\^BK([^,^]*)?,?([^,^]*)?,?(\d+)?,?([^,^]*)?,?([^,^]*)?,?([A-D])?,?([A-D])?.*?(\^FD(.*?)\^FS)/gs
  const matchesBK = [...processedZpl.matchAll(bkRegex)].reverse()
  for (const match of matchesBK) {
    const fullMatch = match[0]
    const orientation = match[1] || 'N'
    const height = parseInt(match[3]) || 60
    const hrLine = match[4] === 'Y' // Standard ZPL default is usually 'N' but let's check parameter
    const hrAbove = match[5] === 'Y'
    const startChar = match[6] || 'A'
    const stopChar = match[7] || 'A'
    const data = match[9]
    
    const scale = getScale(processedZpl, match.index!)
    const pos = getFO(processedZpl, match.index!)

    try {
      // Ensure data has start/stop characters for rationalizedCodabar
      let bwipData = data
      const isStartValid = /^[A-D]$/.test(data[0])
      const isStopValid = /^[A-D]$/.test(data[data.length - 1])
      
      if (!isStartValid) bwipData = startChar + bwipData
      if (!isStopValid) bwipData = bwipData + stopChar

      const rawArray = (bwipjs as any).raw('rationalizedCodabar', bwipData, {
        height: height, 
      })
      
      let gfCommand = rasterizeBarcode(rawArray[0], scale) + '^FS'

      if (hrLine) {
        const sbs = rawArray[0].sbs
        const totalWidthUnits = sbs.reduce((a: number, b: number) => a + b, 0)
        const bkWidth = totalWidthUnits * scale
        
        const textH = 22
        let barY = pos.y
        let textY = pos.y
        
        if (hrAbove) {
          barY = pos.y + textH + 2
          textY = pos.y
        } else {
          barY = pos.y
          textY = pos.y + height + 2
        }
        
        gfCommand = `^FO${pos.x},${barY}${gfCommand}`
        const textCmd = `^FO${pos.x},${textY}^A0N,${textH},${textH - 6}^FB${bkWidth},1,0,C^FD${bwipData}^FS`
        gfCommand = `${gfCommand}${textCmd}`
      }
      
      // Replace the entire block: ^BK[params]...^FD[data]^FS
      processedZpl = processedZpl.substring(0, match.index!) + gfCommand + processedZpl.substring(match.index! + fullMatch.length)
    } catch (e) { console.warn('BK build fail', e) }
  }

  return processedZpl
}

/**
 * Main rendering utility that mirrors the api_zpl_render_js Post Handler logic.
 * @param zpl Raw ZPL string
 * @param options Rendering configuration (widthMm, heightMm, dpi)
 */
export const renderZplToPng = async (zpl: string, options: { widthMm: number, heightMm: number, dpi: number }) => {
  if (!zpl || typeof zpl !== 'string' || zpl.trim().length === 0) {
    throw new Error('ZPL code is required');
  }

  const { widthMm, heightMm, dpi } = options;
  // Unit conversion: DPI -> dpmm (203 DPI -> 8 dpmm, 300 DPI -> 12 dpmm)
  const dpmm = dpi === 300 ? 12 : 8;

  try {
    // 1. Pre-process ZPL to handle polyfills (like ^BK)
    const processedZpl = await preprocessZpl(zpl);

    // 2. Render ZPL to Base64 PNGs using zpl-renderer-js
    const base64Array = await zplToBase64MultipleAsync(processedZpl, widthMm, heightMm, dpmm);

    return base64Array;
  } catch (error) {
    console.error('Rendering error:', error);
    throw error;
  }
}
