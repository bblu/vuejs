<template>

		<div id="map" class="mapContainer">
		<div style="position: absolute; bottom: 10px; right: 20px; z-index: 1000;" @mouseover="onOverTileSwitch" @mouseleave="onLeaveTileSwitch">
			<a href="javascript:void(0);" style="float: left; margin-left: 5px; color: #000; text-decoration: none;" @click="onShowTileLayer">
				<img src="../assets/mapBtn1.png"><div style="background-color: #fff; text-align: center; margin-top: -5px;">地图</div>
			</a>
			<a v-show="imageLayerVisible" href="javascript:void(0);" style="position: relative;float: left; margin-left: 5px; color: #000; text-decoration: none;" @click="onShowImgLayer">
				<label style="position: absolute; top: 0; color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.5);" >
					<input style="position: absolute;" type="checkbox" v-model="showroad">
					<span style="margin-left: 20px;">路网信息</span>
				</label>
				<img src="../assets/mapBtn2.png"><div style="background-color: #fff; text-align: center; margin-top: -5px;">卫星</div>
			</a>
		</div>
</div>
</template>

<script>
	import Leaflet from 'leaflet'
	import Editable from './common/Leaflet.Editable.js'
	import PathDrag from './common/Path.Drag.js'
	import GeometryUtil from './common/GeometryUtil.js'
	import {spatialQuery, getMapConfig} from './common/api.js'


	let leafMap = null;
	let rangeRec = null;
	let recs = [];
	let reviewFeatureGroup = null;
	let selectRangeFeatureGroup = null;
	let tileLayer = null;
	let imageLayer = null;
	let roadLayer = null;
	const DRAWREC = 0;
	const DRAWPOLYGON = 1;
	const STYLE = {
		'IMAGE': {
			color: '#5fba7d'
		},

		'VECTOR': {
			color: '#f48024'
		}
	};

	export default {
		name: 'mapCom',

		props: ['drawType', 'save', 'reset', 'geoJSONs', 'editableGeoJSON', 'saveRange'],

		data() {
			return {
				rectangel_start: null,
				isSelecting: false,
				isDrawing: false,
				exportImgType: 'IMAGE',
				rangeFormVisible: false,
				imageLayerVisible: false,
				showroad: true
			}
		},
		watch:{
			showroad: function(val){
				if(val){
					roadLayer.addTo(leafMap);
				} else {
					roadLayer.remove();
				}
				
			},
			geoJSONs: {

				handler(val){
					if(!reviewFeatureGroup){
						reviewFeatureGroup = Leaflet.featureGroup();
						reviewFeatureGroup.addTo(leafMap);
					} else {
						reviewFeatureGroup.clearLayers();
					}

					selectRangeFeatureGroup && selectRangeFeatureGroup.clearLayers();
					rangeRec && rangeRec.remove();
					//leafMap.editTools.featuresLayer.clearLayers();
					this.showPolygons(val, reviewFeatureGroup, true);
				},

				deep: true
			},

			editableGeoJSON: function(val){ 
					var featuresLayer = leafMap.editTools.featuresLayer;
					featuresLayer.clearLayers();

					if(!val){
						return;
					}

					var featureGroup = Leaflet.featureGroup();
					Leaflet.geoJSON(val.geoJSON, {
						style: function(){
							return STYLE[val.type];
						},
						onEachFeature: function(feature, layer){
			    			var coordinates = feature.geometry.coordinates[0];
			    			if((coordinates.length - 1) === 4 
			    				&& coordinates[0][0] == coordinates[3][0]
			    				&& coordinates[0][1] == coordinates[1][1]
			    				&& coordinates[1][0] == coordinates[2][0]
			    				&& coordinates[2][1] == coordinates[3][1]
			    				){

			    				layer = Leaflet.rectangle([[coordinates[0][1], coordinates[0][0]], [coordinates[2][1], coordinates[2][0]]], STYLE[val.type]);
			    			}

			    			console.log(coordinates);

			    			featuresLayer.addLayer(layer);
			    			featureGroup.addLayer(layer);
							layer.enableEdit(leafMap);
			    			// layer.on('click', Leaflet.DomEvent.stop).on('click', layer.toggleEdit);
			    			layer.on('dblclick', Leaflet.DomEvent.stop).on('dblclick', function(){
			    					featuresLayer.removeLayer(layer);
			    			});

			    			layer.bindPopup('面积：'+ Leaflet.GeometryUtil.readableArea(Leaflet.GeometryUtil.geodesicArea(layer.toGeoJSON().geometry.coordinates[0]), true) || 0).openPopup();

						}
					});

					leafMap.fitBounds(featureGroup.getBounds());

			}
		},
		methods: {
			cancelSelectRange(){
				this.rangeFormVisible = false; 
				this.isSelecting = false;
			},

			showPolygons(val, featureGroup, fited){
				for(var i in val){
					var item = val[i];
					//try{
						if(!item) continue;

						Leaflet.geoJSON(item.geojson, {
							style: STYLE[item.type],
							onEachFeature: function(feature, layer){
								featureGroup.addLayer(layer);
								layer.bindPopup('面积：'+ Leaflet.GeometryUtil.readableArea(Leaflet.GeometryUtil.geodesicArea(layer.toGeoJSON().geometry.coordinates[0]), true) || 0).openPopup();
							}
						})
						
					//} catch(e){}
					
				};

				if(!fited) return;

				try{
					leafMap.fitBounds(featureGroup.getBounds());
				} catch(e){}
			},

			onLeaveTileSwitch: function(){
				this.imageLayerVisible = false;
			},

			onOverTileSwitch: function(){
				this.imageLayerVisible = true;
			},

			onShowTileLayer: function(){
				imageLayer.remove();
				roadLayer.remove();
				tileLayer.addTo(leafMap);
			},

			onShowImgLayer: function(){
				
				tileLayer.remove();
				imageLayer.addTo(leafMap);
				if(this.showroad){
					roadLayer.addTo(leafMap);
				} else {
					roadLayer.remove();
				}
			},

			startDrawingRec: function(e){
				//记录绘制起点
		    	if(this.rectangel_start === null) {
		    		this.rectangel_start = e.latlng;
		    	} 

		    	this.isDrawing = true;
			},

			spatialQuery: function(e){
				var range = rangeRec.toGeoJSON().geometry;
				this.saveRange(range, this.exportImgType);
				spatialQuery({
					type: this.exportImgType,
					polygon: JSON.stringify(range)
				}).then(data => {

					if(!data){
						return;
					}

					var geometries = [];
					data.items.forEach(item => {
						geometries.push({
							geojson: JSON.parse(item.geom),
							type: item.type
						});
					});

					if(!selectRangeFeatureGroup){
						selectRangeFeatureGroup = Leaflet.featureGroup();
						selectRangeFeatureGroup.addTo(leafMap);
					} else {
						selectRangeFeatureGroup.clearLayers();
					}

					this.showPolygons(geometries, selectRangeFeatureGroup);
					
				})
			},

			onDrawingRec: function(e){
				if(this.rectangel_start !== null){
		    		rangeRec &&　rangeRec.remove();
		    		rangeRec = Leaflet.rectangle([
				       this.rectangel_start,
				       e.latlng
				    ], {
				    	weight: 1,
				    	fillOpacity: 0
				    }).addTo(leafMap);
				    
		    	}
			},

			finishDrawingRec: function(e){
				this.rectangel_start = null;
	     		this.isSelecting = false;
	     		this.isDrawing = false;

				//结束绘制
		     	if(rangeRec){
		     		rangeRec.bringToFront();
		     		rangeRec.enableEdit();
		     		rangeRec.on('editable:vertex:dragend', e => {
		     			//console.log('editable:vertex:dragend', rangeRec.toGeoJSON());
		     			this.spatialQuery();

		     		});
		     		rangeRec.on('editable:dragend', e => {
		     			//console.log('editable:dragend', rangeRec.toGeoJSON());
		     			this.spatialQuery();
		     		});
		     		

		     		this.spatialQuery();
		     	}
			},

			cancelDrawingRec: function(e){
				this.rectangel_start = null;
				rangeRec &&　rangeRec.remove();
			},

			startDrawingPolygon: function(e){

			},

			finishDrawingPolygon: function(e){

			},

			saveFeatures: function(){
				var geojson = leafMap.editTools.featuresLayer.toGeoJSON();
				if(!geojson.features.length){
					this.$message({
						message: '请在地图上添加图斑',
						tyep: 'warning'
					})
				} else {
					var totalArea = 0;

					if(geojson.type === "FeatureCollection"){
						geojson.features.forEach((item) => {
							item.properties.area = Leaflet.GeometryUtil.geodesicArea(item.geometry.coordinates[0]);
							totalArea += item.properties.area;
						})
					} else {
						geojson.properties.area = Leaflet.GeometryUtil.geodesicArea(geojson.geometry.coordinates[0]);
						totalArea += item.properties.area;
					}

					geojson.totalArea = totalArea;

					// console.log(geojson);
					this.save(geojson);
				}
			    
			},

			empty(){
				 this.reset();
				 leafMap.editTools.featuresLayer.clearLayers();
				 selectRangeFeatureGroup && selectRangeFeatureGroup.clearLayers();
				 reviewFeatureGroup && reviewFeatureGroup.clearLayers();
				 if(rangeRec){
		    		rangeRec.remove();
		    	 }
			},

			selectRange(){
				this.isSelecting = true;
				this.rangeFormVisible = true;
				this.rectangel_start = null;

				this.empty();
				reviewFeatureGroup && reviewFeatureGroup.clearLayers();
				selectRangeFeatureGroup && selectRangeFeatureGroup.clearLayers();

				if(rangeRec){
		    		rangeRec.remove();
		    	}

			},

			createToolBar: function(){
				var self = this;
			    Leaflet.EditControl = Leaflet.Control.extend({
		    	options: {
		    		position:'topleft',
		    		callback: null,
		    		kind: '',
		    		html: ''
		    	},

		    	onAdd: function(map){
		    		var container = Leaflet.DomUtil.create('div', 'leaflet-control leaflet-bar'),
		    			link = Leaflet.DomUtil.create('a', '', container);

	    			link.href = '#';
	    			link.innerHTML = this.options.html;
	    			link.title = this.options.tip;
	    			Leaflet.DomEvent.on(link, 'click', Leaflet.DomEvent.stop)
	    					  .on(link, 'click', function(){
	    					  	var polygon = this.options.callback.call();
	    					  	 if(polygon) {
	    					  	 	// polygon.on('click', Leaflet.DomEvent.stop).on('click', polygon.toggleEdit);
	    					  	 	polygon.on('dblclick', Leaflet.DomEvent.stop).on('dblclick', function(){
	    					  	 		leafMap.editTools.featuresLayer.removeLayer(polygon);
	    					  	 	});

	    					  	 	polygon.on('editable:vertex:dragend', e => {
	    					  	 		setTimeout(function(){
							     			polygon.bindPopup('面积：'+ Leaflet.GeometryUtil.readableArea(Leaflet.GeometryUtil.geodesicArea(polygon.toGeoJSON().geometry.coordinates[0]), true) || 0).openPopup();
	    					  	 		}, 100);
						     		});

						     		polygon.on('editable:vertex:clicked', e => {
	    					  	 		console.log(polygon.toGeoJSON().geometry.coordinates[0]);
	    					  	 		setTimeout(function(){
							     			polygon.bindPopup('面积：'+ Leaflet.GeometryUtil.readableArea(Leaflet.GeometryUtil.geodesicArea(polygon.toGeoJSON().geometry.coordinates[0]), true) || 0).openPopup();
	    					  	 		}, 100);
						     		});
	    					  	 }
	    					  }, this);

					return container;
			    	}
			    });

			    Leaflet.PolyControl = Leaflet.EditControl.extend({
			    	options: {
			    		position: 'topleft',
			    		callback: function(){
			    			self.isSelecting = false;
			    			rangeRec && rangeRec.remove();
			    			selectRangeFeatureGroup && selectRangeFeatureGroup.clearLayers();
			    			return leafMap.editTools.startPolygon();
			    		},
			    		kind: 'polygon',
			    		html: '多边',
			    		tip: '画多边形'
			    	}
			    	
			    });

			    Leaflet.RectControl = Leaflet.EditControl.extend({
			    	options: {
				    	position: 'topleft',
				    	callback: function(){
				    		self.isSelecting = false;
			    			rangeRec && rangeRec.remove();
			    			selectRangeFeatureGroup && selectRangeFeatureGroup.clearLayers();
			    			return leafMap.editTools.startRectangle();
				    	},
				    	kind: 'rectangle',
				    	html: '矩形',
				    	tip: '画矩形'
			    	}
			    });

			    Leaflet.SaveControl = Leaflet.EditControl.extend({
			    	options: {
				    	position: 'topleft',
				    	callback: this.saveFeatures,
				    	kind: 'save',
				    	html: '保存',
				    	tip: ''
			    	}
			    });

			    Leaflet.exportControl = Leaflet.EditControl.extend({
			    	options: {
				    	position: 'topleft',
				    	callback: this.selectRange,
				    	kind: 'select',
				    	html: '框选',
				    	tip: '框选导出范围'
			    	}
			    });

		      	Leaflet.ResetControl = Leaflet.EditControl.extend({
			    	options: {
				    	position: 'topleft',
				    	callback: this.empty,
				    	kind: 'reset',
				    	html: '重置',
				    	tip: '重置编辑区'
			    	}
			    });



			    leafMap.addControl(new Leaflet.RectControl());
			    leafMap.addControl(new Leaflet.PolyControl());
			    leafMap.addControl(new Leaflet.SaveControl());
			    leafMap.addControl(new Leaflet.exportControl());
			    leafMap.addControl(new Leaflet.ResetControl());
			},

			createMap: function(){

				Editable(Leaflet,{editable: true});
				leafMap =  Leaflet.map('map');
				Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
				id: 'mapbox.streets'
				}).addTo(leafMap);

				var baseLayers = {
    				"Mapbox": "mapbox"
    				//,"OpenStreetMap": osm
				};
				var overlays = {
    				//"Marker": marker
    				//"Roads": roadsLayer
				};
				//Leaflet.control.layers(baseLayers).addTo(leafMap);

			var viewCenter =[21.505,111.09];
			    var viewZoom = 10;
			    leafMap.setView(viewCenter, viewZoom); 	
			}
		},
		mounted() {
			this.createMap();
				this.createToolBar();


			    // var polygon = Leaflet.rectangle([
			    //     [24.409, 118.1],
			    //     [24.6, 118.5]    
			    // ]).addTo(leafMap);
			    // polygon.enableEdit(leafMap);
			    // polygon.on('click', Leaflet.DomEvent.stop).on('click', polygon.toggleEdit);

			     leafMap.on('mousemove', (e) => {
			    	if(!this.isSelecting) return;
			    	this.onDrawingRec(e);
			    });


			    leafMap.on('mousedown', (e) => {
			    	// console.log(this.rectangel_start);
			    	// if(this.drawType === DRAWPOLYGON){
			    	// 	this.startDrawPolygon(e) || this.finishDrawingPolygon(e);
			    	// } else {
			    	// 	this.startDrawingRec(e) || this.finishDrawingRec(e);
			    	// }

			    	console.log('click map');

			    	if(!this.isSelecting) return;
			    	this.isDrawing ? this.finishDrawingRec(e) : this.startDrawingRec(e);
			    	
			    });

			    // leafMap.on('movestart', () => {
			    // 	if(!this.isSelecting) return;
		    	// 	this.cancelDrawingRec();
			    // });

			    window.eventBus.$on('afterAddingData', function(){
					leafMap.editTools.featuresLayer.clearLayers();
			    })
		}
	}

</script>

<style scoped lang="scss">
@import "../../node_modules/leaflet/dist/leaflet.css";

.mapContainer{
	position: absolute;
	width: 100%;
	height:100%;
}
</style>