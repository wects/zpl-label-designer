<template>
  <div class="layout-container vertical-flow">
    <header class="app-header">
      <div class="header-content">
        <div class="brand-logo-group">
          <div class="brand-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <!-- Background: Faded 1D Barcode Strip -->
              <g opacity="0.22" fill="#4D148C">
                <rect x="0" y="8" width="1.2" height="8"></rect>
                <rect x="3" y="8" width="2.6" height="8"></rect>
                <rect x="7" y="8" width="1" height="8"></rect>
                <rect x="9.5" y="8" width="4.2" height="8"></rect>
                <rect x="15.5" y="8" width="1.5" height="8"></rect>
                <rect x="18.5" y="8" width="2.8" height="8"></rect>
                <rect x="22.5" y="8" width="1" height="8"></rect>
              </g>
              <!-- Detailed Skeuomorphic Compass -->
              <g stroke="#4D148C" stroke-linecap="round" stroke-linejoin="round">
                <!-- Adjustment Screw (The "V" shape logic with a bar) -->
                <path d="M7.5 12 H16.5" stroke-width="0.8" opacity="0.8"></path>
                <circle cx="12" cy="12" r="1.2" fill="#4D148C" stroke="none"></circle>
                <!-- Main Legs -->
                <path d="M11 3.5 L5 21" stroke-width="2.2"></path>
                <path d="M13 3.5 L19 21" stroke-width="2.2"></path>
                <!-- Sharp Tips -->
                <path d="M5 21 L4.5 23.5" stroke-width="0.8"></path>
                <path d="M19 21 L19.5 23.5" stroke-width="0.8"></path>
                <!-- Top Joint -->
                <circle cx="12" cy="3.5" r="2.2" stroke-width="1.2" fill="white"></circle>
                <rect x="11.2" y="0" width="1.6" height="3" rx="0.5" fill="#4D148C" stroke="none"></rect>
              </g>
            </svg>
          </div>
          <h1>ZPL Label Designer</h1>
        </div>
        
        <div class="header-actions">
          <a href="https://www.wects.com" target="_blank" class="nav-link">wects.com</a>
          <div class="nav-divider"></div>
          <a href="https://github.com/wects/zpl-label-designer" target="_blank" class="github-link" title="Star on GitHub">
            <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>

    <div class="main-workspace">
      <!-- 1. Left Column: Canvas Editor & Actions -->
      <div class="main-left">
        <section class="canvas-section">
          <div class="workspace">
              <div class="canvas-main">
                <div class="canvas-container-wrapper" :class="currentRegion + '-bg'">
                  <div class="canvas-tabs-inline">
                    <button class="pill-btn purple" :class="{ 'active': currentRegion === 'purple' }" @click="switchRegion('purple')">
                      Zone 1
                    </button>
                    <button class="pill-btn orange" :class="{ 'active': currentRegion === 'orange' }" @click="switchRegion('orange')">
                      Zone 2
                    </button>
                  </div>

                  <div class="canvas-wrapper" 
                    :class="currentRegion + '-border'"
                    :style="{ aspectRatio: regionConfigs[currentRegion].w + ' / ' + regionConfigs[currentRegion].h }">
                    <canvas id="designer-canvas"></canvas>
                    <div class="canvas-marker h-marker-1-4"></div>
                    <div class="canvas-marker h-marker-1-2"></div>
                    <div class="canvas-marker h-marker-3-4"></div>
                  </div>
                  
                  <div class="canvas-toolbar">
                    <button class="tool-btn" @click="addNativeText" title="Add English (Native)">
                      <span class="icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 20L12 4l8 16M7 14h10" />
                        </svg>
                      </span>
                    </button>
                    <button class="tool-btn" @click="addNativeBarcode" title="Add 1D Barcode (Code128)">
                      <span class="icon">
                        <svg viewBox="0 0 24 24" width="22" height="18" fill="currentColor">
                          <rect x="2" y="4" width="1.5" height="16" />
                          <rect x="5" y="4" width="3" height="16" />
                          <rect x="10" y="4" width="1" height="16" />
                          <rect x="13" y="4" width="4" height="16" />
                          <rect x="19" y="4" width="2.5" height="16" />
                        </svg>
                      </span>
                    </button>
                    <button class="tool-btn" @click="addQrCode" title="Add QR Code (Native)">
                      <span class="icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                          <path d="M14 14h1v1h-1zM18 14h3v3h-3zM14 18h3v3h-3zM18 18h1v1h-1z" fill="currentColor" stroke="none" />
                        </svg>
                      </span>
                    </button>
                    <button class="tool-btn" @click="addDataMatrix" title="Add DataMatrix (Native)">
                      <span class="icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M3 3h2v18h16v-2H5V3z" />
                          <rect x="7" y="3" width="2" height="2" /><rect x="11" y="3" width="2" height="2" /><rect x="15" y="3" width="2" height="2" /><rect x="19" y="3" width="2" height="2" />
                          <rect x="19" y="7" width="2" height="2" /><rect x="19" y="11" width="2" height="2" /><rect x="19" y="15" width="2" height="2" />
                          <rect x="8" y="8" width="3" height="3" /><rect x="14" y="8" width="2" height="2" />
                          <rect x="8" y="14" width="2" height="2" /><rect x="14" y="14" width="3" height="3" />
                        </svg>
                      </span>
                    </button>
                    <button class="tool-btn" @click="addChineseText" title="Add Graphic Text (Support Chinese)">
                      <span class="icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
                        </svg>
                      </span>
                    </button>
                    <button class="tool-btn" @click="triggerImageUpload" title="Add Image (JPG/PNG)">
                      <span class="icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </span>
                    </button>

                    <div v-if="selectedObj" class="toolbar-spacer"></div>

                    <button v-if="selectedObj" class="tool-btn" @click="duplicateSelected" title="Duplicate selected item">
                      <span class="icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      </span>
                    </button>
                    
                    <input type="file" ref="imageInput" style="display: none;" accept="image/*" @change="handleImageUpload" />
                    
                    <button class="tool-btn danger-outline" :class="{ 'reset-confirm-active': isClearAllConfirming }" @click="handleClearAllClick" title="CLEAR ALL ITEMS">
                      {{ isClearAllConfirming ? 'CLICK TO CONFIRM CLEAR' : 'CLEAR ALL' }}
                    </button>
                  </div>

                  <div class="properties-bar-inline" :class="[currentRegion + '-theme', { 'no-selection': !selectedObj }]" style="height: 42px; box-sizing: border-box;">
                    <div v-if="selectedObj" style="display: flex; align-items: center; width: 100%; gap: 24px;">
                      <!-- Left Group: Metadata (Horizontal) -->
                      <div style="display: flex; align-items: center; gap: 20px; flex-shrink: 0;">
                        <div class="prop-item-row">
                          <span class="prop-label">TYPE</span>
                          <span class="pos-value" style="color: #4D148C;">{{ selectedTypeLabel }}</span>
                        </div>
                        <div class="prop-item-row" style="min-width: 80px;">
                          <span class="prop-label">POS</span>
                          <span class="pos-value">{{ posX }}, {{ posY }}</span>
                        </div>
                        <div v-if="selectedObj._zpl_type === 'native_qr' || selectedObj._zpl_type === 'native_datamatrix'" class="prop-item-row">
                          <span class="prop-label">MAG</span>
                          <span class="pos-value" style="color: #4D148C;">{{ editMag }}</span>
                        </div>
                      </div>
                      
                      <!-- Right Group: Primary Value -->
                      <div class="prop-item-v" style="flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0;">
                        <span class="prop-label" style="flex-shrink: 0;">VALUE</span>
                        <input type="text" v-model="editValue" @input="updateSelectedValue" placeholder="Content..." style="width: 100%;" />
                      </div>
                    </div>
                    <div v-else class="prop-placeholder">
                      <span class="prop-label" style="opacity: 0.5;">No selection - Select an item to edit</span>
                    </div>
                  </div>
                </div>

                <div class="bottom-controls-container">
                  <div class="controls-grid">
                    <!-- Left Column: Actions -->
                    <div class="controls-column">
                      <div class="controls-group-title">Actions</div>
                      <div class="actions-stack">
                        <button class="btn primary" @click="showTemplateModal = true">
                          Load Template
                        </button>
                        <div class="view-zpl-row">
                          <button class="btn" :disabled="!hasDesignerContent" @click="zplViewTarget = 'full'; showZplViewModal = true">Full ZPL</button>
                          <button class="btn" :disabled="!hasDesignerContent" @click="zplViewTarget = 'designer'; showZplViewModal = true">Designer ZPL</button>
                        </div>
                        <button class="btn danger-outline" :class="{ 'reset-confirm-active': isResetConfirming }" @click="handleResetClick">
                          {{ isResetConfirming ? 'Click to Confirm Reset' : 'Reset Designer' }}
                        </button>
                      </div>
                    </div>
                    
                    <!-- Right Column: Settings -->
                    <div class="controls-column">
                      <div class="controls-group-title">Settings</div>
                      <div class="settings-stack">
                        <!-- Label Size -->
                        <div class="setting-item">
                          <span class="setting-label">Label Size</span>
                          <div class="setting-buttons">
                            <button v-for="size in labelSizes" :key="size.val"
                              class="setting-pill" :class="{ active: labelSize === size.val }"
                              @click="updateLabelSize(size.val)">
                              {{ size.label }}
                            </button>
                          </div>
                        </div>
                        
                        <!-- Barcode Settings -->
                        <div class="setting-item">
                          <span class="setting-label">Code128 text</span>
                          <div class="setting-buttons">
                            <button class="setting-pill" :class="{ active: code128HR }" @click="code128HR = true">Show</button>
                            <button class="setting-pill" :class="{ active: !code128HR }" @click="code128HR = false">Hide</button>
                            <span class="setting-divider"></span>
                            <button class="setting-pill" :class="{ active: code128HRPos === 'bottom' }" @click="code128HRPos = 'bottom'" :disabled="!code128HR">Below</button>
                            <button class="setting-pill" :class="{ active: code128HRPos === 'top' }" @click="code128HRPos = 'top'" :disabled="!code128HR">Above</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        <div class="desktop-actions-container" style="width: auto;">
          <div class="action-layout-grid-row">
            <div class="regional-layout-mini" 
                 :style="{ right: miniPosX + 'px', top: '50%', transform: `translateY(calc(-50% - ${miniPosY}px))`, cursor: activeInteraction === 'mini' ? 'grabbing' : 'grab' }"
                 @pointerdown="startMiniDrag">
              <div class="preview-panel" ref="previewPanelRef" :style="{ aspectRatio: '812 / ' + currentLabelConfig.h }" title="Drag to move, use bottom handle to resize">
                <div class="preview-box purple-box" 
                  :class="{ active: currentRegion === 'purple', 'is-dragging': activeInteraction === 'drag' && interactingRegion === 'purple' }" 
                  :style="{ 
                    top: previewBoxTopPurple + '%', 
                    left: previewBoxLeftPurple + '%',
                    height: (regionConfigs.purple.h / currentLabelConfig.h * 100) + '%'
                  }"
                  @pointerdown="startDrag($event, 'purple')">
                  <span class="zone-tag">1</span>
                  <div class="resize-handle bottom" @pointerdown="startResize($event, 'purple')"></div>
                </div>
                <div class="preview-box orange-box" 
                  :class="{ active: currentRegion === 'orange', 'is-dragging': activeInteraction === 'drag' && interactingRegion === 'orange' }" 
                  :style="{ 
                    top: previewBoxTopOrange + '%', 
                    left: previewBoxLeftOrange + '%',
                    height: (regionConfigs.orange.h / currentLabelConfig.h * 100) + '%'
                  }"
                  @pointerdown="startDrag($event, 'orange')">
                  <span class="zone-tag">2</span>
                  <div class="resize-handle bottom" @pointerdown="startResize($event, 'orange')"></div>
                </div>
              </div>
              <div class="region-stats">
                 <div class="stat-row">Z1 H: {{ regionConfigs.purple.h }} dots</div>
                 <div class="stat-row">Z2 H: {{ regionConfigs.orange.h }} dots</div>
                 <div class="stat-divider"></div>
                 <div class="stat-row">Res: 812 x {{ currentLabelConfig.h }} dots</div>
                 <div class="stat-label">Size: 4" x {{ currentLabelConfig.h_in }}"</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="main-right">
        <div class="png-section">

          <div class="png-preview-box" :class="{ 'is-empty': !pngData }" @click="pngData ? viewPngInNewTab() : null" :style="{ position: 'relative', cursor: pngData ? 'pointer' : 'default' }">
             <img v-if="pngData" :src="pngData" alt="PNG Preview" class="png-preview-img" />
             <div v-else class="png-placeholder">
               <div class="placeholder-graphic">
                 <svg width="100" height="130" viewBox="0 0 120 160" fill="none">
                   <rect x="10" y="10" width="100" height="140" rx="6" fill="white" stroke="#cbd5e1" stroke-width="2"/>
                   <rect x="25" y="30" width="70" height="4" rx="2" fill="#f1f5f9"/>
                   <rect x="25" y="42" width="45" height="4" rx="2" fill="#f1f5f9"/>
                   <rect x="25" y="65" width="70" height="40" rx="3" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
                   <g opacity="0.4">
                     <rect x="35" y="75" width="2" height="20" fill="#94a3b8"/><rect x="40" y="75" width="5" height="20" fill="#94a3b8"/><rect x="48" y="75" width="1" height="20" fill="#94a3b8"/>
                     <rect x="52" y="75" width="3" height="20" fill="#94a3b8"/><rect x="58" y="75" width="2" height="20" fill="#94a3b8"/><rect x="63" y="75" width="5" height="20" fill="#94a3b8"/>
                     <rect x="71" y="75" width="1" height="20" fill="#94a3b8"/><rect x="75" y="75" width="4" height="20" fill="#94a3b8"/><rect x="82" y="75" width="2" height="20" fill="#94a3b8"/>
                   </g>
                   <circle cx="60" cy="125" r="8" fill="#f1f5f9"/>
                 </svg>
               </div>
               <div class="placeholder-text">Waiting for Design</div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showTemplateModal" class="modal-overlay" @click.self="showTemplateModal = false">
      <div class="modal-content" style="width: 800px; max-width: 90vw;">
        <h2>Load ZPL Template</h2>
        <div style="margin-bottom: 12px; font-size: 0.85rem; color: #64748b;">
          Paste your existing ZPL template here. The designer will render it as a background and overlay your current canvas items.
        </div>
        <textarea v-model="rawTemplateInput" placeholder="^XA...^XZ" style="width: 100%; min-height: 350px;"></textarea>
        <div class="modal-actions">
          <button class="btn btn-sm" style="color: #64748b;" @click="showTemplateModal = false">Cancel</button>
          <button class="btn primary" @click="analyzeTemplate">Apply & Render Template</button>
        </div>
      </div>
    </div>

    <!-- ZPL View Modal -->
    <div v-if="showZplViewModal" class="modal-overlay" @click.self="showZplViewModal = false">
      <div class="modal-content" style="width: 800px; max-width: 90vw;">
        <h2>{{ zplViewTarget === 'full' ? 'Full ZPL Output' : 'Designer ZPL Output' }}</h2>
        <div style="margin-bottom: 12px; font-size: 0.85rem; color: #64748b;" v-if="zplViewTarget === 'full'">
          This includes the base template plus your designer-added items.
        </div>
        <div style="margin-bottom: 12px; font-size: 0.85rem; color: #64748b;" v-else>
          Only the items added in the designer.
        </div>
        <div style="position: relative;">
          <div class="code-viewer-container">
            <pre v-html="highlightedZPL"></pre>
          </div>
          <!-- Hidden textarea for easy fallback if needed -->
          <textarea :value="zplViewTarget === 'full' ? fullZPL : designerZPL" readonly 
            style="position: absolute; opacity: 0; pointer-events: none; height: 0;"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-sm" @click="copyZPL" :disabled="isCopying">
            {{ isCopying ? 'Copied!' : 'Copy to Clipboard' }}
          </button>
          <button class="btn primary" @click="showZplViewModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, shallowRef, ref, computed, watch } from 'vue'
