<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="220px" height="231px">
    <path fill-rule="evenodd"  fill="rgb(233, 235, 238)"
          d="M0.909,5.824 C1.086,4.584 1.660,3.435 2.545,2.550 C3.430,1.665 4.579,1.090 5.818,0.913 L214.182,0.913 C215.413,1.098 216.554,1.671 217.436,2.550 C218.325,3.435 218.905,4.583 219.091,5.824 L219.091,225.176 C218.905,226.417 218.325,227.565 217.436,228.450 C216.554,229.329 215.413,229.902 214.182,230.087 L5.818,230.087 C4.579,229.910 3.430,229.335 2.545,228.450 C1.660,227.565 1.086,226.416 0.909,225.176 L0.909,5.824 Z"/>
    <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
          d="M0.909,165.154 L219.091,165.154 L219.091,225.176 C218.905,226.417 218.325,227.565 217.436,228.450 C216.554,229.329 215.413,229.902 214.182,230.087 L5.818,230.087 C4.579,229.910 3.430,229.335 2.545,228.450 C1.660,227.565 1.086,226.416 0.909,225.176 L0.909,165.154 Z"/>
    <path fill-rule="evenodd"  fill="rgb(236, 238, 241)"
          d="M9.091,200.076 L148.182,200.076 L148.182,211.535 L9.091,211.535 L9.091,200.076 Z"/>
    <path fill-rule="evenodd"  fill="rgb(236, 238, 241)"
          d="M9.091,191.891 L99.091,191.891 L99.091,178.796 L9.091,178.796 L9.091,191.891 Z"/>
    <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
          d="M9.091,15.100 L53.273,15.100 L53.273,26.559 L9.091,26.559 L9.091,15.100 Z"/>
    <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
          d="M150.364,11.826 L174.364,11.826 L174.364,30.378 L150.364,30.378 L150.364,11.826 Z"/>
    <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
          d="M186.909,30.378 L210.909,30.378 L210.909,11.826 L186.909,11.826 L186.909,30.378 Z"/>
    <text kerning="auto" font-family="Adobe Heiti Std" fill="rgb(0, 0, 0)" transform="matrix( 0.54545454545455, 0, 0, 0.54565217391304,46.7662727272727, 128.946330434783)" font-size="79.993px"><tspan font-size="79.993px" fill="#FFFFFF">empty</tspan></text>
    <text kerning="auto" font-family="Adobe Heiti Std" fill="rgb(0, 0, 0)" transform="matrix( 0.54545454545455, 0, 0, 0.54565217391304,27.3437272727273, 90.3488304347826)" font-size="79.993px"><tspan font-size="79.993px" fill="#FFFFFF">&#21015;&#34920;&#20026;&#31354;</tspan></text>
  </svg>
</template>

<script>
export default {
  name: "emptyServer",
  props:{
    custom:{
      type:String,
      default:null,
      required:false,
    }
  }
}
</script>

<style scoped>

</style>
