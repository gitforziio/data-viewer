
var FILENAME = '';

function pass() {}

function onImport() {
    const fileList = document.forms["file-form"]["file-input"].files;
    // console.log(fileList);
    for (let i=0;i<fileList.length;i++) {
        let file = fileList[i];
        if (file) {
            console.log(file);
            FILENAME = file.name;
            var reader = new FileReader();
            reader.readAsText(file, "utf-8");
            reader.onload = function(evt) {
                // d3.select("#xml").html(this.result);
                // the_vue.Ss = xml2data();
                Zs_list = this.result.split("\n")
                the_vue.Zs = []
                Zs_list.forEach((d,i) => {
                    if (d) {
                        z = mark(JSON.parse(d));
                        z.order_id = i;
                        z.hidden = false;
                        the_vue.Zs.push(z);
                        // console.log(the_vue.Zs[the_vue.Zs.length-1].text);
                    }
                });
            };
        }
    }


    // var event_classes = new Set();
    // // let nodes = d3.selectAll(`span[data-evt_class]`).nodes();
    // for (let zz of the_vue.Zs) {
    //     for (let event of zz.event_list){
    //         let vl = event.class;
    //         event_classes.add(vl);
    //     }
    // }
    // var event_classes_html = `<option>【不选】</option>`;
    // for (let event_class in event_classes) {
    //     event_classes_html+=`<option>${event_class}</option>`;
    // }
    // console.log(event_classes);
    // console.log(event_classes_html);
    // d3.select("#task-select").html(event_classes_html);

}

function mark(item) {
    var result = item;
    var text = item.text;
    var evts = item.event_list;
    evts.forEach((evt, i) => {
        let evt_html_lst = text.split("");
        evt_html_lst[evt.trigger_start_index] = `<span class="trigger">`+evt_html_lst[evt.trigger_start_index];
        evt_html_lst[evt.trigger_start_index+evt.trigger.length-1] += `</span>`;
        let roles = evt.arguments;
        roles.sort(function(a,b){return a.argument.length-b.argument.length});
        roles.forEach((arg, j) => {
            evt_html_lst[arg.argument_start_index] = `<span class="argument" data-role="${arg.role}">`+evt_html_lst[arg.argument_start_index];
            evt_html_lst[arg.argument_start_index+arg.argument.length-1] += `</span>`;
        });
        result.event_list[i].evt_html = evt_html_lst.join("");
        result.event_list[i].hidden = false;
    });
    return result;
}

var the_vue = new Vue({
    el: '#bodywrap',
    data: {
        Zs: [],
        selected_class: "【Any】",
        selected_type: "【Any】",
        selected_role: "【Any】",
    },
    computed: {
        event_classes: function(){
            var event_classes = new Set();
            event_classes.add("【Any】");
            for (let zz of this.Zs) {
                for (let event of zz.event_list){
                    let vl = event.class;
                    event_classes.add(vl);
                }
            }
            return event_classes;
        },
        event_types: function(){
            var event_types = new Set();
            event_types.add("【Any】");
            var len = this.selected_class.length;
            for (let zz of this.Zs) {
                for (let event of zz.event_list){
                    if (event.class == this.selected_class) {
                        event_types.add(event.event_type);
                    }
                }
            }
            return event_types;
        },
        event_roles: function(){
            var event_roles = new Set();
            event_roles.add("【Any】");
            for (let zz of this.Zs) {
                for (let event of zz.event_list){
                    if (event.event_type == this.selected_type || ("【Any】" == this.selected_type && event.class == this.selected_class)) {
                        for (let argument of event.arguments) {
                            event_roles.add(argument.role);
                        }
                    }
                }
            }
            return event_roles;
        },
    },
    methods: {
        toggle_btn: function(evt) {
        }
    },
    // created: function() {
    //     console.log("`the_vue` created");
    // },
})





Vue.component('the_data', {
    props: ['Z'],
    template: `
        <div class="thing-item" :class="{hidden:Z.hidden}">
            <p>{{Z.order_id}}</p>
            <div v-for="(event,j) in Z.event_list" class="thing-event" :class="{hidden:event.hidden}">
                <p><span class="type" :data-evt_class="event.class" :data-type="event.event_type" :data-evt_id="j" :data-order_id="Z.order_id">{{event.event_type}}</span></p>
                <p v-html="event.evt_html"></p>
            </div>
        </div>`,
})





















