<template>
  <div>
    <div style="height: 10%; overflow: auto;">
      <h3>Simple map</h3>
      <p>Marker is placed at {{ marker.lat }}, {{ marker.lng }}</p>
      <p> Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }} </p>
      <button @click="showLongText">Toggle Long popup</button>
    </div>
    <l-map
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 800px; width: 100%;"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate">
      <l-tile-layer
        :url="url"
        :attribution="attribution"/>
      <l-marker :lat-lng="marker">
        <l-popup>
          <div @click="popupClick">
            I am a tooltip
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi. Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { L, LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

export default {
  name: 'VueLeaflet',
  components: {
    L,
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data() {
    return {
      zoom: 13,
      center: L.latLng(40.0482567, 116.468478),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(40.0482567, 116.468478),
      currentZoom: 11.5,
      currentCenter: L.latLng(40.0482567, 116.468478),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      }
    }
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom
    },
    centerUpdate(center) {
      this.currentCenter = center
    },
    showLongText() {
      this.showParagraph = !this.showParagraph
    },
    popupClick() {
      alert('Popup Click!')
    }
  }
}
</script>