import * as fabricModule from 'fabric'
import * as bwipjs from 'bwip-js' 
import { renderZplToPng } from '../utils/zpl-renderer'

const fabric = fabricModule.fabric
const { toCanvas: bwipToCanvas } = bwipjs
import {
  generateNativeTextZPL,
  generateNativeBarcodeZPL,
  generateNativeQrZPL,
  generateNativeDataMatrixZPL,
  generateGraphicZPL,
  buildZPL,
  imageDataToHex,
  clipZplHex
} from '../utils/zpl'

const canvas = shallowRef(null)
const previewPanelRef = ref(null)
const imageInput = ref(null)
const fullZPL = ref('^XA\n^XZ')
const designerZPL = ref('^XA\n^XZ')
const selectedObj = shallowRef(null)
const editValue = ref('')
const editMag = ref(1)
const posX = ref(0)
const posY = ref(0)
const pngData = ref(null)
const isRendering = ref(false)
const showZplViewModal = ref(false)
const zplViewTarget = ref('full')
const showTemplateModal = ref(false)
const baseTemplate = ref('')
const rawTemplateInput = ref('')
const labelsFound = ref([])
const selectedLabelIdx = ref(-1)
const isAnalyzing = ref(false)
const isResetConfirming = ref(false)
const isClearAllConfirming = ref(false)
const isCopying = ref(false)
const renderTimer = ref(null)

