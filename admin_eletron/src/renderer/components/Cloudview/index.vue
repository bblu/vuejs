<template>
  <div class="potree_container" style="position: relative; width: 100%; height: 100%; left: 0px; top: 0px; ">
    <div id="potree_render_area">
      <div id="potree_map" class="mapBox" style="position: absolute; left: 0px; top: 0px; width: 400px; height: 400px; display: none">
				<div id="potree_map_header" style="position: absolute; width: 100%; height: 25px; top: 0px; background-color: rgba(0,0,0,0.5); z-index: 1000; border-top-left-radius: 3px; border-top-right-radius: 3px;"/>
				<div id="potree_map_content" class="map" style="position: absolute; z-index: 100; top: 25px; width: 100%; height: calc(100% - 25px); border: 2px solid rgba(0,0,0,0.5); box-sizing: border-box;"/>
			</div>
    </div>
  </div>
</template>

<script>
import $ from '@/assets/potree/jquery.min.js'
// import Potree from '@/assets/potree/potree.js'
// import THREE from 'potree/libs/three.js/build/three.min.js'

export default {
  components: {},
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
    window.viewer = new Potree.Viewer(document.getElementById('potree_render_area'))
    // viewer.setEDLEnabled(true)
    viewer.setFOV(60)
    viewer.setPointBudget(5 * 1000 * 1000)
    viewer.setDescription('Tower View')
    // viewer.setBackground('gradient');
    let scene = viewer.scene;
    scene.view.position.set(589974.341, 231698.397, 986.146);
		scene.view.lookAt(new THREE.Vector3(589851.587, 231428.213, 715.634));

    { // add a polyline
			let path = [
				590058.52, 231354.16, 766.42,
				589941.68, 231476.67, 736.52,
				589781.32, 231491.91, 757.73,
				589711.88, 231445.56, 768.16,
				589702.04, 231336.49, 772.91
			];
			
			let geometry = new THREE.BufferGeometry();
			let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
			let buffer = new Float32Array(path);
			geometry.addAttribute('position', new THREE.BufferAttribute(buffer, 3));
			geometry.computeBoundingSphere();
			
			let line = new THREE.Line(geometry, material);
      viewer.scene.scene.add(line);
      //viewer.fitToScreen();
      viewer.zoomTo(line,1);
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
      alert('hello')
    }
  }
}
</script>