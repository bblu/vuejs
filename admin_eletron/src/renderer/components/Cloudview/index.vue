<template>
  <div class="potree_container" style="position: relative; width: 100%; height: 100%; left: 0px; top: 0px; ">
    <div id="potree_render_area" ></div>
  </div>
</template>

<script>
// import Potree from 'potree'
// import THREE from 'potree/libs/three.js/build/three.min.js'

export default {
  components: {
  },
  props: [],
  data() {
    return {
      zoom: 13,
      center: 'L.latLng(40.0482567, 116.468478)',
      mapOptions: {
        zoomSnap: 0.5
      }
    }
  },
  mounted() {
    debugger
    window.viewer = new Potree.Viewer(document.getElementById('potree_render_area'))
    window.viewer.setEDLEnabled(true)
    window.viewer.setFOV(60)
    window.viewer.setPointBudget(5 * 1000 * 1000)
    window.viewer.loadSettingsFromURL()
    window.viewer.setDescription('')
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