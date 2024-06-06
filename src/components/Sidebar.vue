<template>
	<div class="sidebar">
		<div class="sidebar-header">
			<img class="logo" src="../assets/logo.svg" alt="logo" />
			<span class="title">Mathéo</span>
		</div>
		<div class="new-chat-btn" @click="createNewChat">
			<img style="margin-right: 10px" src="../assets/add.svg" alt="add chat" />
			<span>Nouvelle discussion</span>
		</div>
		<div class="chat-list">
			<div v-if="!hasChats" class="no-history">Aucun historique, vous pouvez commencer une nouvelle discussion !</div>
			<div v-else>
				<div v-if="this.todayChats.length" class="chat-list-separator">
					<div class="separator"></div>
					<span class="separator-text">Aujourd'hui</span>
					<div class="separator"></div>
				</div>
				<div class="chat-item" v-for="chat in todayChats" :key="chat.id" @click="selectChat(chat)" :class="{ active: chat.id === selectedChatId }" ref="chatItems">
					<img src="../assets/chat.svg" alt="chat icon" />
					<template v-if="editingChatId === chat.id">
						<input class="rename" v-model="newChatName" @keyup.enter="confirmRename(chat)" />
						<img class="chat-item-option" src="../assets/check.svg" alt="validate rename" @click.stop="confirmRename(chat)" />
					</template>
					<template v-else>
						<span @click="selectChat(chat)">{{ chat.name }}</span>
						<img class="chat-item-option" src="../assets/option.svg" alt="chat options" @click.stop="showOptions(chat, $event)" />
					</template>
				</div>
				<ChatOptions v-if="showChatOptions" :chat="selectedChatForOptions" @rename="renameChat" @delete="deleteChat" :style="{ top: `${optionsPosition.top}px`, left: `${optionsPosition.left}px` }" />
				<div v-if="yesterdayChats.length" class="chat-list-separator">
					<div class="separator"></div>
					<span class="separator-text">Hier</span>
					<div class="separator"></div>
				</div>
				<div class="chat-item" v-for="chat in yesterdayChats" :key="chat.id" @click="selectChat(chat)" :class="{ active: chat.id === selectedChatId }" ref="chatItems">
					<img src="../assets/chat.svg" alt="chat icon" />
					<span>{{ chat.name }}</span>
					<img class="chat-item-option" src="../assets/option.svg" alt="chat options" @click.stop="showOptions(chat, $event)" />
				</div>
				<ChatOptions v-if="showChatOptions" :chat="selectedChatForOptions" @rename="renameChat" @delete="deleteChat" :style="{ top: `${optionsPosition.top}px`, left: `${optionsPosition.left}px` }" />
				<div v-if="last7DaysChats.length" class="chat-list-separator">
					<div class="separator"></div>
					<span class="separator-text">7 jours précédents</span>
					<div class="separator"></div>
				</div>
				<div class="chat-item" v-for="chat in last7DaysChats" :key="chat.id" @click="selectChat(chat)" :class="{ active: chat.id === selectedChatId }" ref="chatItems">
					<img src="../assets/chat.svg" alt="chat icon" />
					<span>{{ chat.name }}</span>
					<img class="chat-item-option" src="../assets/option.svg" alt="chat options" @click.stop="showOptions(chat, $event)" />
				</div>
				<ChatOptions v-if="showChatOptions" :chat="selectedChatForOptions" @rename="renameChat" @delete="deleteChat" :style="{ top: `${optionsPosition.top}px`, left: `${optionsPosition.left}px` }" />
				<div v-if="olderChats.length" class="chat-list-separator">
					<div class="separator"></div>
					<span class="separator-text">Anciennes conversations</span>
					<div class="separator"></div>
				</div>
				<div class="chat-item" v-for="chat in olderChats" :key="chat.id" @click="selectChat(chat)" :class="{ active: chat.id === selectedChatId }" ref="chatItems">
					<img src="../assets/chat.svg" alt="chat icon" />
					<span>{{ chat.name }}</span>
					<img class="chat-item-option" src="../assets/option.svg" alt="chat options" @click.stop="showOptions(chat, $event)" />
				</div>
				<ChatOptions v-if="showChatOptions" :chat="selectedChatForOptions" @rename="renameChat" @delete="deleteChat" :style="{ top: `${optionsPosition.top}px`, left: `${optionsPosition.left}px` }" />
			</div>
		</div>
		<div class="footer">
			<div class="logout-btn" @click="logout">
				<img style="margin-right: 10px" src="../assets/logout.svg" alt="logout" />
				<span>Deconnexion</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, updateDoc, doc } from 'firebase/firestore';
	import { useRoute } from 'vue-router';
	import ChatOptions from './ChatOptions.vue';

	export default {
		components: {
			ChatOptions,
		},
		props: ['chats'],
		data() {
			return {
				todayChats: [],
				yesterdayChats: [],
				last7DaysChats: [],
				olderChats: [],
				userINE: JSON.parse(localStorage.getItem('user')).ine,
				selectedChatId: null,
				showChatOptions: false,
				selectedChatForOptions: null,
				optionsPosition: { top: 0, left: 0 },
				editingChatId: null,
				newChatName: '',
			};
		},
		computed: {
			hasChats() {
				return this.todayChats.length || this.yesterdayChats.length || this.last7DaysChats.length || this.olderChats.length;
			},
		},
		created() {
			const route = useRoute();
			this.selectedChatId = route.params.chatId || null;
			this.fetchConversations();
		},
		mounted() {
			document.addEventListener('click', this.handleClickOutside);
		},
		beforeUnmount() {
			document.removeEventListener('click', this.handleClickOutside);
		},
		methods: {
			async fetchConversations() {
				const convRef = collection(this.$db, 'conversations');
				const q = query(convRef, where('user_id', '==', this.userINE));
				const querySnapshot = await getDocs(q);

				const today = new Date();
				const yesterday = new Date(today);
				yesterday.setDate(today.getDate() - 1);
				const last7Days = new Date(today);
				last7Days.setDate(today.getDate() - 7);

				const conversations = [];

				querySnapshot.forEach((doc) => {
					const data = doc.data();
					data.id = doc.id;
					data.last_used = new Date(data.last_used.seconds * 1000);
					conversations.push(data);
				});

				console.log('Conversations :', conversations);

				// Initialiser les listes
				this.todayChats = [];
				this.yesterdayChats = [];
				this.last7DaysChats = [];
				this.olderChats = [];

				// Filtrer et trier les discussions
				conversations.forEach((chat) => {
					const chatDate = chat.last_used;

					if (this.isSameDay(chatDate, today)) {
						this.todayChats.push(chat);
					} else if (this.isSameDay(chatDate, yesterday)) {
						this.yesterdayChats.push(chat);
					} else if (chatDate > last7Days && chatDate < yesterday) {
						this.last7DaysChats.push(chat);
					} else {
						this.olderChats.push(chat);
					}
				});

				// Trier les discussions par ordre de last_used
				this.todayChats.sort((a, b) => b.last_used - a.last_used);
				this.yesterdayChats.sort((a, b) => b.last_used - a.last_used);
				this.last7DaysChats.sort((a, b) => b.last_used - a.last_used);
				this.olderChats.sort((a, b) => b.last_used - a.last_used);

				console.log('Today :', this.todayChats);
				console.log('Yesterday :', this.yesterdayChats);
				console.log('Last 7 days :', this.last7DaysChats);
				console.log('Older :', this.olderChats);
			},
			isSameDay(d1, d2) {
				return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
			},
			async createNewChat() {
				const convRef = collection(this.$db, 'conversations');
				const q = query(convRef, where('user_id', '==', this.userINE));
				const querySnapshot = await getDocs(q);

				// Trouver les discussions existantes avec des noms commençant par "Discussion"
				const discussionNumbers = querySnapshot.docs
					.map((doc) => doc.data().name)
					.map((name) => name.trim())
					.filter((name) => name.startsWith('Discussion'))
					.map((name) => parseInt(name.replace('Discussion ', '')))
					.filter((num) => !isNaN(num));

				// Trouver le numéro suivant disponible
				let newNumber = 1;
				while (discussionNumbers.includes(newNumber)) {
					newNumber++;
				}

				const newChat = {
					name: `Discussion ${newNumber}`,
					user_id: this.userINE,
					created_at: serverTimestamp(),
					last_used: serverTimestamp(),
				};

				const docRef = await addDoc(convRef, newChat);

				// Ajoute la nouvelle discussion à l'état local
				this.addChatToLocalState({ id: docRef.id, ...newChat, last_used: new Date() });

				this.selectedChatId = docRef.id;
				this.$router.push({ path: `/chat/${docRef.id}` });
			},
			addChatToLocalState(chat) {
				const today = new Date();
				const yesterday = new Date(today);
				yesterday.setDate(today.getDate() - 1);
				const last7Days = new Date(today);
				last7Days.setDate(today.getDate() - 7);

				const chatDate = chat.last_used;

				if (this.isSameDay(chatDate, today)) {
					this.todayChats.push(chat);
					// Trier les discussions de aujourd'hui par ordre de last_used
					this.todayChats.sort((a, b) => b.last_used - a.last_used);
				} else if (this.isSameDay(chatDate, yesterday)) {
					this.yesterdayChats.push(chat);
					// Trier les discussions de hier par ordre de last_used
					this.yesterdayChats.sort((a, b) => b.last_used - a.last_used);
				} else if (chatDate > last7Days && chatDate <= yesterday) {
					this.last7DaysChats.push(chat);
					// Trier les discussions des 7 derniers jours par ordre de last_used
					this.last7DaysChats.sort((a, b) => b.last_used - a.last_used);
				} else {
					this.olderChats.push(chat);
					// Trier les anciennes discussions par ordre de last_used
					this.olderChats.sort((a, b) => b.last_used - a.last_used);
				}
			},
			selectChat(chat) {
				this.selectedChatId = chat.id;
				this.$emit('selectChat', chat); // Emettre un événement pour informer le parent
				this.$router.push({ path: `/chat/${chat.id}` });
			},
			logout() {
				localStorage.removeItem('user'); // Supprime les informations de l'utilisateur du localStorage
				this.$router.push('/'); // Redirige vers la page de connexion
			},
			showOptions(chat, event) {
				this.selectedChatForOptions = chat;
				this.showChatOptions = true;
				const rect = event.currentTarget.getBoundingClientRect();
				this.optionsPosition = {
					top: rect.top + window.scrollY + 43,
					left: rect.left + window.scrollX - 167,
				};
			},
			handleClickOutside(event) {
				if (this.showChatOptions) {
					this.showChatOptions = false;
				}
			},
			renameChat(chat) {
				this.editingChatId = chat.id;
				this.newChatName = chat.name;
				this.showChatOptions = false;
			},
			async confirmRename(chat) {
				if (this.newChatName.trim() !== '') {
					const chatRef = doc(this.$db, 'conversations', chat.id);
					await updateDoc(chatRef, { name: this.newChatName });
					chat.name = this.newChatName;
					this.editingChatId = null;
					this.newChatName = '';
				}
			},
			async deleteChat(chat) {
				const chatRef = doc(this.$db, 'conversations', chat.id);
				await deleteDoc(chatRef);
				this.removeChatFromLocalState(chat);
				this.showChatOptions = false; // Ferme le menu contextuel
			},
			removeChatFromLocalState(chat) {
				const removeChatById = (chats) => chats.filter((c) => c.id !== chat.id);

				this.todayChats = removeChatById(this.todayChats);
				this.yesterdayChats = removeChatById(this.yesterdayChats);
				this.last7DaysChats = removeChatById(this.last7DaysChats);
				this.olderChats = removeChatById(this.olderChats);

				// Réinitialiser selectedChatId si le chat supprimé est le chat sélectionné
				if (this.selectedChatId === chat.id) {
					this.selectedChatId = null;
					this.$router.push({ path: '/chat' }); // Redirige vers la liste de chats si le chat supprimé était sélectionné
				}
			},
		},
	};
