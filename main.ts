import { Plugin } from "obsidian"
import { ModelViewerElement } from '@google/model-viewer'
import { load } from 'js-yaml'

export default class ModelViewerPlugin extends Plugin {
  async onload() {

    this.registerMarkdownCodeBlockProcessor("mv", async (src, el, ctx) => {
      const subDirectory = this.getDir(ctx.sourcePath)
      const modelViewer = new ModelViewerElement()
      let config = {
        'src' : '',
        'width': 400,
        'height': 400,
        'camera-controls': true,
        'auto-rotate': true,
        'autoplay': true,
        'data-js-focus-visible': true,
        'interaction-prompt': 'none',
      }
      console.log(load(src))
      if (src.includes(':')) config = { ...config, ...load(src) }
      else config.src = src.trimStart()
      
      Object.entries(config).forEach(async ([key, value]) => {
        if (['src', 'environment-image', 'skybox-image'].includes(key))
          modelViewer.setAttribute(key, await this.loadFile(value, subDirectory))
        else if (['width', 'height', 'aspect-ratio'].includes(key))        
          // modelViewer.style[key] = /^[0-9]+$/.test(value) ? `${ value }px` : value
          modelViewer.style[key] = /^[0-9]+$/.test(value) ? `${ value }px` : value
        else if (value)
          modelViewer.setAttribute(key, value)
      })
      
      el.appendChild(modelViewer)
    })
  }

  private getDir = (s: string) =>  s.substring(0, s.lastIndexOf('/'))

  private loadFile = async (fileName: string, subDir: string) => {
    if (fileName.startsWith('/'))
      fileName = fileName.substring(1)
    else if (subDir)
      fileName = `${subDir}/${ fileName }`

    const buffer = await this.app.vault.adapter.readBinary(fileName)
    return URL.createObjectURL(new Blob([buffer]))
  }
}

// environmentImage: '',
// skyboxImage: '',
// id: 'mv-' + randomString(),
// ar: false,
// exposure: 0,
// shadowIntensity: 0,
// shadowSoftness: 0,
// arModes: '',
// arStatus: '', // not an attribute
// animationName: '',
// touchAction: '',

// ---

// Attempt to embed models directly

// this.registerMarkdownPostProcessor((element, context) => {
      
//   const models = element.querySelectorAll('.file-embed[src$=".glb"], .file-embed[src$=".gltf"]')
//   const models = document.querySelectorAll('.file-embed')

//   models.forEach(model => {

//     if (src.includes('.glb') || src.includes('.gltf')) {
//       const modelViewer = new ModelViewerElement()
//       modelViewer.setAttribute('src', model.getAttribute('src'))
//       const elele = document.createElement('div')
//       elele.innerHTML = 'HAHAHHAHAHAHA'
//       element.remove()
//       context.addChild(modelViewer)
//       context.addChild(new RenderView(elele, 'grgrg'))
//     }
//   })

//   models.forEach(model => {
//     const modelViewer = document.createElement('model-viewer')
//     const modelViewer = new ModelViewerElement()
//     modelViewer.setAttribute('src', model.getAttribute('src'))
//     context.replaceWith(modelViewer)
//     context.addChild(modelViewer)
//   })
// })


// import { parse } from 'path'
// import { normalizePath, Plugin, MarkdownRenderChild } from "obsidian"
// import { readFile } from 'fs'
// import { arrayBuffer } from "stream/consumers"

// ---

// const containsObject = (str: string) => /{[^{}]*}/.test(str)
// const removeLeadingSlash = (str: string) => str.charAt(0) === '/' ? str.slice(1) : str
// const randomString = () => Math.random().toString(36).slice(2, 10)
// const camelToKebab = (s: string) => s.replace(/[A-Z]/g, '-$&').toLowerCase()
// const containsOnlyNumbers = (s: string) => /^[0-9]+$/.test(s)
// const getDir = (s: string) => s.substring(0, s.lastIndexOf('/'))

// ---

// let  modelPath = `${ normalizePath(this.app.vault.adapter.basePath) }/`

// ---

// const subDir = parse(ctx.sourcePath).dir

// ---

// modelViewer.addEventListener('model-visibility', () => {

// })

// ctx.containerEl.addEventListener("scroll", (event) => {

// })