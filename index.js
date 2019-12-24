import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import Stamen from 'ol/source/Stamen';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import {circular} from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import {Circle, Fill, Stroke, Style} from 'ol/style';
import Icon from "ol/style/Icon";
import {defaults as defaultControls, FullScreen} from 'ol/control';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';

const source = new VectorSource();

const map = new Map({
    target: 'map',
    controls: defaultControls().extend([
        new FullScreen()
    ]),
    interactions: defaultInteractions().extend([
        new DragRotateAndZoom()
    ]),
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
                url: 'https://raw.githubusercontent.com/arnaudruffin/tom-bornes/master/first-collection.json'
            })
        }),
        new VectorLayer({
            source: source
        })
    ],
    view: new View({
        center: fromLonLat([5.727616, 45.192057]),
        zoom: 16
    })
});


var iconFeature = new Feature({
    geometry: new Point([0, 0]),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
});

var imageStyle = new Style({
    image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'data/icon.png'
    })
});

const geoFill = new Fill({
    color: 'rgba(125,2,255,0.4)'
});

const geoStroke = new Stroke({
    color: '#FFA3BC',
    width: 1.25
});
const geolocStyle = new Style({
    image: new Circle({
        fill: geoFill,
        stroke: geoStroke,
        radius: 5
    }),
    fill: geoFill,
    stroke: geoStroke
});

iconFeature.setStyle(imageStyle);


navigator.geolocation.watchPosition(function (pos) {
    console.log("new position")
    const coords = [pos.coords.longitude, pos.coords.latitude];
    const accuracy = circular(coords, pos.coords.accuracy);
    source.clear(true);
    let centerFeature = new Feature({
        geometry: new Point(fromLonLat(coords)),
        name: 'Position',
        population: 4000,
        rainfall: 500,
        style: geolocStyle
    });
    centerFeature.setStyle(geolocStyle)
    source.addFeatures([
        new Feature(accuracy.transform('EPSG:4326', map.getView().getProjection())),
        centerFeature
    ]);
}, function (error) {
    alert(`ERROR: ${error.message}`);
}, {
    enableHighAccuracy: true
});