</script>

<style scoped>
	.sidebar {
		width: 260px;
		min-width: 260px;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.sidebar-header {
		height: 100px;
		display: flex;
		align-items: center;
	}
	.logo {
		height: 35px;
		width: 35px;
		margin-left: 35px;
	}
	.title {
		color: #ffffff;
		font-size: 1.2rem;
		font-weight: bold;
		margin-left: 15px;
	}
	.new-chat-btn {
		height: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 20px;
		margin-bottom: 30px;
		padding: 12px 0;
		background: #5eacdc;
		border-radius: 12px;
		font-weight: 500;
		cursor: pointer;
	}
	.new-chat-btn:hover {
		opacity: 0.95;
	}
	.chat-list {
		flex: 1;
		overflow-y: auto;
	}
	.no-history {
		font-size: 12px;
		text-align: center;
		margin: 0 20px;
	}
	.chat-list-separator {
		display: flex;
		align-items: center;
		height: 40px;
		margin: 0 15px;
	}
	.separator {
		border-bottom: 1px solid #424a4c;
		width: 100%;
	}
	.separator-text {
		margin: 0 15px;
		font-size: 14px;
		font-weight: 300;
		white-space: nowrap;
	}
	.chat-item {
		background-color: transparent;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 10px;
		margin-bottom: 10px;
		padding: 12px 0;
		height: 24px;
		border-radius: 12px;
		cursor: pointer;
		position: relative;
	}
	.chat-item:hover {
		background-color: #2b2e2f;
	}
	.chat-item.active {
		background-color: #2b2e2f;
	}
	.chat-item img {
		margin-left: 15px;
		margin-right: 10px;
	}
	.chat-item span {
		flex-grow: 1;
		font-size: 0.85rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.chat-item-option {
		margin-left: 0px;
		margin-right: 15px;
	}
	.rename {
		background-color: transparent;
		color: white;
		width: 130px;
		flex-grow: 1;
		border-radius: 5px;
		border-style: double;
		font-size: 0.95rem;
		padding: 3px;
	}
	.footer {
		margin: 20px 0;
	}
	.logout-btn {
		height: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 20px;
		padding: 12px 0;
		background: transparent;
		border: solid 1.5px #e08686;
		border-radius: 12px;
		font-weight: 500;
		cursor: pointer;
	}
	.logout-btn:hover {
		opacity: 0.95;
		background-color: #e08686;
	}
</style>
