<template>
    <div class="q-ma-md">
      <q-card class="q-pa-xs">
      <q-item class="shadow-line">
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar1.jpg">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{`${cd.name} ${cd.last_name}`}}</q-item-label>
          <q-item-label caption>Full Name</q-item-label>
        </q-item-section>
        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-grey-8">{{cd.phone}}</span>
          </q-item-label>
          <q-item-label caption lines="1">
            Phone
          </q-item-label>
        </q-item-section>
        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-grey-8">{{cd.address}}</span>
          </q-item-label>
          <q-item-label caption lines="1">
            Address
          </q-item-label>
        </q-item-section>
        <q-item-section side>
           <q-btn color="primary" icon="fas fa-plus-circle" label="Add Reference" @click="create"/>
        </q-item-section>
      </q-item>

      <div class="q-ma-md" v-if="cd.laboral_references.length">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Company Name</th>
              <th class="text-left">Contact Name</th>
              <th class="text-left">Start At</th>
              <th class="text-left">Leave At</th>
              <th class="text-center">Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lr,index) in cd.laboral_references" :key="index">
              <td class="text-left">{{lr.company_name}}</td>
              <td class="text-left">{{lr.contact_name}}</td>
              <td class="text-left">{{lr.start_at.substr(0,10)}}</td>
              <td class="text-left">{{lr.leave_at.substr(0,10)}}</td>
              <td class="text-center">
                <q-btn class="q-mr-sm" size="sm" round color="primary" icon="fas fa-pencil-alt" @click="edit(lr,index)" />
                <q-btn size="sm" round color="red" icon="fas fa-trash" @click="remove(lr.id,index)"/>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <div class="q-ma-md text-center bg-orange-5" v-if="!cd.laboral_references.length">
        <h6>no laboral references yet</h6>
      </div>
    </q-card>

     <q-dialog v-model="isModal" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-grey-2 " style="width: 300px">
        <q-card-section>
          <div class="text-h6">Create a new reference</div>
        </q-card-section>
        <q-card-section class="q-pb-none">
          <q-input
            filled
            v-model="rl.company_name"
            label="Company Name"
            ref="company_name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type name']"
          />
          <q-input
            filled
            v-model="rl.contact_name"
            label="Contact Name"
            ref="contact_name"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Please type last name',
            ]"
          />
          <q-input
            filled
            v-model="rl.start_at"
            label="Start At"
            ref="start_at"
            lazy-rules
           mask="date" :rules="[val => val && val.length > 0 || 'Please type Date',]">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="start" transition-show="scale" transition-hide="scale">
                  <q-date v-model="rl.start_at" @input="() => $refs.start.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            filled
            v-model="rl.leave_at"
            label="Leave At"
            ref="leave_at"
            lazy-rules
            mask="date" :rules="[val => val && val.length > 0 || 'Please type Date',]">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="leave" transition-show="scale" transition-hide="scale">
                  <q-date v-model="rl.leave_at" @input="() => $refs.leave.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="quote">
          <span>Click in calendar icon</span>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Save"  color="primary" @click="(save(rl.id))"/>
          <q-btn flat label="Cancel"  color="red" class="q-ml-sm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
export default {
  data() {
    return {
      cd:{},
      isNew:false,
      isModal:false,
      rl:{},
      newRl:{},
      index:0
    }
  },
  computed: {
  },
  created() {
    this.$q.loading.show()
    this.$axios.get(`/users/${this.$route.params.id}`).then(({data})=>{
      console.log(data)
      this.cd = data[0]
      this.$q.loading.hide()
    }).catch(err=>{
      console.log(err)
    })
  },
  methods: {
    create(){
      this.rl = {}
      this.isModal = true
      this.isNew = true
    },
    edit(data,i){
      this.rl = data
      this.isModal = true
      this.isNew = false
      this.index = i
    },
    save(id){
      console.log(id)
      const error = [];
      console.log(Object.entries(this.$refs))
      for (let [key, obj] of Object.entries(this.$refs)) {
        key == 'start' || key == 'leave'?null:obj.validate();
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
        if (id) {
          this.$q.loading.show()
          this.$axios.put(`/refs/${id}`,this.rl).then(({data})=>{
            //this.cd.laboral_references.splice(this.index,1)
            this.$q.loading.hide()
            this.isModal = false 
          }).catch(err=>console.log(err))
        }else{
          this.rl.user_id = this.cd.id
          this.$q.loading.show()
          this.$axios.post('/refs',this.rl).then(({data})=>{
            this.cd.laboral_references.push(data)
            this.$q.loading.hide()
            this.isModal = false
          }).catch(err=>console.log(err))
        }
      }
    },
    remove(id,i){
      this.$q.dialog({
        title: 'Are you sure?',
        message: 'this item will be deleted?',
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
        this.$axios.delete(`/refs/${id}`).then(res=>{
          this.cd.laboral_references.splice(i,1)
          this.$q.loading.hide()
        }).catch(err=>console.log(err))
      }).onCancel(() => {
        console.log('Cancel')
      })
      
    }
  },
}
</script>

<style>
.shadow-line{
  box-shadow: 0px 0px 1px 0px !important;
}
.quote{
    padding-bottom: 0px !important;
    font-size: 11px;
    color: darkgrey;
}
</style>