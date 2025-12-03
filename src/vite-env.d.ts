/// <reference types="vite/client" />

// For CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

// For SCSS modules
declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

// For image imports
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

// For environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly VITE_API_URL: string
    readonly VITE_APP_NAME: string
  }
}

// For CSS modules with CSS custom properties
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// For SCSS modules with CSS custom properties
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
