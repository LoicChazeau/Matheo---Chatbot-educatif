<script>
import ImageToText from '../components/ImageToText.vue'

export default {
  name: 'App',
  components: {
    ImageToText,
  }
}
</script>

<template>
	<div class="home">
		welcome
		<ImageToText />
	</div>
</template>

<style scoped>
	.home {
		height: 100vh;
		display: flex;
	}

</style>
