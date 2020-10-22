<template>
  <div
    class='potree_container'
    style='position: relative; width: 100%; height: 100%; left: 0px; top: 0px; '
  >
    <div id='potree_render_area'>
      <div
        id='potree_map'
        class='mapBox'
        style='position: absolute; left: 0px; top: 0px; width: 400px; height: 400px; display: none'
      >
        <div
          id='potree_map_header'
          style='position: absolute; width: 100%; height: 25px; top: 0px; background-color: rgba(0,0,0,0.5); z-index: 1000; border-top-left-radius: 3px; border-top-right-radius: 3px;'
        />
        <div
          id='potree_map_content'
          class='map'
          style='position: absolute; z-index: 100; top: 25px; width: 100%; height: calc(100% - 25px); border: 2px solid rgba(0,0,0,0.5); box-sizing: border-box;'
        />
      </div>
    </div>
    <div id="potree_sidebar_container"> </div>
  </div>
</template>

<script>
import '@/assets/potree/potree.css'
import '@/assets/potree/lib/spectrum.css'
import '@/assets/potree/lib/jquery-ui/jquery-ui.min.css'
import '@/assets/cesium/Widgets/CesiumWidget/CesiumWidget.css'

import $ from '@/assets/potree/lib/jquery.min.js'
// require('@/assets/potree/lib/laslaz.js')
// const BinaryHeap = require('@/assets/potree/lib/BinaryHeap.js')
// require('@/assets/potree/lib/three.min.js')
// require('@/assets/potree/lib/d3.min.js')
require('@/assets/potree/lib/spectrum.js')
require('@/assets/potree/lib/jstree.min.js')
// require('@/assets/potree/lib/jquery.min.js')
require('@/assets/potree/lib/jquery-ui/jquery-ui.min.js')
// require('@/assets/potree/potree.js')

export default {
  components: {},
  props: [],
  data() {
    return {
      three: `<script src='@/assets/assets/potree/lib/three.min.js'/>`,
      center: 'L.latLng(40.0482567, 116.468478)',
      mapOptions: {
        zoomSnap: 0.5
      },
      req: {
        version: '1.4',
        octreeDir: 'data',
        boundingBox: {
          lx: 516152.81,
          ly: 4010673.48,
          lz: 149.15,
          ux: 516161.12,
          uy: 4010678.79,
          uz: 173.78
        },
        pointAttributes: 'LAS',
        spacing: 0.0750000029802322,
        scale: 0.001,
        root: '3_1_0',
        hierarchy: [
          // {name:'3_1_0', min: [516152.81, 4010673.48, 149.15]},
          { name: '3_1_1', min: [516152.86, 4010675.29, 164.93] }
        ]
      }
    }
  },
  mounted() {
    // debugger
    window.viewer = new Potree.Viewer(
      document.getElementById('potree_render_area')
    )
    // viewer.setEDLEnabled(true)
    viewer.setFOV(60)
    viewer.setPointBudget(5 * 1000 * 1000)
    viewer.setDescription('Tower View')
    viewer.loadGUI(() => {
      console.log('model loaded gui')
    })
    // viewer.setBackground('gradient');
    const scene = viewer.scene

    // Sigeom
    // Potree.loadPointCloud('../../../../static/lion_las/cloud.js', 'lion', function(e){
    // this.loadPointCloud('http://localhost:8080/static/3_1.json', 'lion', function(e){
    this.loadPointCloud(this.req, viewer, (e) => {
      viewer.fitToScreen()
    })

    {
      // add a polyline
      const path = [
        590058.52,
        231354.16,
        766.42,
        589941.68,
        231476.67,
        736.52,
        589781.32,
        231491.91,
        757.73,
        589711.88,
        231445.56,
        768.16,
        589702.04,
        231336.49,
        772.91
      ]

      const geometry = new THREE.BufferGeometry()
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
      const buffer = new Float32Array(path)
      geometry.addAttribute('position', new THREE.BufferAttribute(buffer, 3))
      geometry.computeBoundingSphere()

      const line = new THREE.Line(geometry, material)
      // viewer.scene.scene.add(line);
      // viewer.fitToScreen();
      // viewer.zoomTo(line,1);
    }
  },
  methods: {
    loadPointCloud(path, viewer, callback) {
      const baseUrl = '../../../../static'
      Potree.POCLoader.loadJson(baseUrl, path, viewer, callback)
    },
    loadPointCloud2(path, name, callback) {
      Potree.POCLoader.load(path, function(geometry) {
        if (!geometry) {
          // callback({type: 'loading_failed'});
          console.error(
            new Error(`failed to load point cloud from URL: ${path}`)
          )
        } else {
          const pointcloud = new Potree.PointCloudOctree(geometry)
          pointcloud.name = name
          callback({ type: 'pointcloud_loaded', pointcloud: pointcloud })
        }
      })
    },
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
<style lang='scss'>
#potree_description {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 1000;
}
#potree_render_area {
  position: absolute;
  /*background: linear-gradient(-90deg, red, yellow);*/
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  overflow: hidden;
  z-index: 1;
  -webkit-transition: left 0.35s;
  transition: left 0.35s;
}
</style>