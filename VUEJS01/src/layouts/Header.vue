<template lang="">
  <div class="header">
    <div class="header-infor">
      <div class="header-infor-avatar"></div>
      <div class="header-infor-name">Nguyễn Văn Mạnh</div>
      <div class="header-infor-option-icon">
        <img src="../assets/icon/option.png" />
      </div>
    </div>
    <div class="header-customer-infor">
      <div class="header-customer-infor-text">Nhà hàng Biển Đông</div>
      <div class="header-customer-infor-dropdown-icon">
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  props: {
    msg: String,
  },
};
</script>
<style>
@import url("/src/css/common/header.css");
</style>
