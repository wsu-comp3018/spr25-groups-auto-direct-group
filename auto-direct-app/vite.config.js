import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
	],
	server: {
		port: 5174,
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
			},
		},
	},
	build: {
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					const info = assetInfo.name.split('.');
					const ext = info[info.length - 1];
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
						return `assets/[name].[ext]`; // No hash for images
					}
					return `assets/[name]-[hash].[ext]`;
				},
			},
		},
	},
})
