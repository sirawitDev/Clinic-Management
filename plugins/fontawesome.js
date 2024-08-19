import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

// Disable automatic addition of CSS by FontAwesome
config.autoAddCss = false

// Add all icons from the Solid style to the library
library.add(fas)

export default defineNuxtPlugin((nuxtApp) => {
    // Register the FontAwesomeIcon component globally
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
