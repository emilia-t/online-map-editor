<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="19px" height="19px">
    <image  x="0px" y="0px" width="19px" height="19px"  xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfnCQMKFyWbIJkCAAAA+UlEQVQoz5WRsUoDQRRFzy67IEJI44KVXaziJ9im8BO0yScI/oe2liISLGwkiJhvELEVywS0sDK4RQw5Fm5242SJeocHM/feGebdhwSr57u9kI0JkdEgC8ll27ioX2y1+Kdtm9Ma9Zr9Yifipqp3IvbVvog3qu5UnX5wBXQ4B16AV+CMPeCCYfXad16qR56oxx6qejlXF0O8VTUvav6JJRveW+FhUcGWbZvFcc2nwvTsesE1bdvCidot72048NGBWcl01UlCCkRlUm90guwiII3JgemKAUyBPCYCRitsIyBKmAEHbJHWmj7ZBWaR/mX0CUMaP5oIITD+At2ezPBZL3xNAAAAAElFTkSuQmCC" />
  </svg>
</template>

<script>
export default {
  name: "download",
  props:{
    custom:{
      type:String,
      default:null,
      required:false,
    }
  }
}
</script>

