<template>
  <section class="section">
    <div class="container">
      <div class="chat-left box">
        <p>
          Hello! Welcome to <span class="liquido" /> the free mobile eVoting
          platform.
        </p>
        <p />
        <p>
          Do you want to <em>create a new team</em> or
          <em>join an existing one</em> with an invitation code?
        </p>
      </div>

      <div class="columns is-mobile chat-left">
        <div class="column">
          <b-button type="is-primary">Create new team</b-button>
        </div>
        <div class="column has-text-right">
          <b-button type="is-primary">Join team</b-button>
        </div>
      </div>

      <div class="chat-right">
        <p class="control has-icons-left">
          <input id="username" class="input" placeholder="Nickname"></input>
          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </p>
      </div>
      <div class="has-text-right chat-button">
        <b-button type="is-primary">Ok</b-button>
      </div>

      <div class="chat-left box">
        Hey {{ username }}! Nice to meet you. What topic do you want to vote on?
      </div>
      <div class="chat-right">
        <p class="control has-icons-left">
          <input id="poll-title" class="input" placeholder="Poll title" >
          <span class="icon is-small is-left">
            <i class="fas fa-balance-scale" />
          </span>
        </p>
      </div>

      <div class="chat-left box">
        <div class="columns is-variable is-1 is-mobile">
          <div class="column">
            <p>
              Ok. Now invite your friends so that they can join this poll.
              <a :href="inviteLink">Share this link</a> or let them scan the QR
              code.
            </p>
          </div>
          <div class="column is-narrow">
            <img :src="qrCode" width="120" height="120">
          </div>
        </div>
      </div>

      <!-- div>
				<div class="level is-mobile">
					<div class="level-item">
						<div>
							
						</div>
					</div>
					<div class="level-item">
						<img :src="qrCode" width="100" height="100"/>
					</div>
				</div>
			</div -->

      <b-button
        type="is-primary"
        icon-pack="fas"
        icon-right="angle-double-right"
        class="is-pulled-right chat-button"
      >
        Go to poll
      </b-button>
    </div>
  </section>
</template>

<script>
export default {
  name: "Welcome",
  components: {},
  data() {
    return {
      username: "Lisa",
      inviteLink: "http://liquido.me/invite/A3F43D",
      qrCode: "/img/qrcode.svg",
    }
  },
  created() {},
  mounted() {
    document.getElementById("username").focus()
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
.chat-left {
  margin-right: 3rem;
}
.chat-right {
  margin-left: 3rem;
  margin-right: 10px; // for scrollbar
}
.chat-button {
  margin-right: 10px;
  margin-bottom: 1.5rem;
}
.control {
  margin-bottom: 1.5rem;
}
.input {
  background-color: rgb(215, 222, 235);
}
.control.has-icons-left .icon {
  color: rgb(54, 54, 54);
}
</style>
