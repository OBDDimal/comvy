import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import {createVuetify} from 'vuetify';
import {VDataTable} from 'vuetify/labs/VDataTable';
import {VBottomSheet} from 'vuetify/labs/VBottomSheet';

export const variabilityLightTheme = {
    dark: false,
    colors: {
        background: '#fcfcff',
        surface: '#fcfcff',
        primary: '#006496',
        secondary: '#50606f',
        tertiary: '#66587b',
        error: '#ba1a1a',
        info: '#2196F3',
        success: '#4CAF50',
        'on-success': '#1a1c1e',
        warning: '#FB0000',
        selected: '#31a354',
        'imp-selected': '#a1d99b',
        deselected: '#ff210d',
        'imp-deselected': '#c50000',
        'should-select': '#0058B3',
        'should-select-parent': '#c46300'
    },
}

export const variabilityDarkTheme = {
    dark: true,
    colors: {
        background: '#1a1c1e',
        surface: '#1a1c1e',
        primary: '#90cdff',
        secondary: '#b8c8d9',
        error: '#ffb4ab',
        info: '#2196F3',
        success: '#4CAF50',
        'on-success': '#1a1c1e',
        warning: '#FB8C00',
        selected: '#31a354',
        'imp-selected': '#a1d99b',
        deselected: '#ff210d',
        'imp-deselected': '#c50000',
        'should-select': '#0058B3',
        'should-select-parent': '#cc3a00',
    },
}

export default createVuetify({
    theme: {
        defaultTheme: 'variabilityLightTheme',
        themes: {
            variabilityLightTheme,
            variabilityDarkTheme
        }
    },
    components: {
        VDataTable,
        VBottomSheet
    },
});
/*{
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
}*/