const debouncedGenerateZPL = () => {
  if (renderTimer.value) clearTimeout(renderTimer.value)
  renderTimer.value = setTimeout(() => {
    handleGenerateZPL()
    renderTimer.value = null
  }, 300)
}

const currentRegion = ref('purple')
const regionConfigs = ref({
  purple: { x: 0, y: 0, w: 812, h: 152 },
  orange: { x: 0, y: 940, w: 812, h: 152 }
})
const regionData = ref({ purple: [], orange: [] })
const labelSize = ref('6.75')
const labelSizes = [
  { label: '4x6"', val: '6', h: 1218, h_in: '6' },
  { label: '4x6.75"', val: '6.75', h: 1370, h_in: '6.75' },
  { label: '4x8"', val: '8', h: 1624, h_in: '8' },
  { label: '4x9"', val: '9', h: 1827, h_in: '9' },
  { label: '4x10.5"', val: '10.5', h: 2132, h_in: '10.5' }
]
const currentLabelConfig = computed(() => labelSizes.find(s => s.val === labelSize.value))
const code128HR = ref(true)
const code128HRPos = ref('bottom')

// Drag/Resize logic for mini-map
const miniPosX = ref(32); const miniPosY = ref(0);
const isMiniDragging = ref(false)
const activeInteraction = ref(null) // 'drag', 'resize', 'mini'
const interactingRegion = ref(null) // 'purple', 'orange'
const startY = ref(0)
const startX = ref(0)
const initialH = ref(0)
const initialY = ref(0)
const initialMiniX = ref(0)
const initialMiniY = ref(0)

const isChangingRegion = ref(false)

const startMiniDrag = (e) => {
  activeInteraction.value = 'mini'
  startX.value = e.clientX
  startY.value = e.clientY
  initialMiniX.value = miniPosX.value
  initialMiniY.value = miniPosY.value
}

const startDrag = (e, region) => {
  e.stopPropagation()
  activeInteraction.value = 'drag'
  interactingRegion.value = region
  startY.value = e.clientY
  initialY.value = regionConfigs.value[region].y
}

const startResize = (e, region) => {
  e.stopPropagation()
  activeInteraction.value = 'resize'
  interactingRegion.value = region
  startY.value = e.clientY
  initialH.value = regionConfigs.value[region].h
}

