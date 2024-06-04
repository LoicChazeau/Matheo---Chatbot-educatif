<template>
	<div class="chat-header">
		<div class="user-info">
			<img class="avatar" :src="user.avatar" alt="Avatar" />
			<div class="col">
				<span class="name">{{ user.name }}</span>
				<span class="ine">{{ user.ine }}</span>
			</div>
		</div>
		<div class="separator"></div>
	</div>
</template>

<script>
	export default {
		props: ['user'],
	};
</script>

<style scoped>
	.chat-header {
	}
	.user-info {
		display: flex;
    margin: 20px;
    margin-left: 30px;
	}
	.avatar {
		width: 50px;
		height: 50px;
	}
	.col {
		display: flex;
		flex-direction: column;
    margin-left: 15px;
	}
	.name {
    color: #171A1B;
    font-weight: 600;
	}
	.ine {
    color: #9A9B9B;
    font-size: 0.85rem;
	}
	.separator {
    border-bottom: 1px solid #E5E5E5;
    margin: 0 25px;
	}
</style>


/* Line 1 */

position: absolute;
width: 1057px;
height: 0px;
left: 335px;
top: 114px;

border: 1px solid #E5E5E5;
