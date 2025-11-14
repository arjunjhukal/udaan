import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@ckeditor/ckeditor5-react",
      "@ckeditor/ckeditor5-build-classic"
    ]
  }
})