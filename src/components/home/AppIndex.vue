<template>
    <div>
d(・ω・d) 微分！

(∫・ω・)∫ 积分！

∂(・ω・∂) 偏微分！

(∮・ω・)∮ 沿闭曲线的积分！

(∬・ω・)∬ 重积分！

∇(・ω・∇)梯度！

∇・(・ω・∇・)散度！

∇×(・ω・∇×)旋度！

Δ(・ω・Δ)拉普拉斯！
    </div>
</template>

<script>
  export default {
    name: 'AppIndex',
    created(){
      if(this.$store.state.first_login){
        this.$router.replace('/user/changepasswd')
      }
    }
  }
</script>