// Vue.component('sentence-control', {
//     props: ['S'],
//     template: `
//         <div class="container card-wrap" :id="'card-' + S.sortID">
//             <div class="row">
//                 <div class="col-12 col-md-6 col-lg-5 xml-area-wrap"><div class="container">
//                     <div class="row" :class="{hidden:!S.editing}">
//                         <div class="col-12">
//                             <textarea class="form-control textarea-editing" v-model="S.code" rows="3"></textarea>
//                         </div>
//                         <div class="col-3">
//                             <input class="form-control form-control-sm" type="text" v-model="S.sortID">
//                         </div>
//                         <div class="col-5 btn_stc_wrap">
//                             <button type="button" class="btn btn-sm btn-danger btn_stc_confirm" v-on:click="S.editing=false">确认</button>
//                         </div>
//                         <div class="col-4 btn_stc_wrap mr-auto">
//                             <button type="button" class="btn btn-sm btn_stc_confirm" :class="[S.annotated ? 'btn-light' : 'btn-danger']"" v-on:click="S.annotated=(1-S.annotated)">{{ S.annotated ? '已标' : '未标' }}</button>
//                         </div>
//                     </div>
//                     <div class="row" :class="{hidden:S.editing}">
//                         <div class="col-12">
//                             <div class="xml-wrap" :id="S.wrapID" v-html="S.outerXML()"></div>
//                         </div>
//                         <div class="col-3">
//                             <input class="form-control form-control-sm" type="text" v-model="S.sortID">
//                         </div>
//                         <div class="col-5 btn_stc_wrap">
//                             <button type="button" class="btn btn-sm btn-info btn_stc_edit" v-on:click="S.editing=true">重切</button>
//                         </div>
//                         <div class="col-4 btn_stc_wrap mr-auto">
//                             <button type="button" class="btn btn-sm btn_stc_confirm btn_stc_confirm_1" :class="[S.annotated ? 'btn-light' : 'btn-danger']"" v-on:click="S.annotated=(1-S.annotated)">{{ S.annotated ? '已标' : '未标' }}</button>
//                         </div>
//                     </div>
//                 </div></div>
//                 <div class="col-12 col-md-6 col-lg-7"><div class="container">
//                     <div class="row cxn-ctrol" :data-s="S.id" :data-c="cxn.sortID" v-for="(cxn,i) in S.cxns" :class="{selected:cxn.selected}">
//                         <div class="col col-12">
//                             <div class="custom-control custom-checkbox">
//                                 <input type="checkbox" class="custom-control-input cxn-checkbox" v-model="cxn.selected" :id="'select-'+S.sortID+'-'+cxn.sortID">
//                                 <label class="custom-control-label" :for="'select-'+S.sortID+'-'+cxn.sortID" v-html="S.cxn_XMLs()[i]">{{  }}</label>
//                             </div>
//                         </div>
//                         <div class="col col-6 col-lg-4">
//                             <select class="custom-select custom-select-sm select-type" data-task="类型" :class="{'is-invalid':cxn.empty_type()}" v-model="cxn.type">
//                                 <option disabled value="">【类型】</option>
//                                 <option>主观情感类构式</option>
//                                 <option>缺省</option>
//                             </select>
//                         </div>
//                         <div class="col col-6 col-lg-4">
//                             <select class="custom-select custom-select-sm select-evaluation" data-task="评价" :class="{'is-invalid':cxn.empty_evaluation()}" v-model="cxn.evaluation">
//                                 <option disabled value="">【评价】</option>
//                                 <option>负面</option>
//                                 <option>正面</option>
//                                 <option>中立</option>
//                                 <option>缺省</option>
//                             </select>
//                         </div>
//                         <div class="col col-6 col-lg-4">
//                             <select class="custom-select custom-select-sm select-standpoint" data-task="立场" :class="{'is-invalid':cxn.empty_standpoint()}" v-model="cxn.standpoint">
//                                 <option disabled value="">【立场】</option>
//                                 <option>拒绝</option>
//                                 <option>接受</option>
//                                 <option>不置可否</option>
//                                 <option>缺省</option>
//                             </select>
//                         </div>
//                         <div class="col col-6 col-lg-4">
//                             <select class="custom-select custom-select-sm select-intensity" data-task="强度" :class="{'is-invalid':cxn.empty_intensity()}" v-model="cxn.intensity">
//                                 <option disabled value="">【强度】</option>
//                                 <option>极</option>
//                                 <option>很</option>
//                                 <option>不很</option>
//                                 <option>缺省</option>
//                             </select>
//                         </div>
//                         <div class="col col-6 col-lg-4">
//                             <select class="custom-select custom-select-sm select-emotion" data-task="情感" :class="{'is-invalid':cxn.empty_emotion()}" v-model="cxn.emotion">
//                                 <option disabled value="">【情感】</option>
//                                 <option>喜欢</option>
//                                 <option>愤怒</option>
//                                 <option>恐惧</option>
//                                 <option>悲伤</option>
//                                 <option>厌恶</option>
//                                 <option>爱慕</option>
//                                 <option>自定义</option>
//                                 <option>缺省</option>
//                             </select>
//                         </div>
//                         <div class="col col-6 col-lg-4">
//                             <input class="form-control form-control-sm" :class="{'is-invalid':cxn.empty_custom_emotion()}" type="text" v-model="cxn.custom_emotion" v-bind:disabled="cxn.emotion!='自定义'">
//                         </div>
//                     </div>
//                 </div></div>
//             </div>
//         </div>`,
// })














