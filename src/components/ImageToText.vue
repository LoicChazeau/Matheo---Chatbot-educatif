<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <label class="file-upload-btn">
        <input type="file" @change="onFileChange" accept="image/*" />
        <img src="../assets/file.svg" alt="Importer une image" />
        Importer une image
      </label>
      <div class="image-preview-container">
        <div class="image-preview" v-if="imageSrc">
          <img :src="imageSrc" alt="Uploaded Image" />
        </div>
        <div class="image-preview-placeholder" v-else></div>
        <div class="image-info">
          <p>{{ fileName }}</p>
          <div class="btn convert-btn" @click="convertImage" :class="{ 'btn-disabled': !file }" :disabled="!file">Convertir</div>
        </div>
      </div>
      <div class="converted-text-container" v-if="convertedText">
        <textarea v-model="convertedText" rows="10" cols="50"></textarea>
      </div>
      <div class="modal-actions">
        <div class="btn" @click="cancel">Annuler</div>
        <div class="confirm-btn" @click="validate" :class="{ 'btn-disabled': !convertedText }" :disabled="!convertedText">Valider</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      file: null,
      imageSrc: null,
      loading: false,
      convertedText: "",
      apiKey: "K82545656688957",
      showModal: false,
    };
  },
  computed: {
    fileName() {
      return this.file ? this.file.name : "Aucune image sélectionnée";
    },
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
      this.convertedText = "";

      try {
        console.log("Starting conversion...");
        const formData = new FormData();
        formData.append("image", this.file);
        formData.append("language", "fre");
        formData.append("isTable", true);
        formData.append("OCREngine", 2);

        const response = await axios.post("https://api.ocr.space/parse/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            apikey: this.apiKey,
          },
        });

        console.log("API response:", response);

        if (response.data && response.data.ParsedResults && response.data.ParsedResults.length > 0) {
          this.convertedText = response.data.ParsedResults[0].ParsedText;
        } else {
          this.convertedText = "No text found in the image.";
        }
      } catch (error) {
        console.error("Error:", error);
        this.convertedText = "Error during conversion.";
      } finally {
        this.loading = false;
      }
    },
    copyToClipboard() {
      const textarea = document.createElement("textarea");
      textarea.value = this.convertedText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    },
    cancel() {
      this.resetFields();
      this.showModal = false;
    },
    validate() {
      if (!this.convertedText) return;
      if (this.convertedText) {
        this.$emit("sendMessage", this.convertedText);
      }
      this.resetFields();
      this.showModal = false;
    },
    resetFields() {
      this.file = null;
      this.imageSrc = null;
      this.loading = false;
      this.convertedText = "";
    },
    open() {
      this.showModal = true;
    },
    close() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.file-upload-btn {
  height: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
  margin-bottom: 13px;
  padding: 12px 0;
  background: #5eacdc;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  color: white;
  position: relative;
}
.file-upload-btn input[type="file"] {
  display: none;
}
.file-upload-btn:hover {
  opacity: 0.95;
}
.file-upload-btn img {
  margin-right: 15px;
}
.image-preview-container {
  display: flex;
  width: 100%;
  align-items: end;
  margin-bottom: 15px;
}
.image-preview {
  width: 240px;
  height: 150px;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.image-preview img {
  max-width: 100%;
  max-height: 100%;
}
.image-preview-placeholder {
  width: 240px;
  height: 150px;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
}
.image-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
  width: 186px;
}
.image-info p {
  color: #000;
  font-size: 14px;
  margin-bottom: 15px;
}
.btn {
  height: 20px;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  padding: 10px 0;
  background: transparent;
  border: solid 1.5px #5eacdc;
  color: #5eacdc;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
}
.btn-disabled {
  background-color: #ddd !important;
  border: none;
  color: #aaa !important;
  cursor: not-allowed !important;
}
.convert-btn {
  width: 100%;
  margin: 0;
}
.btn:hover {
  opacity: 0.85;
  background-color: #5eacdc;
  color: white;
}
.converted-text-container {
  width: 100%;
}
.converted-text-container textarea {
  width: 97%;
  border-radius: 12px;
  background-color: #fafafa;
  border: 1px solid #e6e6e6;
  padding: 5px;
  resize: none;
}
.confirm-btn {
  height: 20px;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  padding: 10px 0;
  background: #5eacdc;
  border: solid 1.5px transparent;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
}
.confirm-btn:hover {
  opacity: 0.85;
}
.modal-actions {
  display: flex;
  justify-content: end;
  width: 100%;
  margin-top: 20px;
}
</style>
