
var FILENAME = '';

function pass() {}

function onImport() {
    var fileList = document.forms["file-form"]["file-input"].files;
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
                        z.hit_list = [];
                        the_vue.Zs.push(z);
                        // console.log(the_vue.Zs[the_vue.Zs.length-1].text);
                    }
                });
            };
        }
    }
}

// const GBK_Decoder = new TextDecoder("GBK");

function onImportTriggerRule() {
    var fileList = document.forms["file-form"]["trigger-input"].files;
    // console.log(fileList);
    for (let i=0;i<fileList.length;i++) {
        let file = fileList[i];
        if (file) {
            console.log(file);
            FILENAME = file.name;
            var reader = new FileReader();
            reader.readAsText(file, "GBK");
            reader.onload = function(evt) {
                // console.log(this.result);
                // let this_result = GBK_Decoder.decode(this.result)
                // console.log(this_result);
                var triggers = this.result.split("\n")
                for (let trigger of triggers) {
                    let trigger_rule = ["", "", "", "", ""];
                    trigger = `${trigger.replace(/^(,+)/g, '')}`;
                    if (!trigger || trigger[0]=="#") {} else {
                        let tgs = trigger.split(",");
                        trigger_rule[0] = tgs[0]?tgs[0]:"";
                        trigger_rule[1] = tgs[1]?tgs[1]:"";
                        trigger_rule[2] = tgs[2]?tgs[2]:"";
                        trigger_rule[3] = tgs[3]?tgs[3]:"";
                        trigger_rule[4] = tgs[4]?tgs[4]:"";
                        the_vue.trigger_rules.push(trigger_rule);
                    }
                }
            };
        }
    }

}


function triggerCheck(str, trigger_rule) {
    // console.log(trigger_rule);
    var type = trigger_rule[0].trim();
    var cue_left = trigger_rule[1].trim();
    var trigger = trigger_rule[2].trim();
    var excepter = trigger_rule[3].trim();
    var cue_right = trigger_rule[4].trim();

    let excepting, resulted, result;

    if (type) {
        if (!str.search(excepter)) {
            let ptn, situation, rst;
            if (cue_left && trigger) {
                ptn = `(${cue_left})[^(${trigger})]*(${trigger})`;
                situation = "命中";
            } else if (trigger && cue_right) {
                ptn = `(${trigger})[^(${cue_right})]*(${cue_right})`;
                situation = "命中";
            } else if (trigger) {
                ptn = `(${trigger})`;
                situation = "命中";
            } else if (cue_left || cue_right) {
                ptn = `(${cue_left?cue_left:cue_right})`;
                situation = "疑似";
            }
            rst = str.match(ptn)||[false];
            result = {situation: rst[0]?situation:"无果", type: type, evidence: rst[0], rule: trigger_rule};
        } else {
            result = {situation: "排除", type: type, evidence: excepter, rule: trigger_rule};
        }
    }

    return result
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
        trigger_rules: [],
        selected_class: "【Any】",
        selected_type: "【Any】",
        selected_role: "【Any】",
    },
    computed: {
        hit_list_list: function(){
            var hit_list_list = [];
            for (let zz of this.Zs) {
                let hit_list = [];
                for (let trigger_rule of this.trigger_rules) {
                    let thing = triggerCheck(zz.text, trigger_rule);
                    if (thing.situation=="命中"||thing.situation=="疑似") {
                        hit_list.push(thing);
                    }
                }
                hit_list_list.push(hit_list);
            }
            return hit_list_list;
        },
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
    props: ['Z', 'hit_list_list'],
    template: `
        <div class="thing-item" :class="{hidden:Z.hidden}">
            <p>{{Z.order_id}}</p>
            <!--【{{Z.text}}】-->
            <div v-for="(event, j) in Z.event_list" class="thing-event" :class="{hidden:event.hidden}">
                <p><span class="type" :data-evt_class="event.class" :data-type="event.event_type" :data-evt_id="j" :data-order_id="Z.order_id">{{event.event_type}}</span></p>
                <p v-html="event.evt_html"></p>
            </div>
            <div class="thing-hit" v-if="hit_list_list[Z.order_id][0]">
                <p v-for="(hit, l) in hit_list_list[Z.order_id]">【{{hit.situation}}：{{hit.type}}】“{{hit.evidence}}”</p>
            </div>
        </div>`,
})





