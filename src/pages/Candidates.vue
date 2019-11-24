<template>
  <q-page class="q-ma-lg">
    <q-item class="bg-grey-2">
        <q-item-section>
        </q-item-section>
        <q-item-section side top>
          <q-btn flat color="primary" dense icon="fas fa-plus" label="Add candidate" @click="create = true"/>
        </q-item-section>
      </q-item>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Last Name</th>
          <th class="text-left">Phone</th>
          <th class="text-left">Address</th>
          <th class="text-center">Options</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cd,index) in candidates" :key="index">
          <td class="text-left">{{cd.name}}</td>
          <td class="text-left">{{cd.last_name}}</td>
          <td class="text-left">{{cd.phone}}</td>
          <td class="text-left">{{cd.address}}</td>
          <td class="text-center">
            <q-btn class="q-mr-sm" size="sm" round color="primary" icon="fas fa-pencil-alt" @click="goTo('edit',cd)" />
            <q-btn class="q-mr-sm" size="sm" round color="secondary" icon="far fa-eye" @click="goTo('view',cd)"/>
            <q-btn size="sm" round color="red" icon="fas fa-trash" @click="remove(cd.id,index,cd.laboral_references.length)"/>
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-dialog v-model="create" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-grey-2 " style="width: 300px">
        <q-card-section>
          <div class="text-h6">Create a new candidate</div>
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            v-model="cd.name"
            label="Name"
            ref="name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type name']"
          />
          <q-input
            filled
            v-model="cd.last_name"
            label="Last Name"
            ref="last_name"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Please type last name',
            ]"
          />
          <q-input
            filled
            v-model="cd.phone"
            label="Phone"
            ref="phone"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Please type last phone'
            ]"
          />
          <q-input
            filled
            v-model="cd.address"
            label="Address"
            ref="address"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Please type last address'
            ]"
          />
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Save"  color="primary" @click="save"/>
          <q-btn flat label="Cancel"  color="red" class="q-ml-sm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions,mapMutations,mapState } from "vuex";
export default {
  name: 'PageIndex',
  data() {
    return {
      cd:{},
      create:false
    }
  },
  computed: {
    ...mapState('data',['candidates'])
  },
  methods: {
    ...mapMutations('data',['setCandidates','setCandidate','removeCandidate']),
    ...mapActions('data',['getCandidates']),
    async getData(){
      this.$q.loading.show()
      let {data} = await this.getCandidates()
      this.setCandidates(data)
      data ? this.$q.loading.hide() : null
    },
    goTo(route,data){
      this.$router.push(`/${route}/${data.id}`)
      this.setCandidate(data) 
    },
    save(){
      const error = [];
      for (let [key, obj] of Object.entries(this.$refs)) {
        obj.validate();
        if (obj.hasError) {
          error.push(obj);
        }
      }
      if (error.length > 0) {
        this.$q.notify({
          color: "negative",
          message: "Please complete fields",
          position: "top-right"
        });
      }else{
        this.$q.loading.show()
        this.$axios.post('/users',this.cd).then(({data})=>{
          let arr = [...this.candidates]
          arr.push(data)
          console.log(arr)
          this.setCandidates(arr)
          this.$q.loading.hide()
          this.create = false
        }).catch(err=>console.log(err))
      }
    },
    remove(id,index,n){
      this.$q.dialog({
        title: 'Are you sure?',
        message:  n > 0 ?`This candidate has ${n} job references. To remove it, first remove the references.`:'this item will be deleted',
        cancel: {
          flat: true,
          color: 'primary'
        },
        ok:{
          flat:true,
          color:'red'
        }
      }).onOk(() => {
        this.$q.loading.show()
        this.$axios.delete(`/users/${id}`).then((res=>{
          console.log(res)
          this.removeCandidate(index)
          this.$q.loading.hide()
        })).catch(err=>console.log(err))
      }).onCancel(() => {
        console.log('Cancel')
      })
    }
  },
  mounted() {
    
  },
  created() {
    this.getData()
  },
}
</script>
