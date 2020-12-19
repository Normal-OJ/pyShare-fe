<template>
  <Fragment>
    <notifications group="notify" position="bottom left" :duration="5000">
      <template slot="body" slot-scope="props">
        <div :class="`${props.item.type} notify`" @click="props.close">
          <v-icon size="30" class="mr-2" color="white">mdi-playlist-star</v-icon>
          <div>
            <div class="text-body-1">{{ props.item.title }}</div>
            <div class="text-body-2">{{ props.item.text }}</div>
          </div>
        </div>
      </template>
    </notifications>
    <notifications group="alert" position="bottom left">
      <template slot="body" slot-scope="props">
        <div :class="`${props.item.type} alert`" @click="props.close">
          <v-icon size="30" class="mr-2" color="white">
            {{
              props.item.type === 'success'
                ? 'mdi-check-circle-outline'
                : 'mdi-alert-circle-outline'
            }}
          </v-icon>
          <div>
            <div class="text-body-1">{{ props.item.title }}</div>
          </div>
        </div>
      </template>
    </notifications>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
export default {
  components: { Fragment },
}
</script>

<style lang="scss">
%notification {
  display: flex;
  align-items: center;
  color: #fff;
  padding: 5px;
  margin: 0 20px 10px;
}
.notify {
  @extend %notification;
}
.alert {
  @extend %notification;
}
.my-info {
  background: var(--v-primary-lighten1);
  border-left: 5px solid var(--v-primary-base);
}
.my-warn {
  background: #ffb648;
  border-left-color: #f48a06;
}
.my-error {
  background: var(--v-error-lighten1);
  border-left: 5px solid var(--v-error-base);
}
.my-success {
  background: var(--v-success-lighten1);
  border-left: 5px solid var(--v-success-base);
}
</style>
