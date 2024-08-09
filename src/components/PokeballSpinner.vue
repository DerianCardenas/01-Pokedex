<template>
    <div class="container ">
        <div class="ball"></div>
    </div>
</template>
<style>
.container {
    /* background-color: #192935; */
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  width: 50vw;
  padding-left: 25%;
  height: 100vh;
  overflow: hidden;
}

.ball {
    margin: auto;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: white;
    position: relative;
    box-shadow: -20px 0 rgba(0, 0, 0, 0.1) inset;
    animation: roll 1s ease-in-out infinite;
    background: linear-gradient(
        to bottom,
        #e83e35 0%,
        #e83e35 50.5%,
        #ffffff 50.51%,
        #ffffff 100%
    );
}

.ball:after {
  content: "";
  position: absolute;
  top: calc(100px - 3px);
  left: 0;
  width: 200px;
  height: 6px;
  background: #3f3f3f;
}

.ball:before {
  content: "";
  position: absolute;
  top: 67px;
  left: 67px;
  width: 54px;
  height: 54px;
  border: solid 6px #3f3f3f;
  border-radius: 50%;
  background: white;
  z-index: 1;
  box-shadow: 0 0 15px -2px #c62828 inset;
  animation: button 3s ease infinite;
}

@-webkit-keyframes roll {
  from {
    transform: rotate(0);
  }
  90%,
  to {
    transform: rotate(720deg);
  }
}

@-webkit-keyframes button {
  from,
  50%,
  to {
    box-shadow: 0 0 15px -2px #c62828 inset;
  }

  25%,
  75% {
    box-shadow: 0 0 10px -2px #1300ea inset;
  }
}

</style>
<!-- <style scoped>
*
{
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
}

body{
  background-color: #192935;
}

.wrapper
{
    position: absolute;
    top: 50%;
    left: 50%;

   transform: translate(-50%, -50%);

}

.pokeball {
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 50% ;
  position: relative;
  overflow: hidden;
  border: 3px solid;
  animation: frames .8s  linear 0s infinite;
}

.pokeball:after{
  content: '';
  position: absolute;
  width: 60px;
  height: 30px;
  background-color: red;
  border-bottom: 4px solid;
  top: -4px
}

.pokeball:before{
  content: '';
  position: absolute;
  background-color: #fff;
  width: 10px;
  height:10px;
  border: 4px solid;
  border-radius: 50%;
  bottom: 18px;
  right: 18px;
  z-index: 1;
}

/* AnimationFrames */
@keyframes frames{
  0% {
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style> -->