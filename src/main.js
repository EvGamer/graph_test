import { createApp } from 'vue'
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import App from './App.vue';

cytoscape.use(dagre);

createApp(App).mount('#app')
