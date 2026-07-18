/**
 * AniVerse Web - PostCSS Configuration
 * 
 * Configures PostCSS to process CSS with Tailwind CSS and Autoprefixer.
 * Using .mjs extension for native ESM support.
 */

const config = {
  plugins: {
    // Tailwind CSS: Injects Tailwind's base, components, and utilities
    tailwindcss: {},
    
    // Autoprefixer: Automatically adds vendor prefixes for cross-browser compatibility
    autoprefixer: {
      // Target browsers based on package.json browserslist or default to modern browsers
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'not ie 11',
        'not op_mini all'
      ],
      // Add prefixes for grid layout (optional, but good for older browsers)
      grid: 'autoplace'
    },
  },
};

export default config;
