<template>
  <section class="section">
    <div class="container">
      <p class="mb-2">Sort the proposals of this poll into your personally preferred order.</p>
			<div class="card">
				<header class="card-header">
					<p class="card-header-title">
						No sports in the morning
					</p>
				</header>
				<div class="card-content">
					<div class="content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Phasellus nec iaculis mauris. <a>@bulmaio</a>.
					</div>
				</div>
				<div class="prop-footer level is-mobile">
					<div class="level-left">
						<div class="level-item">
							<img src="img/avatars/Avatar1.png" class="avatar"/>
							<div>
							<b-icon pack="far" icon="user" size="is-small"/> User Name <br/>
							<b-icon pack="far" icon="clock" size="is-small"/> yesterday
							</div>
						</div>
					</div>
					<div class="level-left">
						<div class="level-item">
							Middle
						</div>
					</div>
					<div class="level-left">
						<div class="level-item">
							Right
						</div>
					</div>
				</div>
			</div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Index",
  components: {},
  mixins: [],
  data() {
    return {}
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
.card-header {
	box-shadow: none;
	background-color: #f3f3f3;;
	
}
.card-header-title {
	padding: 0.2rem 0.5rem;
}
.card-content {
	padding: 0;
}
.card-content .content {
	padding: 0.5rem;
}
.avatar {
	margin-right: 0.25rem;
}
.prop-footer {
	color: grey;
	font-size: 12px;
	background-color: #f3f3f3;
	width: 100%;
	padding: 3px 0.5rem;
}
</style>
