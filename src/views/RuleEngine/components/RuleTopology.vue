<template>
  <div class="app-wrapper">
    <div id="rule-topology"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { getRules, getBridgeList } from "@/api/ruleengine";
import G6 from "@antv/g6";

export default defineComponent({
  props: {},
  setup() {
    const ruleList = ref([]);
    const bridgeList = ref([]);
    const fromList = ref([]);
    const toList = ref([]);
    const rulesList = ref([]);
    const input2Rule = ref([]);
    const rule2output = ref([]);

    const getRequiredList = async () => {
      const result = await Promise.all([getRules(), getBridgeList()]).catch(
        () => {}
      );
      if (result) {
        ruleList.value = result[0];
        bridgeList.value = result[1];
        ruleList.value.forEach((v) => {
          if (v.from instanceof Array) {
            v.from.forEach((from) => {
              input2Rule.value.push({ source: from, target: v.name });
              fromList.value.push({ id: from, label: from });
            });
          } else {
            input2Rule.value.push({ source: v.from, target: v.name });
            fromList.value.push({ id: v.from, label: v.from });
          }
        });
        // from.value.filter((v, i, a) => a.indexOf(v) === i);
        ruleList.value.forEach((v) => {
          if (v.outputs instanceof Array) {
            v.outputs.forEach((output) => {
              rule2output.value.push({ source: v.name, target: output });
              toList.value.push({ id: output, label: output });
            });
          } else {
            rule2output.value.push({ source: v.name, target: v.outputs });
            toList.value.push({ id: v.outputs, label: v.outputs });
          }
        });
        // to.value.filter((v, i, a) => a.indexOf(v) === i);

        rulesList.value = ruleList.value.map((v) => {
          return { id: v.name, label: v.name };
        });
      }
    };

    const initialG6 = () => {
      const container = document.getElementById("rule-topology");
      const width = container.scrollWidth;
      const height = 500;

      const data = {
        nodes: [...fromList.value, ...rulesList.value, ...toList.value],
        edges: [...input2Rule.value, ...rule2output.value],
      };
      console.log(data);

      const graph = new G6.Graph({
        container: "rule-topology",
        width,
        height,
        linkCenter: true,
        layout: {
          type: "dagre",
          rankdir: "LR",
          align: "DL",
          nodesepFunc: () => 1,
          ranksepFunc: () => 1,
        },
        defaultNode: {
          size: [150, 50],
          type: "rect",
          style: {
            fill: "#FFFFFF",
            stroke: "#00b299",
          },
        },
        defaultEdge: {
          style: {
            stroke: "#b5b5b5",
            lineAppendWidth: 3,
          },
        },
      });

      graph.data(data);
      graph.render();
    };

    onMounted(async () => {
      await getRequiredList();
      initialG6();
    });

    return {
      fromList,
      toList,
      rulesList,
      input2Rule,
      rule2output,
    };
  },
});
</script>

<style></style>
