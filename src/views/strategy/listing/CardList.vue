<template>
  <div style="margin-top:16px;">
    <transition-group
      tag="ul"
      @enter="enter"
      @leave="leave"
      @before-leave="beforeLeave"
      :css="false"
    >
      <li v-for="strat in strategies" :key="strat._id" class="mb-4 mt-3 mrt-card">
        <v-card>
          <v-toolbar dense flat>
            <v-toolbar-title class="mrt--header-color">{{strat.name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat icon>
              <v-icon @click.self.passive="remove(strat._id)">delete</v-icon>
            </v-btn>
          </v-toolbar>
          <mrt-card :strategy="strat"></mrt-card>
          <v-divider></v-divider>
          <v-card-actions class="mrt-cardlist--actions">
            <div class="mrt--fit lastupdated hidden-sm-and-down">
              <div class="mrt-no-wrap">Last Updated</div>
              <div class="mrt-no-wrap">{{strat.lastUpdate | date}}</div>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              :loading="strat._id === strategy._id && isLoading"
              small
              dark
              color="primary"
              :to="`/library/${strat._id}/scenario`"
            >Scenario Analysis</v-btn>
          </v-card-actions>
        </v-card>
      </li>
    </transition-group>
    <mrt-infinite-scroll v-if="!loading" @loadmore="loadmore"/>
  </div>
</template>

<script>
import mrtCard from "./Card";
import mrtInfiniteScroll from "@/components/InfiniteScroll";
import { mapState } from "vuex";

const ANIMATION_IN = "zoomIn";
const ANIMATION_OUT = "rollOut";

export default {
  name: "CardList",
  computed: {
    ...mapState("strategies", ["strategies", "loading"]),
    ...mapState("fit", ["strategy", "isLoadingStrategy"]),
    isLoading: {
      get() {
        return this.$store.state.fit.isLoadingStrategy;
      }
    }
  },
  components: {
    mrtCard,
    mrtInfiniteScroll
  },
  methods: {
    loadmore() {
      this.$store.dispatch("strategies/loadMore");
    },

    enter(el, done) {
      el.classList.add("animated", ANIMATION_IN);
      el.style.animationDuration = "0.75s";

      const handleAnimationEnd = () => {
        el.classList.remove("animated", ANIMATION_IN);
        el.removeEventListener("animationend", handleAnimationEnd);
        done();
      };
      el.addEventListener("animationend", handleAnimationEnd);
    },

    leave(el, done) {
      el.classList.add("animated", ANIMATION_OUT);
      el.style.animationDuration = ".75s";

      const handleAnimationEnd = () => {
        el.classList.remove("animated", ANIMATION_OUT);
        el.removeEventListener("animationend", handleAnimationEnd);
        done();
      };
      el.addEventListener("animationend", handleAnimationEnd);
    },

    beforeLeave(el) {
      el.style.height = 0;
      el.style.overflow = "visible";
    },

    remove(id) {
      const payload = {
        id: id
      };
      this.$store.dispatch("strategies/remove", payload);
      this.$store.commit("dictionary/removeLibrary", payload);
    }
  }
};
</script>

<style lang="less">
.mrt-no-wrap {
  white-space: nowrap;
}
.mrt--header-color {
  color: #ffffff;
  font-weight: 500;
}
.mrt--fit {
  &.lastupdated {
    color: #e3f2fd;
    font-size: 11px;
  }
}
ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  li {
    width: 100%;
  }
}
.mrt-cardlist--actions {
  margin: 0 16px;
  .v-btn + .v-btn {
    margin: 0 0 0 24px;
  }
}
.mrt-card {
  transition: all 1s;
}
</style>
