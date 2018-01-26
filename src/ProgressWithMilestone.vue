<template>
  <div class="progress-with-milestone">
    <div :style="lineStyle" class="line"></div>
    <div
      @click="transformTo(index)"
      :style="getMilestoneStyle(index)"
      class="milestone-container"
      v-for="(item, index) in level"
      :key="index"
    >
      <div class="milestone"></div>
      <!-- buggie, manually set color -->
      <text
        :style="currentIndex === index ? selectedStyle : { color: '#888888' }"
        class="text"
      >{{item}}</text>
    </div>
    <div
      :style="spinnerStyle"
      @panmove="onTouchMove"
      @panend="onTouchEnd"
      ref="spinner"
      class="spinner"
    ></div>
  </div>
</template>

<script>
import { getNearestNumberOfArray } from './util.js'

const LEVEL = [ 'Beginner', 'Intermediate', 'Advanced', 'Expert' ]

const animation = weex.requireModule('animation')
const { env } = weex.config

const offsetLeft = 50
const pointWidth = 80
const lineWidth = 650
const spinnerWidth = 44

const getOffsetLeft = e => {
  let radius = spinnerWidth / 2
  // buggie
  // let offset = e.pageX / env.scale - radius
  let offset = e.pageX - radius
  let minOffset = offsetLeft - radius
  if (offset < minOffset) {
    return minOffset
  }
  let maxOffset = lineWidth + offsetLeft - radius
  if (offset > maxOffset) {
    return maxOffset
  }
  return offset
}

export default {
  props: {
    level: {
      type: Array,
      default: () => LEVEL
    },
    selectedStyle: {
      type: Object,
      default: () => ({
        color: '#74C786'
      })
    }
  },
  data () {
    return {
      currentIndex: 0,
      spinnerStyle: {},
      milestones: []
    }
  },
  computed: {
    levelLength () {
      return this.level.length
    },
    lineStyle () {
      return {
        left: '50px',
        width: `${lineWidth}px`
      }
    }
  },
  created () {
    this.spinnerStyle = {
      // left: `${this.getSpinnerLeft()}px`
      transform: `translateX(${this.getSpinnerLeft()}px)`
    }
    console.log(this.spinnerStyle)
    for (let i = 0, l = this.levelLength; i < l; i++) {
      this.milestones.push(this.getMilestoneLeft(i))
    }
  },
  methods: {
    getMilestoneStyle (index) {
      return {
        // left: `${this.getMilestoneLeft(index)}px`
        transform: `translateX(${this.getMilestoneLeft(index)}px)`
      }
    },
    getMilestoneLeft (index) {
      return offsetLeft + index * (lineWidth / (this.levelLength - 1)) - pointWidth / 2
    },
    getSpinnerLeft () {
      return offsetLeft + this.currentIndex * (lineWidth / (this.levelLength - 1)) - spinnerWidth / 2
    },
    gotoNearestPoint (offset) {
      this.transformTo(getNearestNumberOfArray(this.milestones, offset))
    },
    transformTo (index) {
      this.currentIndex = index
      animation.transition(this.$refs.spinner, {
        styles: {
          // left: `${this.getSpinnerLeft()}px`
          transform: `translateX(${this.getSpinnerLeft()}px)`
        },
        timingFunction: 'ease',
        duration: 200
      }, () => {
      })
    },
    onTouchMove (e) {
      animation.transition(this.$refs.spinner, {
        styles: {
          transform: `translateX(${getOffsetLeft(e.changedTouches[0])}px)`
          // left: `${getOffsetLeft(e.changedTouches[0])}px`
        },
        timingFunction: 'ease',
        duration: 0
      }, () => {
      })
    },
    onTouchEnd (e) {
      this.gotoNearestPoint(getOffsetLeft(e.changedTouches[0]))
    }
  }
}
</script>

<style scoped>
.progress-with-milestone {
  width: 750px; height: 186px; background-color: #FFFFFF;
}
.line {
  position: absolute; top: 68px; height: 4px;
  background-color: #dedede;
}
.milestone-container {
  position: absolute; top: 58px; width: 80px; justify-content: flex-start; align-items: center;
}
/** height&width should be related to pointWidth **/
.milestone {
  height: 24px; width: 24px; background-color: #ededed;
  border-radius: 12px;
}
/** height&width should be related to spinnerWidth **/
.spinner {
  position: absolute; height: 44px; width: 44px; border-radius: 22px;
  background-color: #F6F6F6; border-style: solid; border-width: 1px;
  border-color: #898989; top: 48px; /** left: 38px; **/
  background-image: linear-gradient(to bottom, #FFFFFF, #EEEEEE);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}
.text {
  font-size: 28px; color: #888888; margin-top: 28px;
}
</style>
