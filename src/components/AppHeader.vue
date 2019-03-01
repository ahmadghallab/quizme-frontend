<template>
  <div class="row side-nav">
    <div class="col-12 text-center mt-4 pr-0">
      <h4 class="circle" style="background-image: linear-gradient(50deg,#ffa600,#fbc73c);
    color: #fff;">Q</h4>
    </div>
    <div class="col align-self-end text-center mb-4 pr-0">
      <router-link :to="{name: 'user', params: {id: userId}}">
        <div class="circle">
          <svg style="width:20px;fill:#97a0bf;" viewBox="0 0 512 512" xml:space="preserve">
          	<g>
          		<g>
          			<path d="M437.02,330.98c-27.883-27.882-61.071-48.523-97.281-61.018C378.521,243.251,404,198.548,404,148
          				C404,66.393,337.607,0,256,0S108,66.393,108,148c0,50.548,25.479,95.251,64.262,121.962
          				c-36.21,12.495-69.398,33.136-97.281,61.018C26.629,379.333,0,443.62,0,512h40c0-119.103,96.897-216,216-216s216,96.897,216,216
          				h40C512,443.62,485.371,379.333,437.02,330.98z M256,256c-59.551,0-108-48.448-108-108S196.449,40,256,40
          				c59.551,0,108,48.448,108,108S315.551,256,256,256z"/>
          		</g>
          	</g>
          </svg>
        </div>
      </router-link>
    </div>
  </div>
  <!-- <nav class="navbar navbar-expand-lg navbar-light px-0">
    <div class="container px-0 bootstrap-nav">
      <a class="navbar-brand" href="#">
        Quizme
      </a>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/levels">Discover</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: 'user', params: {id: userId}}">
            <svg style="width:20px" viewBox="0 0 512 512" xml:space="preserve">
            	<g>
            		<g>
            			<path d="M437.02,330.98c-27.883-27.882-61.071-48.523-97.281-61.018C378.521,243.251,404,198.548,404,148
            				C404,66.393,337.607,0,256,0S108,66.393,108,148c0,50.548,25.479,95.251,64.262,121.962
            				c-36.21,12.495-69.398,33.136-97.281,61.018C26.629,379.333,0,443.62,0,512h40c0-119.103,96.897-216,216-216s216,96.897,216,216
            				h40C512,443.62,485.371,379.333,437.02,330.98z M256,256c-59.551,0-108-48.448-108-108S196.449,40,256,40
            				c59.551,0,108,48.448,108,108S315.551,256,256,256z"/>
            		</g>
            	</g>
            </svg>
          </router-link>
        </li>
      </ul>
    </div>
  </nav> -->
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['userId'])
    }
  }
</script>
