import 'ol/ol.css';
import {Map, View} from 'ol';
import Tile from 'ol/layer/Tile';
import Stamen from 'ol/source/Stamen';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import {circular} from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import {Circle, Fill, Stroke, Style, Text} from 'ol/style';
import {FullScreen} from 'ol/control';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';
import Rotate from "ol/control/Rotate";
import LayerSwitcher from "ol-layerswitcher";
import {Group} from "ol/layer";


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


const styleForOfficials = new Style({
    image: new Circle({
        radius: 5,
        fill: new Fill({
            color: 'orange'
        })
    }),
    fill: new Fill({
        color: 'rgba(128, 255, 0, 0.6)'
    }),
    stroke: new Stroke({
        color: '#319FD3',
        width: 45
    }),
    text: new Text({
        font: '12px Calibri,sans-serif',
        fill: new Fill({
            color: '#000'
        }),
        stroke: new Stroke({
            color: '#fff',
            width: 3
        })
    })
});

const defaultBaseLayer = "stamen-toner";
const userSource = new VectorSource();

const map = new Map({
    target: 'map',

    controls: [new FullScreen(), new Rotate()],
    interactions: defaultInteractions().extend([
        new DragRotateAndZoom()
    ]),
    layers: [
        new Group({
            title: "Fond de carte",
            layers: [
                new Tile({
                    title: 'toner',
                    type: 'base',
                    visible: (defaultBaseLayer === "stamen-toner"),
                    source: new Stamen({
                        layer: 'toner'
                    })
                }),
                new Tile({
                    title: 'watercolor',
                    type: 'base',
                    visible: (defaultBaseLayer === "stamen-water"),
                    source: new Stamen({
                        layer: 'watercolor'
                    })
                }),
                new Tile({
                    title: 'terrain',
                    type: 'base',
                    visible: (defaultBaseLayer === "stamen-terrain"),
                    source: new Stamen({
                        layer: 'terrain'
                    })
                }),
                new Tile({
                    title: 'openStreetMap',
                    type: 'base',
                    visible: (defaultBaseLayer === "osm"),
                    source: new OSM()
                })
            ]
        }),
        new Group({
            title: "Bornes",
            layers: [
                new VectorLayer({
                    title: 'découvertes',
                    source: new VectorSource({
                        format: new GeoJSON(),
                        url: 'https://raw.githubusercontent.com/arnaudruffin/tom-bornes/master/collections/updated-collection.geojson'
                    }),

                }),
                new VectorLayer({
                    title: 'officiel',
                    source: new VectorSource({
                        format: new GeoJSON(),
                        url: 'https://raw.githubusercontent.com/arnaudruffin/tom-bornes/master/collections/export-bornes-1859-site-gouv.geojson'
                    }),
                    visible: false,
                    style: function (feature) {
                        styleForOfficials.getText().setText(feature.get('name'));
                        return styleForOfficials;
                    }
                })
            ]
        }),
        new VectorLayer({
            source: userSource
        })
    ],
    view: new View({
        center: fromLonLat([5.727616, 45.192057]),
        zoom: 16
    })
});

const layerSwitcher = new LayerSwitcher({
    tipLabel: 'Légende', // Optional label for button
    groupSelectStyle: 'none' // Can be 'children' [default], 'group' or 'none'
});
map.addControl(layerSwitcher);

navigator.geolocation.watchPosition(function (pos) {
    const coords = [pos.coords.longitude, pos.coords.latitude];
    const accuracy = circular(coords, pos.coords.accuracy);
    userSource.clear(true);
    let centerFeature = new Feature({
        geometry: new Point(fromLonLat(coords)),
        name: 'Position',
        population: 4000,
        rainfall: 500,
        style: geolocStyle
    });
    centerFeature.setStyle(geolocStyle);
    userSource.addFeatures([
        new Feature(accuracy.transform('EPSG:4326', map.getView().getProjection())),
        centerFeature
    ]);
}, function (error) {
    alert(`ERROR: ${error.message}`);
}, {
    enableHighAccuracy: true
});
