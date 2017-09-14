<template>
<section>
		<div id="map" class="mapContainer"></div>
		<div style="position: absolute; bottom: 10px; right: 20px; z-index: 1000;" @mouseover="onOverTileSwitch" @mouseleave="onLeaveTileSwitch">
			<a href="javascript:void(0);" style="float: left; margin-left: 5px; color: #000; text-decoration: none;" @click="onShowTileLayer">
				<img src="../../assets/mapBtn1.png"><div style="background-color: #fff; text-align: center; margin-top: -5px;">地图</div>
			</a>
			<a v-show="imageLayerVisible" href="javascript:void(0);" style="position: relative;float: left; margin-left: 5px; color: #000; text-decoration: none;" @click="onShowImgLayer">
				<label style="position: absolute; top: 0; color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.5);" >
					<input style="position: absolute;" type="checkbox" v-model="showroad">
					<span style="margin-left: 20px;">路网信息</span>
				</label>
				<img src="../../assets/mapBtn2.png"><div style="background-color: #fff; text-align: center; margin-top: -5px;">卫星</div>
			</a>
		</div>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="rangeFormVisible" :close-on-click-modal="false" style="width: 50%;">
			<el-form>
				<el-form-item label="图像类型">
					<el-radio-group v-model="exportImgType">
						<el-radio label="IMAGE">亚米影像</el-radio>
						<el-radio label="VECTOR">1:2000矢量</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="cancelSelectRange">取消</el-button>
				<el-button type="primary" @click.native="rangeFormVisible = false;">确定</el-button>
			</div>
		</el-dialog>


</section>
</template>

