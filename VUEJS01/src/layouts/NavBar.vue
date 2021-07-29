<template>
        <div class="navbar">
        <div class="logo-page">
            <div class="toggle-icon">

            </div>
            <div class="cukcuk-logo">

            </div>
        </div>
        <div class="nav-assets">
            <div class="nav-item">
                <div class="nav-item-icon">
                    <img src="../assets/icon/dashboard.png" />
                </div>
                <div class="nav-item-text"> Tổng quan</div>
            </div>
            <div class="nav-item">
                <div class="nav-item-icon">
                    <img src="../assets/icon/report.png" />
                </div>
                <div class="nav-item-text"> Báo cáo</div>
            </div>
            <div class="nav-item">
                <div class="nav-item-icon">
                    <img src="../assets/icon/dashboard.png" />
                </div>
                <div class="nav-item-text"> Mua hàng</div>
            </div>
            <div class="nav-item" style="background-color: #019160; color: #fff; ">
                <div class="nav-item-icon">
                    <img src="../assets/icon/dic-employee.png" />
                </div>
                <div class="nav-item-text"> Danh mục nhân viên</div>
            </div>
            <div class="nav-item">
                <div class="nav-item-icon">
                    <img src="../assets/icon/setting.png" />
                </div>
                <div class="nav-item-text"> Thiết lập hệ thống</div>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    name: 'NavBar',
  props: {
    msg: String
  }
}
</script>
<style >
    @import url('/src/css/common/navbar.css');
</style>>
    