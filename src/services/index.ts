import axios from './axios'

// axi0-slides: this editor talks to no server. The upstream AI and image-search calls are gone; what is left reads the
// editor's own bundled files (the templates), from the folder this page was served from.
const unavailable = (..._args: unknown[]): Promise<any> => Promise.reject(new Error("Not available in this editor"))

export default {
  getMockData(filename: string): Promise<any> {
    if (!/^template_\d{1,2}$/.test(filename)) return unavailable()
    return axios.get(`./mocks/${filename}.json`)
  },
  searchImage: unavailable,
  AIPPT_Outline: unavailable,
  AIPPT: unavailable,
  AI_Writing: unavailable,
}
