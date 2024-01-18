import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import {createVuetify} from 'vuetify';

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
        selected: '#2DD200',
        'imp-selected': '#007600',
        deselected: '#ff210d',
        'imp-deselected': '#c50000',
        'should-select': '#cca000',
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
        selected: '#96d200',
        'imp-selected': '#277800',
        deselected: '#fe0058',
        'imp-deselected': '#9d004d',
        'should-select': '#ff5d1b',
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