const constrainRegions = (totalH) => {
  const minH = 40
  const z1 = regionConfigs.value.purple
  const z2 = regionConfigs.value.orange

  const limitZone = (zone, id) => {
    zone.h = Math.max(minH, zone.h);
    if (zone.y < 0) zone.y = 0;
    if (zone.y + zone.h > totalH) {
      if (activeInteraction.value === 'resize' && interactingRegion.value === id) {
        zone.h = Math.max(minH, totalH - zone.y);
      } else {
        zone.y = Math.max(0, totalH - zone.h);
      }
    }
  }

  limitZone(z1, 'purple');
  limitZone(z2, 'orange');

  // 4. Sync Canvas Dimensions if active region height changed
  if (canvas.value) {
    const activeH = regionConfigs.value[currentRegion.value].h
    if (Math.abs(canvas.value.height - activeH) > 1) {
      canvas.value.setDimensions({ width: 812, height: activeH })
    }
  }
}

const handlePointerMove = (e) => {
  if (!activeInteraction.value) return
  
  if (activeInteraction.value === 'mini') {
    const dx = e.clientX - startX.value
    const dy = e.clientY - startY.value
    miniPosX.value = initialMiniX.value - dx
    miniPosY.value = initialMiniY.value - dy
    return
  }

  const rect = previewPanelRef.value.getBoundingClientRect()
  const ratio = currentLabelConfig.value.h / rect.height
  const dy = (e.clientY - startY.value) * ratio
  const totalH = currentLabelConfig.value.h
  const minH = 40

  if (activeInteraction.value === 'drag') {
    const newY = Math.round(initialY.value + dy)
    if (interactingRegion.value === 'purple') {
      regionConfigs.value.purple.y = newY
    } else {
      regionConfigs.value.orange.y = newY
    }
  } else if (activeInteraction.value === 'resize') {
    const newH = Math.round(initialH.value + dy)
    if (interactingRegion.value === 'purple') {
      regionConfigs.value.purple.h = newH
    } else {
      regionConfigs.value.orange.h = newH
    }
  }
  
  // Always apply constraints after any interaction move
  constrainRegions(totalH)
  debouncedGenerateZPL()
}

const handlePointerUp = () => {
  activeInteraction.value = null
  interactingRegion.value = null
}

const previewBoxTopPurple = computed(() => (regionConfigs.value.purple.y / currentLabelConfig.value.h * 100))
const previewBoxLeftPurple = computed(() => (regionConfigs.value.purple.x / 812 * 100))
const previewBoxTopOrange = computed(() => (regionConfigs.value.orange.y / currentLabelConfig.value.h * 100))
const previewBoxLeftOrange = computed(() => (regionConfigs.value.orange.x / 812 * 100))

const updateObjectZplCache = (obj) => {
  if (!obj || !['_zpl_type', '_zpl_value'].every(k => k in obj)) return;
  if (obj._zpl_type !== 'graphic_text' && obj._zpl_type !== 'image') return;

  try {
    const val = obj._zpl_value || '';
    const dW = Math.max(1, Math.round(obj.getScaledWidth ? obj.getScaledWidth() : (obj.width * (obj.scaleX || 1))));
    const dH = Math.max(1, Math.round(obj.getScaledHeight ? obj.getScaledHeight() : (obj.height * (obj.scaleY || 1))));
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = dW;
    tempCanvas.height = dH;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      if (obj._zpl_type === 'graphic_text') {
        tempCtx.fillStyle = 'black';
        const fontSize = obj.fontSize || 30;
        const scaleY = obj.scaleY || 1;
        tempCtx.font = `${Math.round(fontSize * scaleY)}px sans-serif`;
        tempCtx.textBaseline = 'top';
        
        const bW = tempCtx.measureText(val).width;
        if (bW > 0 && dW > 0 && Math.abs(bW - dW) > 5) {
          tempCtx.save();
          tempCtx.scale(dW / bW, 1);
          tempCtx.fillText(val, 0, 0);
          tempCtx.restore();
        } else {
          tempCtx.fillText(val, 0, 0);
        }
      } else {
        const imgEl = obj.getElement ? obj.getElement() : (obj._element || null);
        if (imgEl) {
          tempCtx.drawImage(imgEl, 0, 0, dW, dH);
        }
      }
      
      const gHex = imageDataToHex(tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height));
      obj._zpl_cache = {
        hex: gHex.hexString,
        bytes: gHex.totalBytes,
        bpr: gHex.bytesPerRow,
        originalWidth: dW
      };
    }
  } catch (e) {
    console.warn('Failed to update ZPL cache', e);
  }
}

