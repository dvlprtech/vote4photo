import { join } from 'path'
import type { Config } from 'tailwindcss'
import {gray} from 'tailwindcss/colors'

export default {
	darkMode: 'class',
	plugins: [require('flowbite/plugin')],
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
	theme: {
		//colors: { slate: colors.slate, gray: colors.gray, white: colors.white, black: colors.black, transparent: colors.transparent },
		extend: {
			colors: {
				'primary': {
					50: '#f4f8fd',
					100: '#e8f1fb',
					200: '#c6ddf4',
					300: '#a3c8ed',
					400: '#5e9fe0',
					500: '#1976d2',
					600: '#176abd',
					700: '#13599e',
					800: '#0f477e',
					900: '#0c3a67',
					DEFAULT: '#1976d2', //500
					'on': '#f4f8fd',    //50  
					'dark': {
					  DEFAULT: '#a3c8ed', //300
					  'on': '#0f477e',    //800  
					}
				  },
				  'secondary': {
					'50': '#f4fbfa',
					'100': '#e9f6f5',
					'200': '#c9e9e6',
					'300': '#a8dbd7',
					'400': '#67c1b8',
					'500': '#26a69a',
					'600': '#22958b',
					'700': '#1d7d74',
					'800': '#17645c',
					'900': '#13514b',
					DEFAULT: '#26a69a', //500
					'on': '#f4fbfa',    //50  
					'dark': {
					  DEFAULT: '#a8dbd7', //300
					  'on': '#17645c',    //800  
					}
				  },
				  'tertiary': {
					'50': '#faf4fb',
					'100': '#f5e9f7',
					'200': '#e6c9eb',
					'300': '#d7a9df',
					'400': '#ba68c8',
					'500': '#9c27b0',
					'600': '#8c239e',
					'700': '#751d84',
					'800': '#5e176a',
					'900': '#4c1356',
					DEFAULT: '#9c27b0', //500
					'on': '#faf4fb',    //50  
					'dark': {
					  DEFAULT: '#d7a9df', //300
					  'on': '#5e176a',    //800  
					}
				  },
				  'error': {
					'50': '#fcf2f3',
					'100': '#f9e6e8',
					'200': '#f0bfc5',
					'300': '#e699a1',
					'400': '#d44d5b',
					'500': '#c10015',
					'600': '#ae0013',
					'700': '#910010',
					'800': '#74000d',
					'900': '#5f000a',
					DEFAULT: '#c10015', //500
					'on': '#fcf2f3',    //50  
					'dark': {
					  DEFAULT: '#e699a1', //300
					  'on': '#74000d',    //800  
					}
				  },
				  'surface': {
					'50':  gray[50],
					'100': gray[100],
					'200': gray[200],
					'300': gray[300],
					'400': gray[400],
					'500': gray[500],
					'600': gray[600],
					'700': gray[700],
					'800': gray[800],
					'900': gray[900],
					DEFAULT: gray[50], //50
					'on': gray[900],    //900 
					'dark': {
					  DEFAULT: gray[900], //900
					  'on': gray[50],    //50  
					}
				  },
			}
		},
	},
} satisfies Config;
