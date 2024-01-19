import { createApp } from 'vue'
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import coseBilkent from 'cytoscape-cose-bilkent';
import cola from 'cytoscape-cola';
import cise from 'cytoscape-cise';

import App from './App.vue';
import "bootstrap-icons/font/bootstrap-icons.css";

cytoscape.use(dagre);
cytoscape.use(coseBilkent);
cytoscape.use(cola);
cytoscape.use(cise);

createApp(App).mount('#app')
