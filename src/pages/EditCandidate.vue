<template>
    <div class="q-ma-md">
      <q-card class="q-pa-xs">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar1.jpg">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{`${cd.name} ${cd.last_name}`}}</q-item-label>
          <q-item-label caption>Candidate Name</q-item-label>
        </q-item-section>
      </q-item>
      <div class="q-ma-md">
        <q-form
          @submit="save(cd.id)"
          @reset="cancel"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="cd.name"
            label="Name"
            hint="Name and surname"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type name']"
          />

          <q-input
            filled
            v-model="cd.last_name"
            label="Last Name"
            lazy-rules
            :rules="[
              val => val => val && val.length > 0 || 'Please type last name',
            ]"
          />

          <q-input
            filled
            v-model="cd.phone"
            label="Phone"
            lazy-rules
            :rules="[
              val => val => val && val.length > 0 || 'Please type last phone'
            ]"
          />

          <q-input
            filled
            v-model="cd.address"
            label="Address"
            lazy-rules
            :rules="[
              val => val => val && val.length > 0 || 'Please type last address'
            ]"
          />

          <div>
            <q-btn label="Save" type="submit" color="primary"/>
            <q-btn label="Cancel" type="reset" color="red" flat class="q-ml-sm" />
          </div>
        </q-form>
      </div>
    </q-card>
    </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
export default {
  data() {
    return {
      cd:{}
    }
  },
  computed: {
    ...mapState('data',['candidate']),
    
  },
  created() {
    this.cd = {...this.candidate}
  },
  methods: {
    ...mapMutations('data',['setCandidate']),
    save(id){
      this.$q.loading.show()
      this.$axios.put(`/users/${id}`,this.cd).then(({data})=>{
        console.log(data)
        this.setCandidate(data)
        this.$q.loading.hide()
        this.$router.push('/')
      })
    },
    cancel(){
      this.$router.push('/')
    }
  },
}
</script>

<style>

</style>