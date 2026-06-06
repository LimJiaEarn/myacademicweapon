// Next.js only ships type declarations for CSS Modules (`*.module.css`), not for
// plain global stylesheets imported for their side effects (e.g. `import "./globals.css"`).
// Under "moduleResolution": "bundler" + "strict", TS flags those as ts(2882). This ambient
// declaration covers them. `*.module.css` stays typed by Next (more specific match wins).
declare module "*.css";