const handleGenerateZPL = async () => {
  if (!canvas.value || isChangingRegion.value) return
  
  // 1. Sync current canvas to regionData (Capturing ABSOLUTE coordinates)
  const propsToKeep = [
    '_zpl_type', '_zpl_value', '_zpl_barHeight', '_zpl_mag', 
    'scaleX', 'scaleY', '_zpl_cache', 
    'left', 'top', 'width', 'height', 'fontSize'
  ]
  regionData.value[currentRegion.value] = canvas.value.getObjects().map(obj => {
    // Ensure absolute coordinates are recalculated
    obj.setCoords()
    const base = obj.toObject(propsToKeep)
    
    // aCoords.tl gives the absolute top-left point on the canvas
    const tl = obj.aCoords.tl
    
    // For scaling, we still derive it from the matrix as it's most reliable
    const matrix = obj.calcTransformMatrix()
    
    return {
      ...base,
      left: tl.x,
      top: tl.y,
      scaleX: matrix[0],
      scaleY: matrix[3]
    }
  })

  const generateCmds = async (objects, offsetX, offsetY) => {
    const cmds = []
    for (const obj of objects) {
      try {
        // These objects are now plain JS objects with global coordinates already injected
        const left = obj.left
        const top = obj.top
        const scaleX = obj.scaleX || 1
        const scaleY = obj.scaleY || 1

        const x = Math.round(left + offsetX)
        const y = Math.round(top + offsetY)
        const val = obj._zpl_value || ''
        
        // Handle left boundary clipping (x < 0)
        if (x < 0 && (obj._zpl_type === 'graphic_text' || obj._zpl_type === 'image')) {
          const width = Math.round((obj.width || 0) * scaleX)
          if (x + width <= 0) continue 

          if (obj._zpl_cache && obj._zpl_cache.originalWidth) {
            const clipped = clipZplHex(obj._zpl_cache.hex, obj._zpl_cache.originalWidth, -x)
            if (clipped) {
              cmds.push(generateGraphicZPL(clipped.hexString, 0, y, clipped.totalBytes, clipped.bytesPerRow))
              continue 
            }
          }
        }

        if (obj._zpl_type === 'native_text') {
          const fontSize = obj.fontSize || 32
          cmds.push(generateNativeTextZPL(val, x, y, Math.round(fontSize * scaleX), Math.round(fontSize * scaleY)))
        } else if (obj._zpl_type === 'native_barcode') {
          const byWidth = Math.max(1, Math.round(2 * scaleX))
          const barHeight = Math.round((obj._zpl_barHeight || 100) * scaleY)
          cmds.push(generateNativeBarcodeZPL(val, x, y, barHeight, byWidth, code128HR.value, code128HRPos.value === 'top'))
        } else if (obj._zpl_type === 'native_qr') {
          const mag = Math.max(1, Math.min(20, Math.round(6 * scaleX)))
          cmds.push(generateNativeQrZPL(val, x, y, mag))
        } else if (obj._zpl_type === 'native_datamatrix') {
          const moduleSize = Math.max(1, Math.round(6 * scaleX))
          cmds.push(generateNativeDataMatrixZPL(val, x, y, moduleSize))
        } else if (obj._zpl_type === 'graphic_text' || obj._zpl_type === 'image') {
          if (obj._zpl_cache) {
            cmds.push(generateGraphicZPL(obj._zpl_cache.hex, x, y, obj._zpl_cache.bytes, obj._zpl_cache.bpr))
          }
        }
      } catch (itemErr) {
        console.warn('Sync item fail:', itemErr)
      }
    }
    return cmds
  }

  try {
    const pCmds = await generateCmds(regionData.value.purple, regionConfigs.value.purple.x, regionConfigs.value.purple.y)
    const oCmds = await generateCmds(regionData.value.orange, regionConfigs.value.orange.x, regionConfigs.value.orange.y)
    const all = [...pCmds, ...oCmds].filter(c => !!c)
    
    designerZPL.value = all.join('\n')
    fullZPL.value = buildZPL(all, 812, currentLabelConfig.value.h, baseTemplate.value)
    
    const widthMm = 102 // Round to integer for better compatibility
    const heightMm = Math.round(parseFloat(currentLabelConfig.value.h_in) * 25.4)
    
    // Ensure ZPL has the correct label length!
    const zplWithLL = fullZPL.value.replace(/\^XA/i, `^XA\n^LL${currentLabelConfig.value.h}\n`)
    
    const res = await renderZplToPng(zplWithLL, { widthMm, heightMm, dpi: 203 })
    if (res && res.length > 0) {
      pngData.value = `data:image/png;base64,${res[0]}`
    } else {
      pngData.value = null
    }
  } catch (e) {
    console.error("Render fail", e)
    pngData.value = null
  }
}

const switchRegion = async (newRegion) => {
  if (isChangingRegion.value || newRegion === currentRegion.value) return
  isChangingRegion.value = true
  
  try {
    if (canvas.value) {
      const propsToKeep = ['_zpl_type', '_zpl_value', '_zpl_barHeight', '_zpl_mag', 'scaleX', 'scaleY', '_zpl_cache']
      regionData.value[currentRegion.value] = canvas.value.getObjects().map(obj => obj.toObject(propsToKeep))
      canvas.value.discardActiveObject()
      canvas.value.clear()
    }
    
    currentRegion.value = newRegion
    const conf = regionConfigs.value[newRegion]
    if (canvas.value) {
      canvas.value.setDimensions({ width: conf.w, height: conf.h })
      if (regionData.value[newRegion].length > 0) {
        fabric.util.enlivenObjects(regionData.value[newRegion], (objects) => {
          objects.forEach((obj, i) => {
            // Restore custom props
            const data = regionData.value[newRegion][i]
            obj._zpl_type = data._zpl_type
            obj._zpl_value = data._zpl_value
            obj._zpl_barHeight = data._zpl_barHeight
            obj._zpl_mag = data._zpl_mag
            obj._zpl_cache = data._zpl_cache
            canvas.value.add(obj)
          })
          
          // Re-render barcodes to ensure canvas settings (HR/Pos) are applied to enlivened objects
          objects.forEach(async (obj) => {
            if (obj._zpl_type === 'native_barcode') {
               const dataUrl = await renderBarcode('code128', obj._zpl_value, { 
                 height: 10, 
                 includetext: code128HR.value, 
                 textxalign: 'center' 
               })
               obj.setSrc(dataUrl, () => canvas.value?.requestRenderAll())
            }
          })

          canvas.value.requestRenderAll()
        })
      }
    }
  } finally {
    isChangingRegion.value = false
    debouncedGenerateZPL()
  }
}

// --- Barcode Rendering Helper ---
const renderBarcode = async (bcid, text, options = {}) => {
  const tempCanvas = document.createElement('canvas')
  try {
    // bwip-js browser usage
    await bwipToCanvas(tempCanvas, {
      bcid,
      text,
      scale: 2,
      ...options
    })
    return tempCanvas.toDataURL('image/png')
  } catch (e) {
    console.error('Barcode render fail', e)
    // Fallback: black square
    tempCanvas.width = 100
    tempCanvas.height = 100
    const ctx = tempCanvas.getContext('2d')
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 100, 100)
    return tempCanvas.toDataURL('image/png')
  }
}

// --- Component Addition ---
const addObjectToCanvas = (obj) => {
  if (!canvas.value) return
  
  // Dynamic positioning: center horizontally and place near top to stay visible on small zones
  const targetTop = Math.max(0, Math.min(10, canvas.value.height - 20))
  const targetLeft = Math.max(0, (canvas.value.width - (obj.getScaledWidth ? obj.getScaledWidth() : 100)) / 2)

  obj.set({
    left: targetLeft,
    top: targetTop,
    cornerColor: '#4D148C',
    transparentCorners: false,
    borderColor: '#4D148C',
    cornerStrokeColor: '#4D148C',
    padding: 8
  })
  canvas.value.add(obj)
  canvas.value.setActiveObject(obj)
  canvas.value.requestRenderAll()
  
  if (obj._zpl_type === 'graphic_text' || obj._zpl_type === 'image') {
    updateObjectZplCache(obj)
  }
  debouncedGenerateZPL()
}

const addNativeText = () => {
  const text = new fabric.Text('ACME CORP', {
    fontSize: 32,
    fontFamily: 'Arial Narrow, sans-serif',
    fontWeight: 'bold',
    fill: '#000000',
    editable: false
  })
  text._zpl_type = 'native_text'
  text._zpl_value = 'ACME CORP'
  addObjectToCanvas(text)
}

const addNativeBarcode = async () => {
  const val = 'PO#123456'
  const dataUrl = await renderBarcode('code128', val, { 
    height: 10, 
    includetext: code128HR.value, 
    textxalign: 'center' 
  })
  
  fabric.Image.fromURL(dataUrl, (img) => {
    img._zpl_type = 'native_barcode'
    img._zpl_value = val
    img._zpl_barHeight = 100
    addObjectToCanvas(img)
  })
}

