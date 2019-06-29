<template>
  <div>
    
  </div>
</template>

<script>
import Potree from 'potree'

export default {
  name: 'CloudView',
  components: {
  },
  data() {
    return {
      zoom: 13,
      center: 'L.latLng(40.0482567, 116.468478)',
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: 'L.latLng(40.0482567, 116.468478)',
      currentZoom: 11.5,
      currentCenter: 'L.latLng(40.0482567, 116.468478)',
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      circle: {
        center: 'L.latLng(40.0482567, 116.468478)',
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
