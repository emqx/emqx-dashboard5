<template>
  <div class="app-wrapper">
    <div class="part-header">Overview</div>
    <div id="rule-topology"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, onUnmounted } from "vue";
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
    const RANDOM = Math.random().toString().substring(2, 8);
    let graphInstance = undefined;

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
              const fromNode = "__from__" + RANDOM + ":" + from;
              input2Rule.value.push({ source: fromNode, target: v.id });
              fromList.value.push({ id: fromNode, label: from });
            });
          } else {
            const fromNode = "__from__" + RANDOM + ":" + v.from;
            input2Rule.value.push({ source: fromNode, target: v.id });
            fromList.value.push({ id: fromNode, label: v.from });
          }
        });

        ruleList.value.forEach((v) => {
          if (v.outputs instanceof Array) {
            v.outputs.forEach((output) => {
              const toNode =
                "__to__" + RANDOM + ":" + output.function || output;
              rule2output.value.push({
                source: v.id,
                target: toNode,
              });
              toList.value.push({
                id: toNode,
                label: output.function || output,
              });
            });
          } else {
            const toNode =
              "__to__" + RANDOM + ":" + v.outputs.function ||
              v.outputs.toString();

            rule2output.value.push({
              source: v.id,
              target: toNode,
            });
            toList.value.push({
              id: toNode,
              label: v.outputs.function || v.outputs.toString(),
            });
          }
        });

        rulesList.value = ruleList.value.map((v) => {
          return { id: v.id, label: v.name };
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

      data.nodes = data.nodes.filter(
        (v, i, a) => a.findIndex((vi) => v.id === vi.id) === i
      );

      // console.log(data);

      graphInstance = new G6.Graph({
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
          size: [190, 50],
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

      graphInstance.data(data);
      graphInstance.render();
    };

    onMounted(async () => {
      await getRequiredList();
      initialG6();
    });

    onUnmounted(() => {
      graphInstance?.destroy && graphInstance.destroy();
    })

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

<style lang="scss" scoped>
.part-header {
  margin-bottom: 30px;
}
</style>