// function cxns2attrs(cxns) {
//     let cxn_attrs = [];
//     cxns.forEach((cxn,i) => {
//         let attrs = {};
//         attrs.type = cxn.type=="缺省" ? null : cxn.type;
//         attrs.evaluation = cxn.evaluation=="缺省" ? null : cxn.evaluation;
//         attrs.standpoint = cxn.standpoint=="缺省" ? null : cxn.standpoint;
//         attrs.intensity = cxn.intensity=="缺省" ? null : cxn.intensity;
//         attrs.emotion = cxn.emotion=="缺省" ? null : cxn.emotion;

//         attrs.custom_emotion = (attrs.emotion!="自定义") ? attrs.emotion : cxn.custom_emotion;

//         attrs.sortID = cxn.sortID;
//         cxn_attrs.push(attrs);
//     });
//     return cxn_attrs;
// }

// function xml2data() {
//     var data=[];
//     d3.selectAll("#xml sentence").each(function(p, j) {

//         let cxns = [];
//         let cxn_attrs = [];
//         d3.select(this).selectAll("cxn").each(function(q, i) {
//             let cxn = {};
//             cxn.text = this.innerText;
//             cxn.initlXML = this.outerHTML;
//             cxn.code = xml2code(this.innerHTML);

//             cxn.type = this.attributes.type ? this.attributes.type.value : "缺省";
//             cxn.evaluation = this.attributes.evaluation ? this.attributes.evaluation.value : "缺省";
//             cxn.standpoint = this.attributes.standpoint ? this.attributes.standpoint.value : "缺省";
//             cxn.intensity = this.attributes.intensity ? this.attributes.intensity.value : "缺省";
//             cxn.emotion = this.attributes.emotion ? this.attributes.emotion.value : "缺省";
//             cxn.emotion = this.attributes.emotion ? this.attributes.emotion.value : "缺省";
//             cxn.custom_emotion = this.attributes["custom-emotion"] ? this.attributes["custom-emotion"].value : "";

//             cxn.empty_type = function() {return cxn.type=="缺省" ? true : false;};
//             cxn.empty_evaluation = function() {return cxn.evaluation=="缺省" ? true : false;};
//             cxn.empty_standpoint = function() {return cxn.standpoint=="缺省" ? true : false;};
//             cxn.empty_intensity = function() {return cxn.intensity=="缺省" ? true : false;};
//             cxn.empty_emotion = function() {return cxn.emotion=="缺省" ? true : false;};
//             cxn.empty_custom_emotion = function() {return (cxn.emotion=="自定义"&&cxn.custom_emotion=="") ? true : false;};

