import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';
import {fromLonLat} from 'ol/proj';
import {FullScreen} from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const map = new Map({
  target: 'map',
  controls: [new FullScreen()],
  layers: [
    new TileLayer({
      source: new Stamen({
        layer: 'watercolor'
      })
    }),
    new TileLayer({
      source: new Stamen({
        layer: 'terrain-labels'
      })
    }),
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: './data/markers.json'
      })
    })
  ],
  view: new View({
    center: fromLonLat([5.727616, 45.192057]),
    zoom: 16
  })
});