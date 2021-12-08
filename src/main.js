import { createApp } from 'vue'
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import coseBilkent from 'cytoscape-cose-bilkent';

import App from './App.vue';
import "bootstrap-icons/font/bootstrap-icons.css";

cytoscape.use(dagre);
cytoscape.use(coseBilkent);

createApp(App).mount('#app')
