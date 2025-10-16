// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(
	{
		compatibilityDate: '2025-07-15',
		devtools: {enabled: false},
		app: {
			head: {
				title: 'AkitaCtrl', // default fallback title
				htmlAttrs: {
					lang: 'en',
				},
				link: [
					{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				],
				meta: [
					{ name: 'description', content: 'This is the page to control my Home' }
				]
			},
		},
		css: [
			'~/assets/globals.css'
		],
		modules: [
			'@vite-pwa/nuxt'
		],
		pwa: {
			registerType: 'autoUpdate',
			manifest: {
				id: 'AkitaCtrl',
				name: 'AkitaCtrl',
				short_name: 'AkitaCtrl',
				theme_color: '#ffffff',
				background_color: '#004740',
				display: 'fullscreen',
				orientation: 'portrait',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: '/icons/icon-16x16.png',
						sizes: '16x16',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-32x32.png',
						sizes: '32x32',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-72x72.png',
						sizes: '72x72',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-96x96.png',
						sizes: '96x96',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-128x128.png',
						sizes: '128x128',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-144x144.png',
						sizes: '144x144',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-152x152.png',
						sizes: '152x152',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-384x384.png',
						sizes: '384x384',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				navigateFallback: '/',
			},
			devOptions: {
				enabled: true
			}
		}
	}
)