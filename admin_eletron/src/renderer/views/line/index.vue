<template>
  <div>
    <l-map
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 960px; width: 100%;"
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
      <l-circle
        :lat-lng="circle.center"
        :radius="circle.radius">
        <l-popup content="Circle"/>
      </l-circle>
      <l-polyline
        :lat-lngs="polyline.latlngs"
        :color="polyline.color">
        <l-popup>
          <popup-content :data="polyline" />
        </l-popup>
        <l-tooltip>
          <tooltip-content :data="polyline" />
        </l-tooltip>
      </l-polyline>
    </l-map>
  </div>
</template>

<script>
import { L, LPolyline, LCircle, LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

export default {
  name: 'DriedTower',
  components: {
    L,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline,
    LCircle
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
      },
      circle: {
        center: L.latLng(40.0482567, 116.468478),
        radius: 4500
      },
      polyline: {
        type: 'polyline',
        latlngs: [[40.0482567, 116.468478], [40.1482567, 116.468479], [40.2482567, 116.468480], [40.0482567, 116.468481]],
        color: 'green'
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
      alert('呵呵。。。')
    }
  }
}
</script>
