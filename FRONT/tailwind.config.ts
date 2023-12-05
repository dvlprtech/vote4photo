
import type { Config } from 'tailwindcss'
import {gray} from 'tailwindcss/colors'
//import * as flowbitePlugin from 'flowbite/plugin'

export default {
	darkMode: 'class',
	plugins: [require('flowbite/plugin')],
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#F0F6FF",
					100: "#DBEAFF",
					200: "#BDD7FF",
					300: "#99C2FF",
					400: "#75ACFF",
					500: "#5599FF",
					600: "#0F6FFF",
					700: "#0052CC",
					800: "#00378A",
					900: "#001B42",
					950: "#000E24",
					DEFAULT: '#5599FF', //500
					'on': '#99C2FF',    //50  
				  },
				  secondary: {
					50: "#FFF6F0",
					100: "#FFEADB",
					200: "#FFD4B8",
					300: "#FFB98A",
					400: "#FF9A57",
					500: "#FF6600",
					600: "#E65C00",
					700: "#C75000",
					800: "#A84300",
					900: "#752F00",
					950: "#522100",
					DEFAULT: '#FF6600', //500
					'on': '#FF9A57'
				  },
				  text: {
					50: "#F2F2F2",
					100: "#E6E6E6",
					200: "#CCCCCC",
					300: "#B3B3B3",
					400: "#999999",
					500: "#808080",
					600: "#666666",
					700: "#4D4D4D",
					800: "#333333",
					900: "#1A1A1A",
					950: "#0D0D0D",
					DEFAULT: '#808080', //500
					'on': '#0D0D0D'
				  },
				  red: {
					50: "#FFF0F0",
					100: "#FFE5E5",
					200: "#FFC7C7",
					300: "#FF9E9E",
					400: "#FF5C5C",
					500: "#CC0000",
					600: "#B80000",
					700: "#A30000",
					800: "#850000",
					900: "#6B0000",
					950: "#3D0000",
					DEFAULT: '#CC0000', //500
					'on': '#FF5C5C'
				  },
				  surface: {
					50: "#FCFDFD",
					100: "#F9FAFB",
					200: "#F6F8F9",
					300: "#F0F3F5",
					400: "#E9EEF1",
					500: "#E6ECEF",
					600: "#DFE6EA",
					700: "#BECCD5",
					800: "#93ABB8",
					900: "#618194",
					950: "#455C69",
					DEFAULT: '#E6ECEF'
				  },
			}
		},
	},
} satisfies Config;
