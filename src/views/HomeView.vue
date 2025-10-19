<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-5 text-center elevation-2" outlined>
          <h1 class="text-h4 font-weight-bold mb-4 text-primary">Chào mừng đến với Shop Điện Tử!</h1>
          <p class="text-subtitle-1 mb-6">
            Khám phá thế giới công nghệ với những sản phẩm điện tử mới nhất và tốt nhất.
          </p>
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            height="300px"
            cover
            class="mb-6 rounded"
          ></v-img>
          <v-btn color="primary" size="large" to="/products">
            <v-icon left>mdi-shopping-outline</v-icon>
            Xem Sản Phẩm Ngay
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

     <v-row class="mt-10">
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center fill-height elevation-1" hover>
          <v-icon size="x-large" color="success" class="mb-3">mdi-truck-fast-outline</v-icon>
          <h3 class="text-h6 font-weight-medium">Giao Hàng Nhanh</h3>
          <p class="text-body-2">Miễn phí giao hàng cho đơn hàng trên 1 triệu.</p>
        </v-card>
      </v-col>
       <v-col cols="12" md="4">
        <v-card class="pa-4 text-center fill-height elevation-1" hover>
          <v-icon size="x-large" color="info" class="mb-3">mdi-shield-check-outline</v-icon>
          <h3 class="text-h6 font-weight-medium">Bảo Hành Chính Hãng</h3>
          <p class="text-body-2">Cam kết sản phẩm chất lượng, bảo hành uy tín.</p>
        </v-card>
      </v-col>
       <v-col cols="12" md="4">
        <v-card class="pa-4 text-center fill-height elevation-1" hover>
           <v-icon size="x-large" color="warning" class="mb-3">mdi-face-agent</v-icon>
          <h3 class="text-h6 font-weight-medium">Hỗ Trợ 24/7</h3>
          <p class="text-body-2">Đội ngũ tư vấn viên sẵn sàng hỗ trợ bạn.</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Không cần script gì cho trang Home đơn giản này
</script>

<style scoped>
.fill-height {
  height: 100%;
}
</style>