//             cxn.sortID = i;
//             cxn.selected = false;
//             cxns.push(cxn);
//         });

//         let d = {};
//         d.id = j;
//         d.sortID = j*10;
//         d.wrapID = 'xml-wrap-' + d.sortID;
//         d.annotated = +(this.attributes.annotated ? this.attributes.annotated.value:0);
//         d.text = this.innerText;

//         d.code = xml2code(this.innerHTML);
//         d.outerXML = function(){return makeXML(this);};
//         d.cxns = cxns;
//         d.cxn_XMLs = function(){return makeCxnXMLs(this);};
//         d.cxn_attrs = function(){return cxns2attrs(this.cxns);};

//         d.editing = false;
//         data.push(d);
//     });

//     return data;
// }

// function makeCxnXMLs(that) {
//     let ee = document.createElement('div');
//     ee.innerHTML = that.outerXML();
//     // console.log(ee);
//     let cxn_XMLs = [];
//     d3.select(ee).selectAll("cxn").each(function(q, j) {
//         // console.log(this);
//         cxn_XMLs.push(this.outerHTML);
//     });
//     // console.log(cxn_XMLs);
//     return cxn_XMLs;
// }

// function makeXML(that) {
//     let initlXML = code2xml(that);
//     let ee = document.createElement('div');
//     ee.innerHTML = initlXML;
//     // let e = that.wrapID+"-init";
//     let cxn_attrs = that.cxn_attrs();
//     d3.select(ee).selectAll("cxn").each(function(q, j) {
//         for (var i = cxn_attrs.length - 1; i >= 0; i--) {
//             let attrs = cxn_attrs[i];
//             if(i==j){
//                 d3.select(this)
//                     .attr("type", attrs.type)
//                     .attr("evaluation", attrs.evaluation)
//                     .attr("standpoint", attrs.standpoint)
//                     .attr("intensity", attrs.intensity)
//                     .attr("emotion", attrs.emotion)
//                     .attr("custom-emotion", attrs.custom_emotion)
//                     ;
//             }
//         }
//     });
//     return ee.innerHTML;
// }

// function xml2code(x) {
//     x = x.trim()
//             .replace(/【/g,'『左块括』')
//             .replace(/】/g,'『右块括』')
//             .replace(/『/g,'『左角刮』')
//             .replace(/』/g,'『右角刮』')
//             .replace(/「/g,'『左角括』')
//             .replace(/」/g,'『右角括』')
//             .replace(/《/g,'『左书名』')
//             .replace(/》/g,'『右书名』')
//             .replace(/(<cxn[^>]*>)/g,'【')
//             .replace(/(<\/cxn>)/g,'】')
//             .replace(/(<constant>)/g,'《')
//             .replace(/(<\/constant>)/g,'》')
//             .replace(/(<variable>)/g,'「')
//             .replace(/(<\/variable>)/g,'」')
//             // .replace(/(<other>)/g,'『')
//             // .replace(/(<\/other>)/g,'』')
//             .trim();
//     return x;
// }

// function code2xml(that) {
//     let x = that.code.trim()
//             .replace(/『左角刮』/g,'『')
//             .replace(/『右角刮』/g,'』')
//             .replace(/【/g,'<cxn>')
//             .replace(/】/g,'</cxn>')
//             .replace(/《/g,'<constant>')
//             .replace(/》/g,'</constant>')
//             .replace(/「/g,'<variable>')
//             .replace(/」/g,'</variable>')
//             // .replace(/『/g,'<other>')
//             // .replace(/』/g,'</other>')
//             .replace(/『左块括』/g,'【')
//             .replace(/『右块括』/g,'】')
//             .replace(/『左书名』/g,'《')
//             .replace(/『右书名』/g,'》')
//             .replace(/『左角括』/g,'「')
//             .replace(/『右角括』/g,'」')
//             .trim();
//     // return x;
//     let outerXML = "<sentence annotated='"+that.annotated+"'>"+x+"</sentence>";
//     return outerXML;
// }





