<template>
  <div class="timer">
    <div ref="startTimer"></div>
  </div>
</template>
<script>
export default {
  name: 'Timer',
  data () {
    return {
      timer: '',
      content: '',
      day: '0',
      hour: 0,
      minutes: 0,
      seconds: 0
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },

  methods: {
    created (ptime, day) {
      this.day = day
      this.hour = new Date(ptime).getHours()
      this.minutes = new Date(ptime).getMinutes()
      this.seconds = new Date(ptime).getSeconds()
      this.timer = setInterval(this.startTimer, 1000)
    },
    NotimeCreated () {
      this.$refs.startTimer.innerHTML = '00' + 'Day  ' + ('00') + ':' + ('00') + ':' + ('00')
    },
    startTimer () {
      this.seconds += 1
      if (this.seconds >= 60) {
        this.seconds = 0
        this.minutes = this.minutes + 1
      }

      if (this.minute >= 60) {
        this.minutes = 0
        this.hour = this.hour + 1
      }
      if (this.hour >= 60) {
        this.hour = 0
        this.day = this.day + 1
      }
      this.$refs.startTimer.innerHTML = this.day + 'Day  ' + (this.hour < 10 ? '0' + this.hour : this.hour) + ':' + (this.minutes < 10 ? '0' + this.minutes : this.minutes) + ':' + (this.seconds < 10 ? '0' + this.seconds : this.seconds)
    },
    returnTime () {
      let date = new Date()
      date.setDate(new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1).toString() + '-' + new Date().getDay().toString())
      date.setHours(this.hour)
      date.setMinutes(this.minutes)
      date.setSeconds(this.seconds)
      return date
    }
  }
}
</script>
<style>
</style>
