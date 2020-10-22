<template>
  <div class="app-container">
    <svg
      width="800"
      height="400"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp">
      <polygon :points="points"/>
      <circle cx="100" cy="100" r="80"/>
      <rect :x="stats[0].value" :width="collection[0].w" y="0" height="100" />
    </svg>
    <div v-for="stat in stats" :key="stat.label">
      <label>{{ stat.label }}</label>
      <input v-model="stat.value" type="range" min="0" max="100">
      <span>{{ stat.value }}</span>
      <button class="remove" @click="remove(stat)">X</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
//      <rect :x="this.graphList[0].x" :y="graphList[0].y" :width="graphList[0].w" :height="graphList[0].h"/>
var stats = [
  { label: 'A', value: 100 },
  { label: 'B', value: 100 },
  { label: 'C', value: 100 },
  { label: 'D', value: 100 }
]
var collection = [
  { type: 'r', x: 50, y: 30, w: 200, h: 100 }
]
var downFlag = false

export default {
  data() {
    return {
      stats,
      collection
    }
  },
  computed: {
    // a computed property for the polygon's points
    points: function() {
      var total = this.stats.length
      return this.stats
        .map(function(stat, i) {
          var point = valueToPoint(stat.value, i, total)
          return point.x + ',' + point.y
        })
        .join(' ')
    }
  },
  methods: {
    onMouseDown(e) {
      console.log('mouse down at', e.offsetX, e.offsetY)
      downFlag = true
    },
    onMouseMove(e) {
      if (downFlag){
        console.log('downMove')
      }
    },
    onMouseUp(e) {
      if (downFlag) {
        console.log('mouse drag to', e.offsetX, e.offsetY)
      } else {  
        console.log('mouse up at', e.offsetX, e.offsetY)
      }
      downFlag = false
    },
    add: function(e) {
      e.preventDefault()
      if (!this.newLabel) return
      this.stats.push({
        label: this.newLabel,
        value: 100
      })
      this.newLabel = ''
    },
    remove: function(stat) {
      if (this.stats.length > 3) {
        this.stats.splice(this.stats.indexOf(stat), 1)
      } else {
        alert('Can\'t delete more!')
      }
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
// math helper...
function valueToPoint(value, index, total) {
  var x = 0
  var y = -value * 0.8
  var angle = ((Math.PI * 2) / total) * index
  var cos = Math.cos(angle)
  var sin = Math.sin(angle)
  var tx = x * cos - y * sin + 100
  var ty = x * sin + y * cos + 100
  return {
    x: tx,
    y: ty
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
rect {
  fill: transparent;
  stroke: #000;
}
polygon {
  fill: transparent;
  stroke: #999;
}
circle {
  fill: transparent;
  stroke: #999;
}
</style>

