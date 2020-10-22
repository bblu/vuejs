<template>
  <div
    class='potree_container'
    style='position: relative; width: 100%; height: 100%; left: 0px; top: 0px; '
  >
    <div id='potree_render_area'>
      <div id="cesiumContainer" style="position: absolute; width: 100%; height: 100%; background-color:green"></div>
    </div>
    <div id="potree_sidebar_container"> </div>
  </div>
</template>

<script>
import '@/assets/potree/potree.css' // 点云css样式
import '@/assets/potree/lib/spectrum.css'
import '@/assets/potree/lib/jquery-ui/jquery-ui.min.css'
import '@/assets/cesium/Widgets/CesiumWidget/CesiumWidget.css'

import $ from '@/assets/potree/lib/jquery.min.js'
// require('@/assets/potree/lib/three.min.js')
require('@/assets/potree/lib/spectrum.js')
require('@/assets/potree/lib/jstree.min.js')
// import $ from '@/assets/potree/lib/jquery.min.js'
require('@/assets/potree/lib/jquery-ui/jquery-ui.min.js')

// require('@/assets/potree/potree.js')
// require('@/assets/cesium/cesium.js')

export default {
  components: {},
  props: [],
  data() {
    return {
      zoom: 13,
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
    window.cesiumViewer = new Cesium.Viewer('cesiumContainer', {
      useDefaultRenderLoop: false,
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      imageryProvider: Cesium.createOpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/' }),
      terrainShadows: Cesium.ShadowMode.DISABLED
    })

    const cp = new Cesium.Cartesian3(4303414.154026048, 552161.235598733, 4660771.704035539)
    cesiumViewer.camera.setView({
      destination: cp,
      orientation: {
        heading: 10,
        pitch: -Cesium.Math.PI_OVER_TWO * 0.5,
        roll: 0.0
      }
    })

    window.potreeViewer = new Potree.Viewer(document.getElementById('potree_render_area'), {
      useDefaultRenderLoop: false
    })
    potreeViewer.setEDLEnabled(true)
    potreeViewer.setFOV(60)
    potreeViewer.setPointBudget(4 * 1000 * 1000)
    potreeViewer.setMinNodeSize(50)
    potreeViewer.loadSettingsFromURL()
    potreeViewer.setBackground(null)
    potreeViewer.useHQ = true

    /* potreeViewer.setDescription(`
		Potree using <a href="https://cesiumjs.org/" target="_blank">Cesium</a> to display an
		<a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a> map below.<br>
		Point cloud courtesy of <a href="http://riegl.com/" target="_blank">Riegl</a><br>`);*/

    potreeViewer.loadGUI(() => {
      // potreeViewer.setLanguage('en');
      $('#menu_appearance').next().show()
      $('#menu_tools').next().show()
      $('#menu_scene').next().show()
      potreeViewer.toggleSidebar()
    })

    Potree.loadPointCloud('http://5.9.65.151/mschuetz/potree/resources/pointclouds/riegl/retz/cloud.js', 'Retz', function(e) {
      const scene = potreeViewer.scene

      scene.addPointCloud(e.pointcloud)
      e.pointcloud.position.set(569277.402752, 5400050.599046, 0)
      e.pointcloud.rotation.set(0, 0, -0.035)

      const material = e.pointcloud.material
      material.pointSizeType = Potree.PointSizeType.ADAPTIVE
      material.size = 0.7
      material.elevationRange = [0, 70]

      scene.view.position.set(570975.577, 5398630.521, 1659.311)
      scene.view.lookAt(570115.285, 5400866.092, 30.009)

      Potree.measureTimings = true

      {
        const aTownHall = new Potree.Annotation({
          position: [569879.768, 5400886.182, 80.691],
          title: 'Town Hall',
          cameraPosition: [569955.329, 5400822.949, 98.807],
          cameraTarget: [569879.768, 5400886.182, 46.691]
        })
        scene.annotations.add(aTownHall)

        const aTrainStation = new Potree.Annotation({
          position: [570337.407, 5400522.730, 30],
          title: 'Train Station',
          cameraPosition: [570377.074, 5400427.884, 100.576],
          cameraTarget: [570337.407, 5400522.730, 18.595]
        })
        scene.annotations.add(aTrainStation)
        /*
			{ // Attribute Selector Annotation

				// Create title element with jquery
				let elTitle = $(`
					<span>
						Attribute:
						<img title="Elevation" name="action_elevation" src="${Potree.resourcePath}/icons/profile.svg" class="annotation-action-icon"/>
						<img title="RGB and Elevation" name="action_both" src="${Potree.resourcePath}/icons/rgb_elevation.png" class="annotation-action-icon"/>
						<img title="RGB" name="action_rgb" src="${Potree.resourcePath}/icons/rgb.svg" class="annotation-action-icon"/>
					</span>`);
				elTitle.find("img[name=action_elevation]").click( () => {
					scene.pointclouds.forEach( pc => pc.material.pointColorType = Potree.PointColorType.ELEVATION );
				});
				elTitle.find("img[name=action_rgb]").click( () => {
					scene.pointclouds.forEach( pc => pc.material.pointColorType = Potree.PointColorType.RGB );
				});
				elTitle.find("img[name=action_both]").click( () => {
					scene.pointclouds.forEach( pc => pc.material.pointColorType = Potree.PointColorType.RGB_HEIGHT );
				});

				// Give the annotation a meaningful string representation for the sidebar
				elTitle.toString = () => "Color Setting";

				// Same as with other annotations, except title is a jquery object this time.
				let aActions = new Potree.Annotation({
					position: [569222.340, 5401213.625, 227],
					title: elTitle
				});
				scene.annotations.add(aActions);
			}

			{ // Attribute Selector Annotation

				let elTitle = $(`
					<span>
						Quality:
						<span name="low"  style="font-family: monospace; margin-left: 4px">low</span>
						<span name="med"  style="font-family: monospace; margin-left: 4px">med</span>
						<span name="high" style="font-family: monospace; margin-left: 4px">high</span>
					</span>`);

				elTitle.find("span").mouseover( (e) => {
					$(e.target).css("filter", "drop-shadow(0px 0px 1px white)");
				}).mouseout( (e) => {
					$(e.target).css("filter", "");
				});

				elTitle.find("span[name=low]").click( () => {
					potreeViewer.setPointBudget(1 * 1000 * 1000);
					potreeViewer.useHQ = false;
				});

				elTitle.find("span[name=med]").click( () => {
					potreeViewer.setPointBudget(3 * 1000 * 1000);
					potreeViewer.useHQ = false;
				});

				elTitle.find("span[name=high]").click( () => {
					potreeViewer.setPointBudget(4 * 1000 * 1000);
					potreeViewer.useHQ = true;
				});

				// Give the annotation a meaningful string representation for the sidebar
				elTitle.toString = () => "Quality Setting";

				// Same as with other annotations, except title is a jquery object this time.
				let aActions = new Potree.Annotation({
					position: [570274.902, 5401873.626, 227],
					title: elTitle
				});
				scene.annotations.add(aActions);
			}*/
      }

      // let pointcloudProjection = e.pointcloud.projection;
      const pointcloudProjection = '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
      const mapProjection = proj4.defs('WGS84')

      window.toMap = proj4(pointcloudProjection, mapProjection)
      window.toScene = proj4(mapProjection, pointcloudProjection)

      {
        const bb = potreeViewer.getBoundingBox()

        const minWGS84 = proj4(pointcloudProjection, mapProjection, bb.min.toArray())
        const maxWGS84 = proj4(pointcloudProjection, mapProjection, bb.max.toArray())
        console.log(minWGS84, maxWGS84)
      }
    })

    this.loadPointCloud(this.req, potreeViewer, function(e) {
      e.pointcloud.position.set(569277.402752, 5400050.599046, 0)
      e.pointcloud.rotation.set(0, 0, -0.035)
      const scene = potreeViewer.scene
      scene.view.position.set(516152.81, 4010673.48, 1659.311)
      scene.view.lookAt(516152.285, 4020673.092, 30.009)

      const pointcloudProjection = '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
      const mapProjection = proj4.defs('WGS84')

      window.toMap = proj4(pointcloudProjection, mapProjection)
      window.toScene = proj4(mapProjection, pointcloudProjection)

      {
        const bb = potreeViewer.getBoundingBox()

        const minWGS84 = proj4(pointcloudProjection, mapProjection, bb.min.toArray())
        const maxWGS84 = proj4(pointcloudProjection, mapProjection, bb.max.toArray())
        console.log(minWGS84, maxWGS84)
      }
    })
    function loop(timestamp) {
      requestAnimationFrame(loop)

      potreeViewer.update(potreeViewer.clock.getDelta(), timestamp)

      potreeViewer.render()

      if (window.toMap !== undefined) {
        {
          const camera = potreeViewer.scene.getActiveCamera()

          const pPos		= new THREE.Vector3(0, 0, 0).applyMatrix4(camera.matrixWorld)
          const pRight = new THREE.Vector3(600, 0, 0).applyMatrix4(camera.matrixWorld)
          const pUp		 = new THREE.Vector3(0, 600, 0).applyMatrix4(camera.matrixWorld)
          const pTarget = potreeViewer.scene.view.getPivot()

          const toCes = (pos) => {
            const xy = [pos.x, pos.y]
            const height = pos.z
            const deg = toMap.forward(xy)
            const cPos = Cesium.Cartesian3.fromDegrees(...deg, height)

            return cPos
          }

          const cPos = toCes(pPos)
          const cUpTarget = toCes(pUp)
          const cTarget = toCes(pTarget)

          let cDir = Cesium.Cartesian3.subtract(cTarget, cPos, new Cesium.Cartesian3())
          let cUp = Cesium.Cartesian3.subtract(cUpTarget, cPos, new Cesium.Cartesian3())

          cDir = Cesium.Cartesian3.normalize(cDir, new Cesium.Cartesian3())
          cUp = Cesium.Cartesian3.normalize(cUp, new Cesium.Cartesian3())

          cesiumViewer.camera.setView({
            destination: cPos,
            orientation: {
              direction: cDir,
              up: cUp
            }
          })
        }

        const aspect = potreeViewer.scene.getActiveCamera().aspect
        if (aspect < 1) {
          const fovy = Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180)
          cesiumViewer.camera.frustum.fov = fovy
        } else {
          const fovy = Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180)
          const fovx = Math.atan(Math.tan(0.5 * fovy) * aspect) * 2
          cesiumViewer.camera.frustum.fov = fovx
        }
      }

      cesiumViewer.render()
    }
    requestAnimationFrame(loop)
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