const addQrCode = async () => {
  const val = 'PO#123456'
  const dataUrl = await renderBarcode('qrcode', val)
  
  fabric.Image.fromURL(dataUrl, (img) => {
    img.scaleToWidth(100)
    img._zpl_type = 'native_qr'
    img._zpl_value = val
    addObjectToCanvas(img)
  })
}

const addDataMatrix = async () => {
  const val = 'PO#123456'
  const dataUrl = await renderBarcode('datamatrix', val)
  
  fabric.Image.fromURL(dataUrl, (img) => {
    img.scaleToWidth(60)
    img._zpl_type = 'native_datamatrix'
    img._zpl_value = val
    addObjectToCanvas(img)
  })
}

const addChineseText = () => {
  const text = new fabric.Text('甲乙丙丁公司', {
    fontSize: 40,
    fontFamily: 'sans-serif',
    editable: false
  })
  text._zpl_type = 'graphic_text'
  text._zpl_value = '甲乙丙丁公司'
  addObjectToCanvas(text)
}

const triggerImageUpload = () => imageInput.value?.click()
const handleImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file || !canvas.value) return
  
  const reader = new FileReader()
  reader.onload = (f) => {
    const dataUrl = f.target?.result
    if (!dataUrl) return

    fabric.Image.fromURL(dataUrl, (img) => {
      if (!img) return
      img.scaleToWidth(200)
      img.set({
        _zpl_type: 'image',
        _zpl_value: file.name
      })
      updateObjectZplCache(img)
      addObjectToCanvas(img)
      canvas.value.renderAll()
    }, { crossOrigin: 'anonymous' })
  }
  reader.readAsDataURL(file)
  e.target.value = '' // Clear so same file can be uploaded again
}

const duplicateSelected = () => {
    if (!selectedObj.value || !canvas.value) return
    const props = [
        '_zpl_type', '_zpl_value', '_zpl_barHeight', '_zpl_mag', 
        '_zpl_cache', 'scaleX', 'scaleY'
    ]
    selectedObj.value.clone((cloned) => {
        cloned.set({
            left: selectedObj.value.left + 20,
            top: selectedObj.value.top + 20,
            cornerColor: '#4D148C',
            transparentCorners: false,
            borderColor: '#4D148C',
            cornerStrokeColor: '#4D148C',
            padding: 8
        })
        canvas.value.add(cloned)
        canvas.value.setActiveObject(cloned)
        canvas.value.requestRenderAll()
        debouncedGenerateZPL()
    }, props)
}

// --- Management ---
const handleClearAllClick = () => {
  if (!isClearAllConfirming.value) {
    isClearAllConfirming.value = true
    setTimeout(() => isClearAllConfirming.value = false, 3000)
    return
  }
  canvas.value?.clear()
  pngData.value = null
  isClearAllConfirming.value = false
  debouncedGenerateZPL()
}

const handleResetClick = () => {
  if (!isResetConfirming.value) {
    isResetConfirming.value = true
    setTimeout(() => isResetConfirming.value = false, 3000)
    return
  }
  performReset()
}

const performReset = () => {
  isChangingRegion.value = true
  
  // 1. Reset Region Data and Canvas
  regionData.value = { purple: [], orange: [] }
  canvas.value?.clear()
  currentRegion.value = 'purple'
  
  // 2. Reset Region Configurations to Defaults
  regionConfigs.value = {
    purple: { x: 0, y: 0, w: 812, h: 152 },
    orange: { x: 0, y: 940, w: 812, h: 152 }
  }
  
  // 3. Reset Settings
  labelSize.value = '6.75'
  code128HR.value = true
  code128HRPos.value = 'bottom'
  
  // 4. Reset Templates
  baseTemplate.value = ''
  rawTemplateInput.value = ''
  
  // 5. Reset Mini-Map Position
  miniPosX.value = 32
  miniPosY.value = 0
  
  // 6. Reset Canvas Dimensions to Zone 1 Default
  canvas.value.setDimensions({ width: 812, height: 152 })
  
  isResetConfirming.value = false
  isChangingRegion.value = false
  debouncedGenerateZPL()
}

const updateSelectedValue = async () => {
  if (!selectedObj.value) return
  const val = editValue.value
  selectedObj.value._zpl_value = val
  
  if (selectedObj.value.text !== undefined) {
    selectedObj.value.set('text', val)
    canvas.value?.renderAll()
  } else if (['native_barcode', 'native_qr', 'native_datamatrix'].includes(selectedObj.value._zpl_type)) {
    let bcid = ''
    let options = {}
    
    if (selectedObj.value._zpl_type === 'native_barcode') {
      bcid = 'code128'
      options = { height: 10, includetext: code128HR.value, textxalign: 'center' }
    } else if (selectedObj.value._zpl_type === 'native_qr') {
      bcid = 'qrcode'
    } else if (selectedObj.value._zpl_type === 'native_datamatrix') {
      bcid = 'datamatrix'
    }

    if (bcid) {
       const dataUrl = await renderBarcode(bcid, val, options)
       selectedObj.value.setSrc(dataUrl, () => {
         canvas.value?.renderAll()
       })
    }
  }
  
  if (selectedObj.value._zpl_type === 'graphic_text' || selectedObj.value._zpl_type === 'image') {
    updateObjectZplCache(selectedObj.value)
  }
  debouncedGenerateZPL()
}

const updateLabelSize = (val) => {
  labelSize.value = val
  const config = labelSizes.find(s => s.val === val)
  if (config) {
    constrainRegions(config.h)
  }
  debouncedGenerateZPL()
}

// Watchers for settings that affect preview/ZPL
watch([code128HR, code128HRPos], async () => {
  // Update barcodes on current canvas
  if (canvas.value) {
    const objects = canvas.value.getObjects()
    for (const obj of objects) {
      if (obj._zpl_type === 'native_barcode') {
        const dataUrl = await renderBarcode('code128', obj._zpl_value, { 
          height: 10, 
          includetext: code128HR.value, 
          textxalign: 'center' 
        })
        obj.setSrc(dataUrl, () => {
          canvas.value?.renderAll()
        })
      }
    }
  }
  debouncedGenerateZPL()
})

watch(labelSize, () => {
  pngData.value = null // Clear stale preview on size change
  // Canvas dimensions don't strictly need to resize here if they are region-based,
  // but if we want the designer to fill the label, we can adjust logic.
  // Currently designers only see one region at a time.
  debouncedGenerateZPL()
})

