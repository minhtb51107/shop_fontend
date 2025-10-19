<template>
  <v-footer app padless class="mt-10">
    <v-card flat tile width="100%" class="text-center" color="grey-lighten-3">
       <v-card-text>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4"
          icon
          variant="text"
        >
          <v-icon size="24px">{{ icon }}</v-icon>
        </v-btn>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="text-grey-darken-1">
        {{ new Date().getFullYear() }} — <strong>Shop Điện Tử Vueify</strong> - Phát triển bởi Gemini
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script setup>
import { ref } from 'vue';

const icons = ref([
  'mdi-facebook',
  'mdi-twitter',
  'mdi-linkedin',
  'mdi-instagram',
]);
</script>

<style scoped>
/* CSS cho Footer (nếu cần) */
</style>