<script>
	import L from 'leaflet'
	import Editable from '../../common/js/Leaflet.Editable.js'
	import PathDrag from '../../common/js/Path.Drag.js'
	import GeometryUtil from '../../common/js/L.GeometryUtil.js'
	import {spatialQuery, getMapConfig} from '../../api/api.js'


	let myMap = null;
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
					roadLayer.addTo(myMap);
				} else {
					roadLayer.remove();
				}
				
			},
			geoJSONs: {

				handler(val){
					if(!reviewFeatureGroup){
						reviewFeatureGroup = L.featureGroup();
						reviewFeatureGroup.addTo(myMap);
					} else {
						reviewFeatureGroup.clearLayers();
					}

					selectRangeFeatureGroup && selectRangeFeatureGroup.clearLayers();
					rangeRec && rangeRec.remove();
					//myMap.editTools.featuresLayer.clearLayers();
					this.showPolygons(val, reviewFeatureGroup, true);
				},

				deep: true
			},

			editableGeoJSON: function(val){ 
					var featuresLayer = myMap.editTools.featuresLayer;
					featuresLayer.clearLayers();

					if(!val){
						return;
					}

					var featureGroup = L.featureGroup();
					L.geoJSON(val.geoJSON, {
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

			    				layer = L.rectangle([[coordinates[0][1], coordinates[0][0]], [coordinates[2][1], coordinates[2][0]]], STYLE[val.type]);
			    			}

			    			//console.log(coordinates);

			    			featuresLayer.addLayer(layer);
			    			featureGroup.addLayer(layer);
							layer.enableEdit(myMap);
			    			// layer.on('click', L.DomEvent.stop).on('click', layer.toggleEdit);
			    			layer.on('dblclick', L.DomEvent.stop).on('dblclick', function(){
			    					featuresLayer.removeLayer(layer);
			    			});

			    			layer.bindPopup('面积：'+ L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(layer.toGeoJSON().geometry.coordinates[0]), true) || 0).openPopup();

						}
					});

					myMap.fitBounds(featureGroup.getBounds());

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

						L.geoJSON(item.geojson, {
							style: STYLE[item.type],
							onEachFeature: function(feature, layer){
								featureGroup.addLayer(layer);
								layer.bindPopup('面积：'+ L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(layer.toGeoJSON().geometry.coordinates[0]), true) || 0).openPopup();
							}
						})
						
					//} catch(e){}
					
				};

				if(!fited) return;

				try{
					myMap.fitBounds(featureGroup.getBounds());
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
				tileLayer.addTo(myMap);
			},

			onShowImgLayer: function(){
				
				tileLayer.remove();
				imageLayer.addTo(myMap);
				if(this.showroad){
					roadLayer.addTo(myMap);
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
						selectRangeFeatureGroup = L.featureGroup();
						selectRangeFeatureGroup.addTo(myMap);
					} else {
						selectRangeFeatureGroup.clearLayers();
					}

					this.showPolygons(geometries, selectRangeFeatureGroup);
					
				})
			},

			onDrawingRec: function(e){
				if(this.rectangel_start !== null){
		    		rangeRec &&　rangeRec.remove();
		    		rangeRec = L.rectangle([
				       this.rectangel_start,
				       e.latlng
				    ], {
				    	weight: 1,
				    	fillOpacity: 0
				    }).addTo(myMap);
				    
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
				var geojson = myMap.editTools.featuresLayer.toGeoJSON();
				if(!geojson.features.length){
					this.$message({
						message: '请在地图上添加图斑',
						tyep: 'warning'
					})
				} else {
					var totalArea = 0;

					if(geojson.type === "FeatureCollection"){
						geojson.features.forEach((item) => {
							item.properties.area = L.GeometryUtil.geodesicArea(item.geometry.coordinates[0]);
							totalArea += item.properties.area;
						})
					} else {
						geojson.properties.area = L.GeometryUtil.geodesicArea(geojson.geometry.coordinates[0]);
						totalArea += item.properties.area;
					}

					geojson.totalArea = totalArea;

					// console.log(geojson);
					this.save(geojson);
				}
			    
			},

			empty(){
				 this.reset();
				 myMap.editTools.featuresLayer.clearLayers();
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
			    L.EditControl = L.Control.extend({
		    	options: {
		    		position:'topleft',
		    		callback: null,
		    		kind: '',
		    		html: ''
		    	},

		    	onAdd: function(map){
		    		var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
		    			link = L.DomUtil.create('a', '', container);

	    			link.href = '#';
	    			link.innerHTML = this.options.html;
	    			link.title = this.options.tip;
	    			L.DomEvent.on(link, 'click', L.DomEvent.stop)
	    					  .on(link, 'click', function(){
	    					  	var polygon = this.options.callback.call();
	    					  	 if(polygon) {
	    					  	 	// polygon.on('click', L.DomEvent.stop).on('click', polygon.toggleEdit);
	    					  	 	polygon.on('dblclick', L.DomEvent.stop).on('dblclick', function(){
	    					  	 		myMap.editTools.featuresLayer.removeLayer(polygon);
	    					  	 	});

	    					  	 	polygon.on('editable:vertex:dragend', e => {
	    					  	 		setTimeout(function(){
							     			polygon.bindPopup('面积：'+ L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(polygon.toGeoJSON().geometry.coordinates[0]), true) || 0).openPopup();
	    					  	 		}, 100);
						     		});

						     		polygon.on('editable:vertex:clicked', e => {
	    					  	 		console.log(polygon.toGeoJSON().geometry.coordinates[0]);
	    					  	 		setTimeout(function(){
							     			polygon.bindPopup('面积：'+ L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(polygon.toGeoJSON().geometry.coordinates[0]), true) || 0).openPopup();
	    					  	 		}, 100);
						     		});
	    					  	 }
	    					  }, this);

					return container;
			    	}
			    });

			    L.DrawPolygonControl = L.EditControl.extend({
			    	options: {
			    		position: 'topleft',
			    		callback: function(){
			    			self.isSelecting = false;
			    			rangeRec && rangeRec.remove();
			    			selectRangeFeatureGroup && selectRangeFeatureGroup.clearLayers();
			    			return myMap.editTools.startPolygon();
			    		},
			    		kind: 'polygon',
			    		html: '多边',
			    		tip: '画多边形'
			    	}
			    	
			    });

			    L.DrawRectangleControl = L.EditControl.extend({
			    	options: {
				    	position: 'topleft',
				    	callback: function(){
				    		self.isSelecting = false;
			    			rangeRec && rangeRec.remove();
			    			selectRangeFeatureGroup && selectRangeFeatureGroup.clearLayers();
			    			return myMap.editTools.startRectangle();
				    	},
				    	kind: 'rectangle',
				    	html: '矩形',
				    	tip: '画矩形'
			    	}
			    });

			    L.SaveControl = L.EditControl.extend({
			    	options: {
				    	position: 'topleft',
				    	callback: this.saveFeatures,
				    	kind: 'save',
				    	html: '保存',
				    	tip: ''
			    	}
			    });

			    L.exportControl = L.EditControl.extend({
			    	options: {
				    	position: 'topleft',
				    	callback: this.selectRange,
				    	kind: 'select',
				    	html: '框选',
				    	tip: '框选导出范围'
			    	}
			    });

		      	L.ResetControl = L.EditControl.extend({
			    	options: {
				    	position: 'topleft',
				    	callback: this.empty,
				    	kind: 'reset',
				    	html: '重置',
				    	tip: '重置编辑区'
			    	}
			    });



			    myMap.addControl(new L.DrawRectangleControl());
			    myMap.addControl(new L.DrawPolygonControl());
			    myMap.addControl(new L.SaveControl());
			    myMap.addControl(new L.exportControl());
			    myMap.addControl(new L.ResetControl());
			},

			createMap: function(){

				return getMapConfig().then(function (config) {

					var tileSize = 256,
		            mapMaxBounds = [[-85,-180],[85,180]],

		            mapMinZoom = config.mapMinZoom,
		            mapMaxZoom = config.mapMaxZoom,
		            viewCenter = config.viewCenter,
		            viewZoom = config.viewZoom,
		       		tileMaxZoom = Math.max(config.satellite.tileMaxZoom, config.map.tileMaxZoom),

		            arcOrigin = [-400,400],
		            resolutions = [];

				    var resolution = 0.077970178239046617;
				    for(var i=0;i<tileMaxZoom;i++){
				        resolutions.push(resolution);
				        resolution=resolution/2;
				    }

				    Editable(L);
				    var CRSCustom = L.Class.extend({
				        projection: L.Projection.LonLat,
				        includes:L.CRS.Earth,
				        options:{
				            resolutions:[],
				            origin:[]
				        },
				        R:6378137,
				        initialize:function(a){
				            var options;
				            options=a||{};
				            L.Util.setOptions(this,options);
				            this.transformation = this.options.transformation;

				            if(this.options.origin){
				                this.transformation =new L.Transformation(1,-this.options.origin[0],-1,this.options.origin[1]);
				            }

				            if(this.options.resolutions){
				                this._scales=[];
				                for(var i=this.options.resolutions.length-1;i>=0;i--){
				                    if(this.options.resolutions[i]){
				                        this._scales[i] = 1/this.options.resolutions[i];
				                    }
				                }
				            }
				            this.infinite = !this.options.bounds;
				        },
				        scale: function(zoom) {
				            var iZoom = Math.floor(zoom),
				                    baseScale,
				                    nextScale,
				                    scaleDiff,
				                    zDiff;
				            if (zoom === iZoom) {
				                return this._scales[zoom];
				            } else {
				                // Non-integer zoom, interpolate
				                baseScale = this._scales[iZoom];
				                nextScale = this._scales[iZoom + 1];
				                scaleDiff = nextScale - baseScale;
				                zDiff = (zoom - iZoom);
				                return baseScale + scaleDiff * zDiff;
				            }
				        },
				        zoom: function(scale) {
				            // Find closest number in this._scales, down
				            var downScale = this._closestElement(this._scales, scale),
				                    downZoom = this._scales.indexOf(downScale),
				                    nextZoom,
				                    scaleDiff;
				            // Check if scale is downScale => return array index
				            if (scale === downScale) {
				                return downZoom;
				            }
				            // Interpolate
				            nextZoom = downZoom + 1;
				            scaleDiff = this._scales[nextZoom] - downScale;
				            return (scale - downScale) / scaleDiff + downZoom;
				        },
				        _closestElement: function(array, element) {
				            var low;
				            for (var i = array.length; i--;) {
				                if (array[i] <= element && (low === undefined || low < array[i])) {
				                    low = array[i];
				                }
				            }
				            return low;
				        }
				    });

				    var crs = new CRSCustom({
				        resolutions:resolutions,
				        origin:arcOrigin
				    });


				    myMap =  L.map('map',{
				        maxBounds: mapMaxBounds,
				        zoomControl: false,
				        attributionControl: false,
				        crs: crs,
				        minZoom: mapMinZoom,
				        maxZoom: mapMaxZoom,
				        zoomSnap: 1,
		        		editable: true
				    });

		            L.TileLayer.WebDogTileLayer = L.TileLayer.extend({
                        getTileUrl: function (tilePoint) {
                            var urlArgs,
                                getUrlArgs = this.options.getUrlArgs;

                            if (getUrlArgs) {
                                var urlArgs = getUrlArgs(tilePoint);
                            } else {
                                urlArgs = {
                                    z: tilePoint.z,
                                    x: tilePoint.x,
                                    y: tilePoint.y
                                };
                            }

                            return L.Util.template(this._url, L.extend(urlArgs, this.options, {s: this._getSubdomain(tilePoint)}));
                        }
                    });

                    L.tileLayer.webdogTileLayer = function (url, options) {
                        return new L.TileLayer.WebDogTileLayer(url, options);
                    };

				    tileLayer = L.tileLayer.webdogTileLayer(config.map.tileUrl,{
				        maxZoom: config.map.tileMaxZoom,
				        maxNativeZoom: config.map.maxNativeZoom,
				        noWrap:true,
				        tileSize:tileSize,
				        keepBuffer:5,
				        getUrlArgs: function (tilePoint) {
                                    return {
                                        z: 0,
                                        x: 0,
                                        y: 0
                                    };
                                }
				    }).addTo(myMap);

				    imageLayer = L.tileLayer(config.satellite.tileUrl, {
				        maxZoom: config.satellite.tileMaxZoom,
				        maxNativeZoom: config.satellite.maxNativeZoom,
				        noWrap:true,
				        tileSize:tileSize,
				        keepBuffer:5
				    });

				    roadLayer = L.tileLayer(config.road.tileUrl, {
				        maxZoom: config.road.tileMaxZoom,
				        maxNativeZoom: config.road.maxNativeZoom,
				        noWrap:true,
				        tileSize:tileSize,
				        keepBuffer:5
				    });

				    myMap.setView(viewCenter, viewZoom);

				});

			 	
			}
		},
		mounted() {
			this.createMap().then(() => {
				this.createToolBar();


			    // var polygon = L.rectangle([
			    //     [24.409, 118.1],
			    //     [24.6, 118.5]    
			    // ]).addTo(myMap);
			    // polygon.enableEdit(myMap);
			    // polygon.on('click', L.DomEvent.stop).on('click', polygon.toggleEdit);

			     myMap.on('mousemove', (e) => {
			    	if(!this.isSelecting) return;
			    	this.onDrawingRec(e);
			    });


			    myMap.on('mousedown', (e) => {
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

			    // myMap.on('movestart', () => {
			    // 	if(!this.isSelecting) return;
		    	// 	this.cancelDrawingRec();
			    // });

			    window.eventBus.$on('afterAddingData', function(){
					myMap.editTools.featuresLayer.clearLayers();
			    })
			});
		    
		}
	}

</script>

<style scoped lang="scss">
@import "../../../node_modules/leaflet/dist/leaflet.css";

.mapContainer{
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>