const viewPngInNewTab = () => {
  if (!pngData.value) return
  const newWin = window.open()
  if (!newWin) return
  newWin.document.write(`
    <html>
      <head>
        <title>ZPL Label Preview (100%)</title>
        <style>
          body { margin: 0; background: #0f172a; display: flex; flex-direction: column; align-items: center; padding: 60px 0; min-height: 100vh; font-family: sans-serif; }
          img { width: auto; height: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border-radius: 4px; background: white; }
          .info { position: fixed; top: 20px; right: 20px; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.11em; pointer-events: none; }
        </style>
      </head>
      <body>
        <div class="info">ZPL Label HD Preview (1:1)</div>
        <img src="${pngData.value}" />
      </body>
    </html>
  `)
}

const analyzeTemplate = () => {
    baseTemplate.value = rawTemplateInput.value
    showTemplateModal.value = false
    debouncedGenerateZPL()
}

const copyZPL = async () => {
    const text = zplViewTarget.value === 'full' ? fullZPL.value : designerZPL.value
    try {
        await navigator.clipboard.writeText(text)
        isCopying.value = true
        setTimeout(() => isCopying.value = false, 2000)
    } catch (err) {
        console.error('Copy failed', err)
    }
}

const highlightedZPL = computed(() => {
  const zpl = zplViewTarget.value === 'full' ? fullZPL.value : designerZPL.value
  if (!zpl) return ''
  
  // Escape HTML tags to prevent XSS and rendering issues
  let escaped = zpl.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // ONLY highlight the actual user data content (between ^FD and ^FS)
  // We use a warm amber color (#fbbf24) and bold text to make it stand out from the ZPL commands
  escaped = escaped.replace(/(\^FD)([^|^]*?)(\^FS)/gi, (match, p1, p2, p3) => {
    let data = p2;
    let prefix = '';

    // Handle QR Code and DataMatrix mode prefixes (e.g. MA, QA, etc.)
    // These should not be highlighted as "user data" as they are protocol instructions
    const qrPrefixMatch = data.match(/^([MQ][A-Z],)(.*)/i);
    if (qrPrefixMatch) {
       prefix = qrPrefixMatch[1];
       data = qrPrefixMatch[2];
    }
    
    const highlighted = `<span style="color: #fbbf24; font-weight: 800; background: rgba(251, 191, 36, 0.1); padding: 0 2px; border-radius: 2px;">${data}</span>`;
    return p1 + prefix + highlighted + p3;
  });
  
  return escaped;
})

const onSelection = () => {
  const active = canvas.value?.getActiveObject()
  if (!active) {
    selectedObj.value = null
    return
  }
  selectedObj.value = active
  editValue.value = active._zpl_value || (active.text !== undefined ? active.text : '')
  editMag.value = active._zpl_mag || 1
  
  // Use absolute position for display
  const matrix = active.calcTransformMatrix()
  posX.value = Math.round(matrix[4])
  posY.value = Math.round(matrix[5])
}

const selectedTypeLabel = computed(() => {
  if (!selectedObj.value) return ''
  const t = selectedObj.value._zpl_type || ''
  const map = {
    'native_text': 'ENGLISH',
    'native_barcode': 'CODE128',
    'native_qr': 'QR CODE',
    'native_datamatrix': 'DATAMATRIX',
    'graphic_text': 'ANYTEXT',
    'image': 'GRAPH'
  }
  return map[t] || t.toUpperCase() || 'ITEM'
})

const hasDesignerContent = computed(() => {
  return (canvas.value?.getObjects().length > 0) || regionData.value.purple.length > 0 || regionData.value.orange.length > 0
})

onMounted(() => {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    canvas.value = new fabric.Canvas('designer-canvas', { 
        width: 812, 
        height: 152, 
        backgroundColor: '#ffffff',
        preserveObjectStacking: true
    })

    // Customize Controls: Remove Rotate, Add Delete
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: (eventData, transformData) => {
        const target = transformData.target
        if (canvas.value && target) {
          canvas.value.remove(target)
          canvas.value.requestRenderAll()
          debouncedGenerateZPL()
        }
        return true
      },
      render: (ctx, left, top, styleOverride, fabricObject) => {
        ctx.save()
        ctx.translate(left, top)
        ctx.beginPath()
        ctx.arc(0, 0, 12, 0, 2 * Math.PI)
        ctx.fillStyle = '#ef4444'
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(-6, -6)
        ctx.lineTo(6, 6)
        ctx.moveTo(6, -6)
        ctx.lineTo(-6, 6)
        ctx.stroke()
        ctx.restore()
      },
      cornerSize: 24
    })
    fabric.Object.prototype.setControlsVisibility({ mtr: false })
    
    canvas.value.on('selection:created', onSelection)
    canvas.value.on('selection:updated', onSelection)
    canvas.value.on('selection:cleared', onSelection)
    const constrainObject = (obj) => {
      if (!obj || !obj._zpl_type && obj.type !== 'activeSelection') return
      
      const canvasW = canvas.value.width
      const canvasH = canvas.value.height
      const objW = obj.getScaledWidth()
      const objH = obj.getScaledHeight()

      if (obj.left < 0) obj.left = 0
      if (obj.top < 0) obj.top = 0
      if (obj.left + objW > canvasW) obj.left = Math.max(0, canvasW - objW)
      if (obj.top + objH > canvasH) obj.top = Math.max(0, canvasH - objH)
    }

    canvas.value.on('object:moving', (e) => {
        const obj = e.target
        constrainObject(obj)
        
        // Use absolute position for UI display
        const matrix = obj.calcTransformMatrix()
        posX.value = Math.round(matrix[4])
        posY.value = Math.round(matrix[5])
        debouncedGenerateZPL()
    })
    canvas.value.on('object:scaling', (e) => {
        const obj = e.target
        constrainObject(obj)
        debouncedGenerateZPL()
    })
    canvas.value.on('object:modified', (e) => {
        if (e.target && (e.target._zpl_type === 'graphic_text' || e.target._zpl_type === 'image')) {
          updateObjectZplCache(e.target)
        }
        debouncedGenerateZPL()
    })
})

onUnmounted(() => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
})



</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 1200px;
  background-color: #f8fafc;
  overflow: hidden;
  padding: 24px;
  gap: 20px;
}

.app-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand-logo-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.brand-logo {
  flex-shrink: 0;
  filter: drop-shadow(0 4px 6px rgba(77, 20, 140, 0.15));
}

.app-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #4D148C;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-link {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #4D148C;
}

.nav-divider {
  width: 1px;
  height: 16px;
  background: #e2e8f0;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  background: #0f172a;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.15);
}

.github-link:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2);
}

.github-link svg {
  margin-bottom: 2px;
}

