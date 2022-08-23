// Criação e carregamento da função init que renderiza o mapa
window.onload = init;
function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [-6291785.968899741 , -2525013.206208874],
            zoom: 13,
            minZoom: 7
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: "js-map"
    }) 

    //Mapas Base 
    const openStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible:false,
        title: "OSMStandard"
    })

    const stamenTerrain = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:"https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
        attributions: 'Map tiles by <a href="http://stamen.com/%22%3EStamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0%22%3ECC BY 3.0</a>. Data by <a href="http://openstreetmap.org/%22%3EOpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright%22%3EODbL</a>.'
    }),
        visible:false,
        title:"StamenTerrain"
    })

    //Grupos de Terrenos
    const baseLayerGroup = new ol.layer.Group({
        layers:[
            openStreetMapStandard, stamenTerrain
        ],
    })
    map.addLayer(baseLayerGroup);

    //Layer Switcher for Basemaps
    const baseLayerElements = document.querySelectorAll('.switcher-group > input[type=radio]');
    for(let baseLayerElement of baseLayerElements){
        baseLayerElement.addEventListener('change', function(){
            let baseLayerElementValue = this.value;
            baseLayerGroup.getLayers().forEach(function(element, index, array){
                let baseLayerTitle = element.get('title');
                element.setVisible(baseLayerTitle === baseLayerElementValue);
            })
        })
    }

    // Vector Layers
    const fillStyle = new ol.style.Fill({
        color: [107, 142, 35, 0.25],
    })

    const strokeStyle = new ol.style.Stroke({
        color: [250, 196, 0, 1],
        lineDash: [4,16],
        width: 5,

    })

    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [250, 196, 0, 1]
        }),
        radius: 10,
    })
    
    //MAPEAMENTO DO VETOR DE COORDENADAS
    const MapaRLJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/vector_data/MapaRL.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'MapaRLJSON',
        style: new ol.style.Style({
            fill: fillStyle,
            stroke: strokeStyle,
            image: circleStyle,
        })
    })

    map.addLayer(MapaRLJSON);

    // Pop Up de Vetores
    const overlayContainerElement = document.querySelector('.overlay-container')
    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement,
        })
    map.addOverlay(overlayLayer);
    const overlayFeatureNr = document.getElementById('feature-Nr')
    const overlayFeatureNome = document.getElementById('feature-Nome')
    const overlayFeatureKm = document.getElementById('feature-Km')
    const overlayFeatureData = document.getElementById('feature-Data')
    const overlayFeatureHistoria = document.getElementById('feature-Historia')

    map.on('click', function(e){
        overlayLayer.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            let clickedCoordinate = e.coordinate;
            let clickedFeatureNr = feature.get('Nr');
            let clickedFeatureNome = feature.get('Nome');
            let clickedFeatureKm = feature.get('Km');
            let clickedFeatureData = feature.get('Data');
            let clickedFeatureHistoria = feature.get('Historia');
            overlayLayer.setPosition(clickedCoordinate);
            document.querySelector("#Nr").innerText= clickedFeatureNr;
            document.querySelector("#Nome").innerText = clickedFeatureNome;
            document.querySelector("#Km").innerText = clickedFeatureKm;
            document.querySelector("#Data").innerText = clickedFeatureData;
            document.querySelector("#Historia").innerText = clickedFeatureHistoria;
            overlayLayer.setPosition(undefined);
        },
        {
            layerFilter : function(layerCandidate){
                return layerCandidate.get('title') === 'MapaRLJSON'
            }
        })
        })
}