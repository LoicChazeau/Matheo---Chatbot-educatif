<template>
  <div class="login">
    <div class="left-section"></div>
    <div class="right-section">
      <div class="logo">
        <img src="../assets/logo.svg" alt="Matheo Logo" />
        <span>Matheo</span>
      </div>
      <form v-if="!isChoosingAvatar" class="login-form">
        <input v-model="ine" placeholder="Numéro INE" />
        <input v-model="password" type="password" placeholder="Mot de passe" />
        <div class="login-btn" @click="login">Connexion</div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <div v-if="isChoosingAvatar" class="avatar-selection">
        <p>Choisis ton avatar</p>
        <div class="avatars">
          <img
            v-for="avatar in avatars"
            :key="avatar"
            :src="'src/assets/avatar/' + avatar + '.svg'"
            :alt="avatar"
            @click="selectAvatar(avatar)"
            :class="{ selected: selectedAvatar === avatar }"
          />
        </div>
        <div class="login-btn" @click="chooseAvatar">Valider</div>
      </div>
      <div class="footer">
        <img
          class="logo-ministere"
          src="../assets/logo_ministere.png"
          alt="Ministère de l'Éducation"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDocs,
  query,
  where,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";

export default {
  data() {
    return {
      ine: "",
      password: "",
      errorMessage: "",
      isChoosingAvatar: false,
      avatars: [
        "avatar1",
        "avatar2",
        "avatar3",
        "avatar4",
        "avatar5",
        "avatar6",
        "avatar7",
        "avatar8",
      ],
      selectedAvatar: "",
      userDocId: null,
    };
  },
  methods: {
    async login() {
      if (!this.ine || !this.password) {
        this.errorMessage =
          "Veuillez entrer votre numéro INE et votre mot de passe";
        return;
      }

      const usersRef = collection(this.$db, "users");
      const q = query(usersRef, where("ine", "==", this.ine));
      console.log("Attempting login for INE: ", this.ine);

      try {
        const querySnapshot = await getDocs(q);
        console.log("Login Query Snapshot: ", querySnapshot);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          this.userDocId = userDoc.id;
          console.log("User Data: ", userData);

          if (!userData.register) {
            // Première connexion : vérifier le mot de passe en clair et hacher
            if (userData.password === this.password) {
              console.log("Password matches, hashing password...");
              const hashedPassword = await bcrypt.hash(this.password, 10);
              await updateDoc(doc(this.$db, "users", userDoc.id), {
                password: hashedPassword,
                register: true,
              });
              localStorage.setItem(
                "user",
                JSON.stringify({ ...userData, password: hashedPassword })
              );
              this.isChoosingAvatar = true;
            } else {
              this.errorMessage = "Mot de passe incorrect";
            }
          } else {
            // Connexion régulière : vérifier le mot de passe haché
            const validPassword = await bcrypt.compare(
              this.password,
              userData.password
            );
            console.log("Password comparison result: ", validPassword);
            if (validPassword) {
              localStorage.setItem("user", JSON.stringify(userData));
              this.$router.push("/chat");
            } else {
              this.errorMessage = "Mot de passe incorrect";
            }
          }
        } else {
          this.errorMessage = "Numéro INE inexistant";
        }
      } catch (error) {
        console.error("Error during login: ", error);
        this.errorMessage = "Erreur lors de la connexion";
      }
    },
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    },
    async chooseAvatar() {
      if (!this.selectedAvatar) {
        this.errorMessage = "Veuillez choisir un avatar";
        return;
      }

      try {
        await updateDoc(doc(this.$db, "users", this.userDocId), {
          profileImageURL: this.selectedAvatar,
        });
        const user = JSON.parse(localStorage.getItem("user"));
        user.profileImageURL = this.selectedAvatar;
        localStorage.setItem("user", JSON.stringify(user));
        this.$router.push("/chat");
      } catch (error) {
        console.error("Error updating avatar: ", error);
        this.errorMessage = "Erreur lors de la mise à jour de l'avatar";
      }
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  height: 100vh;
}

.left-section {
  width: 70%;
  background: url("../assets/background.webp") no-repeat center center/cover;
}

.right-section {
  width: 30%;
  background-color: #151718;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  color: white;
  padding: 2rem;
  padding-top: 7rem;
  padding-bottom: 0px;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.logo img {
  width: 50px;
}

.logo span {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.login-form,
.avatar-selection {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.avatar-selection {
  margin-top: 0px !important;
}

.login-form input,
.avatar-selection input {
  width: 90%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  height: 20px;
}

.avatar-selection p {
  margin-bottom: 10px;
  margin-right: auto;
}

.avatars {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px 10px;
  gap: 10px;
  margin-bottom: 1rem;
}

.avatars img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
}

.avatars img.selected {
  border: 2px solid #000000;
}

::placeholder {
  color: #b8b8b8;
  font-size: 0.7rem;
  opacity: 1;
}

input::placeholder {
  color: #b8b8b8;
}

input:-moz-placeholder {
  color: #b8b8b8;
  opacity: 1;
}

input:-ms-input-placeholder {
  color: #b8b8b8;
}

input::-ms-input-placeholder {
  color: #b8b8b8;
}

.login-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  margin: 0 30px;
  padding: 10px 0;
  background: #5eacdc;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
}

.login-btn:hover {
  opacity: 0.95;
}

.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
  height: 40px;
}

.footer {
  margin-top: auto;
  margin-bottom: 30px;
  text-align: center;
}

.footer img {
  width: 70px;
  border-radius: 5px;
}
</style>
