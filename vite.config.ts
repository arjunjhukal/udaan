import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log', 'console.debug'],
  },
  optimizeDeps: {
    include: [
      "@ckeditor/ckeditor5-react",
      "@ckeditor/ckeditor5-build-classic"
    ]
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/storage': {
        target: 'https://app.makuralms.site',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|use-sync-external-store)[\\/]/.test(id)) {
            return 'vendor-react';
          }

          if (id.includes('@ckeditor')) return 'vendor-ckeditor';
          if (id.includes('pdfjs-dist') || id.includes('react-pdf')) return 'vendor-pdf';
          if (id.includes('apexcharts')) return 'vendor-charts';
          if (id.includes('laravel-echo') || id.includes('pusher-js')) return 'vendor-realtime';
          if (id.includes('formik') || id.includes('yup')) return 'vendor-forms';
          if (id.includes('i18next')) return 'vendor-i18n';
          if (id.includes('date-fns') || id.includes('dayjs')) return 'vendor-date';
          if (id.includes('@mui/icons-material') || id.includes('iconsax-reactjs')) return 'vendor-icons';
          if (id.includes('@mui/x-date-pickers')) return 'vendor-mui-pickers';
          if (id.includes('@mui') || id.includes('@emotion')) return 'vendor-mui';
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('@reduxjs') || id.includes('react-redux')) return 'vendor-redux';
          if (id.includes('@tanstack')) return 'vendor-tanstack';
        },
      },
    },
  },
})
