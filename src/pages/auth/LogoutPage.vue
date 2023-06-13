<script setup lang="ts">
import { useAuthStore } from 'stores/auth-store';
import {onMounted} from 'vue';

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.logout();
  authStore.router.push('login');
})
</script>