/* Main Workspace Grid */
.main-workspace {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.main-left {
  width: 870px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding-right: 4px;
}

.main-right {
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Canvas Area */
.canvas-container-wrapper {
  background: white;
  border-radius: 12px;
  padding: 20px 20px 12px; /* Reduced bottom padding */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  background-color: #f1f5f9 !important;
  overflow: auto;
  min-height: auto; /* Allow shrink-to-fit */
}

.canvas-container {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  background: white !important;
  border-radius: 4px !important;
}

.canvas-wrapper {
  background: #fff;
  border: 1.5px dashed #cbd5e1;
  border-radius: 4px;
  position: relative;
  box-shadow: none !important;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  box-sizing: content-box;
  min-width: 812px; /* Lock to ZPL dot width */
  margin: 0 auto; /* Center in scroll area */
}

/* Zone-specific dashed indicators (subtle) */
.purple-border { border-color: rgba(77, 20, 140, 0.4) !important; }
.orange-border { border-color: rgba(255, 98, 0, 0.4) !important; }

#designer-canvas {
  max-width: 100%;
  display: block; /* Fix descender gap at bottom */
}


.canvas-toolbar {
  display: flex;
  gap: 8px;
  background: transparent;
  padding: 0;
  margin-top: 20px;
  margin-bottom: 20px;
}

.tool-btn {
  height: 38px;
  width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #475569;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  transition: all 0.2s ease;
}

.tool-btn.danger-outline {
  margin-left: auto;
  width: auto;
  padding: 0 16px;
  color: #ef4444;
  border: 1px solid #fecaca;
}

.tool-btn.reset-confirm-active {
  margin-left: auto;
  width: auto;
  padding: 0 16px;
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.canvas-tabs-inline {
  display: flex;
  gap: 6px;
  background: rgba(148, 163, 184, 0.1);
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 20px;
  width: fit-content;
}

.pill-btn {
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  display: flex;
  align-items: center;
  color: #64748b;
  transition: all 0.2s;
}

.pill-btn.purple { color: #4D148C; }
.pill-btn.purple.active { 
  background: #4D148C; 
  color: white; 
  box-shadow: 0 4px 6px -1px rgba(77, 20, 140, 0.2);
}

.pill-btn.orange { color: #FF6200; }
.pill-btn.orange.active { 
  background: #FF6200; 
  color: white; 
  box-shadow: 0 4px 6px -1px rgba(255, 98, 0, 0.2);
}


.orange-theme {
  border-color: rgba(255, 98, 0, 0.2) !important;
}
.orange-theme .prop-label { color: #cc4e00; }
.orange-theme .pos-value { color: #FF6200; }


/* Properties Bar Refinement */
.properties-bar-inline {
  display: flex;
  align-items: center;
  background: transparent;
  padding: 8px 0;
  margin-bottom: 0;
  border: none;
}

.prop-item-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  white-space: nowrap;
}

.prop-label {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.pos-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
}

.prop-item-v input {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.8rem;
  color: #4D148C;
  font-weight: 500;
  outline: none;
}

.prop-item-v input:focus {
  border-color: #4D148C;
  box-shadow: 0 0 0 3px rgba(77, 20, 140, 0.1);
}

/* Action Buttons & Sidebar */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn.primary {
  background: linear-gradient(135deg, #4D148C 0%, #6b21bc 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(77, 20, 140, 0.3);
}

.btn.danger {
  color: white;
  background: #ef4444;
  border-color: #ef4444;
}

.action-render {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 0 16px;
  height: 38px;
  line-height: 38px;
}

/* Regional Mini Map */
.regional-layout-mini {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  z-index: 100;
  width: 160px;
}

.preview-panel {
  background: #ffffff;
  border-radius: 4px;
  position: relative;
  width: 100%;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
  overflow: hidden;
}

.preview-box {
  position: absolute;
  width: 100%;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.3);
}

.preview-box.active {
  box-shadow: 0 0 0 1.5px white;
  z-index: 2;
}

.purple-box { background: rgba(77, 20, 140, 0.7); }
.orange-box { background: rgba(255, 98, 0, 0.7); }

.preview-box.is-dragging {
  cursor: grabbing;
}

.resize-handle {
  position: absolute;
  left: 0;
  right: 0;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  cursor: ns-resize;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handle::after {
  content: "";
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
}


.resize-handle.bottom {
  bottom: 0;
}

.zone-tag {
  color: white;
  font-weight: 800;
  font-size: 0.65rem;
}

.region-stats {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-row {
  font-size: 0.6rem;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
}

.stat-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 4px 0;
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #4D148C;
}

/* Rendering Section */
.main-right {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

.png-section {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.png-section h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: #1e293b;
  flex-shrink: 0;
}

.png-preview-box {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  min-height: 0;
  position: relative;
}

.png-preview-box.is-empty {
  background: transparent;
  border: none;
  padding: 0;
}

.png-preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background: white;
  border-radius: 4px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
}

.placeholder-text {
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  margin-top: 10px;
}

.placeholder-graphic {
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.05));
  opacity: 0.8;
}

.png-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Bottom Controls Layout */
.bottom-controls-container {
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.controls-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.controls-group-title {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  color: #94a3b8;
  margin-bottom: 8px;
}

.actions-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.view-zpl-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.settings-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 0.72rem;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.11em;
}

.setting-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.setting-pill {
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.setting-pill.active {
  background: #4D148C;
  color: white;
  border-color: #4D148C;
}

.setting-pill:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.setting-divider {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
  margin: 0 4px;
}

.duplicate-btn {
  height: 38px !important;
  padding: 0 16px !important;
  border-radius: 8px !important;
  font-size: 0.72rem !important;
  font-weight: 800 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.12em !important;
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #64748b !important;
  display: flex !important;
  align-items: center !important;
  cursor: pointer !important;
}

.toolbar-spacer {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
  margin: 0 12px;
  opacity: 0.8;
}

/* Button Variants */

.btn.danger-outline {
  color: #ef4444;
  border-color: #fecaca;
  margin-top: 4px;
}


.btn.reset-confirm-active {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #4D148C;
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.11em;
}

.modal-content textarea {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'monospace';
  font-size: 0.85rem;
  color: #1e293b;
  resize: vertical;
  line-height: 1.6;
  outline: none;
}

.modal-content textarea:focus {
  border-color: #4D148C;
  background: white;
  box-shadow: 0 0 0 4px rgba(77, 20, 140, 0.05);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.code-viewer-container {
  width: 100%;
  min-height: 400px;
  max-height: 60vh;
  background: #0f172a;
  border-radius: 12px;
  padding: 20px;
  overflow: auto;
  border: 1px solid #1e293b;
}

.code-viewer-container pre {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'monospace';
  font-size: 0.85rem;
  line-height: 1.6;
  color: #94a3b8;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
