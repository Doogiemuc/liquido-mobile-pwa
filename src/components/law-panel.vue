<template>
  <div :class="{ 'no-select': readOnly }" class="box law-panel">
    <div class="media">
      <div class="media-left">
        <figure class="image">
          <img
            :src="law.createdBy.profile.picture"
            alt="avatar"
            class="avatar"
          />
        </figure>
      </div>
      <div class="media-content">
        <div class="content law-panel-content">
          <h2>{{ law.title }}</h2>
          <div class="author">
            &ndash;{{ law.createdBy.profile.name }}
            <span :class="{ supported: law.supportedByCurrentUser }"
              ><b-icon pack="fas" icon="thumbs-up" size="is-small" />{{
                law.numSupporters
              }}</span
            >
          </div>
          <!--b-button type="is-primary" icon-pack="fas" icon-right="thumbs-up" class="like-button" :class="{'read-only' : readOnly}"></b-button-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment"

export default {
  name: "LawCard",
  components: {},
  props: {
    law: { type: Object, required: true },
    readOnly: { type: Boolean, required: false, default: false },
  },
  mixins: [],
  data() {
    return {}
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {
    iconForLaw() {
      switch (this.law.status) {
        case "IDEA":
          return { pack: "far", icon: "lightbulb" }
        case "PROPOSAL":
          return { pack: "far", icon: "file-alt" }
      case "ELABORATION":
          return { pack: "far", icon: "comments" }
        case "VOTING":
          return { pack: "fas", icon: "vote-yea" }
      case "LAW":
          return { pack: "fas", icon: "balance-s cale-left" }
      case "DROPPED":
          return { pack: "far", icon: "window-close" }
        case "RETENTION":
          return { pack: "fas", icon: "temperature-low" }
      case "RETRACTED":
          return { pack: "fas", icon: "backspace" }
        default:
          return { pack: "fas", icon: "university" }
      }
    },
  },
  methods: {
    getFromNow: function(dateVal) {
      return moment(dateVal).fromNow()
    },
  },
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
$avatar_size: 64px;

.law-panel {
  height: $avatar_size;
  max-height: $avatar_size;
  min-height: $avatar_size;
  overflow: hidden;
  padding: 0;
  position: relative;
  margin-bottom: 0.5em;
  h2 {
    line-height: 20px;
    padding: 0 5px;
    font-size: 16px;
    font-weight: normal;
  }
  .media-left {
    margin: 0;
    .like-button {
      display: none;
    }
    &:hover .like-button:not(.read-only) {
      display: flex;
    }
  }
  .avatar {
    min-width: $avatar_size;
    max-width: $avatar_size;
    width: $avatar_size;
    min-height: $avatar_size;
    max-height: $avatar_size;
    height: $avatar_size;
  }
  .author {
    font-size: 12px;
    color: grey;
    position: absolute;
    background-color: white;
    padding: 3px 5px 0 5px; // need some more white pixels above to hide h2 behind
    right: 0;
    bottom: 0;
  }
  .supported {
    color: green;
  }
  .like-button {
    position: absolute;
    border-radius: 6px;
    top: 0;
    right: 0;
    padding: 0 15px;
    width: 2em;
    height: 2em;
    line-height: 1;
  }
}
</style>
