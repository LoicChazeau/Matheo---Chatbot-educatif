<template>
	<section id="image-to-text">
		<h2>Module de Conversion Image vers Texte</h2>
		<input type="file" @change="onFileChange" accept="image/*" />
		<div v-if="imageSrc">
			<h3>Image téléchargée :</h3>
			<img :src="imageSrc" alt="Uploaded Image" />
		</div>
		<button v-if="imageSrc" @click="convertImage">Convertir</button>
		<p v-if="loading">Conversion en cours...</p>
		<div style="display: flex; flex-direction: column;" v-if="convertedText">
			<textarea v-model="convertedText" rows="10" cols="50" readonly></textarea>
			<button @click="copyToClipboard">Copier le texte</button>
		</div>
	</section>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			file: null,
      imageSrc: null,
			loading: false,
			convertedText: '',
			apiKey: 'K82545656688957'
		};
	},
	methods: {
		onFileChange(event) {
			this.file = event.target.files[0];
      if (this.file) {
				this.imageSrc = URL.createObjectURL(this.file);
			}
		},
		async convertImage() {
			if (!this.file) return;

			this.loading = true;
			this.convertedText = '';

			try {
        console.log('Starting conversion...');
				const formData = new FormData();
				formData.append('image', this.file);
        formData.append('language', 'fre');
        formData.append('isTable', true);
        formData.append('OCREngine', 2);

				const response = await axios.post('https://api.ocr.space/parse/image', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						'apikey': this.apiKey,
					},
				});

        console.log('API response:', response);

				if (response.data && response.data.ParsedResults && response.data.ParsedResults.length > 0) {
					this.convertedText = response.data.ParsedResults[0].ParsedText;
				} else {
					this.convertedText = 'No text found in the image.';
				}
			} catch (error) {
				console.error('Error:', error);
				this.convertedText = 'Error during conversion.';
			} finally {
				this.loading = false;
			}
		},
    copyToClipboard() {
			const textarea = document.createElement('textarea');
			textarea.value = this.convertedText;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
		}
	},
};
</script>

<style scoped>
section {
	background-color: white;
	border: 1px solid #ddd;
	border-radius: 5px;
	padding: 20px;
	margin: 10px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
img {
	max-width: 100%;
	margin-top: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
}
textarea {
	margin-top: 10px;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
}
button {
	margin-top: 10px;
}
</style>
