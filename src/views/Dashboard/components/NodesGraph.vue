<template>
  <div class="graph-wrapper">
    <div class="graph-title">{{ $t("Dashboard.networkGraph") }}</div>
    <div class="graph-entity" ref="graph" v-loading.lock="infoLoading">
      <div id="graph-entity"></div>
      <div class="node-detail" v-if="!infoLoading">
        <div class="node-info" v-if="currentInfo">
          <div class="node-title">{{ currentInfo[0]["node"] }}</div>
          <div>
            <el-row>
              <el-col :span="10">{{ tl("uptime") }}:</el-col>
              <el-col :span="14">{{
                getDuration(currentInfo[0].uptime)
              }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">{{ tl("currentConnection") }}:</el-col>
              <el-col :span="14">{{
                currentInfo[1]["connections.count"]
              }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">{{ tl("topics") }}:</el-col>
              <el-col :span="14">{{ currentInfo[1]["topics.count"] }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">{{ tl("subscription") }}:</el-col>
              <el-col :span="14">{{
                currentInfo[1]["subscriptions.count"]
              }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">Max Fds:</el-col>
              <el-col :span="14">{{ currentInfo[0]["max_fds"] }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">CPU:</el-col>
              <el-col :span="14">{{
                currentInfo[0]["load1"] +
                "/" +
                currentInfo[0]["load5"] +
                "/" +
                currentInfo[0]["load15"]
              }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">{{ tl("memory") }}:</el-col>
              <el-col :span="14">
                <el-progress
                  :stroke-width="14"
                  :format="() => {}"
                  :percentage="calcMemoryPercentage"
                  :color="getProgressColor(calcPercentage)"
                ></el-progress
              ></el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  nextTick,
  computed,
  onUnmounted,
} from "vue";
import * as ddd from "d3";
import { loadNodes, loadStats } from "@/api/common";
import { getDuration, calcPercentage, getProgressColor } from "@/common/utils";
import nodeNormal from "@/assets/node-g-normal.svg";
import nodeOffline from "@/assets/node-g-offline.svg";
import nodeDynamic from "@/assets/node-g-dynamic.svg";

export default defineComponent({
  name: "NodesGraph",
  setup() {
    let nodes = ref([]);
    let stats = ref([]);
    let nodeStat = ref({});
    let graph = ref(undefined);
    let currentInfo = ref([{}, {}]);
    let infoLoading = ref(true);
    let svg = ref({});

    let getNodes = async () => {
      let res = await loadNodes().catch(() => {});
      if (res) {
        nodes.value = res;
      } else {
        return Promise.reject();
      }
    };
    let getStats = async () => {
      let res = await loadStats().catch(() => {});
      if (res) {
        stats.value = res;
        res.forEach((v) => {
          nodeStat.value[v.node] = v;
        });
      } else {
        return Promise.reject();
      }
    };
    let checkNode = (event, n) => {
      currentInfo.value = n;
    };

    const tl = function (key, collection = "Dashboard") {
      return this.$t(collection + "." + key);
    };

    let composeNodeInfo = (node) => {
      if (!node) {
        return;
      }
      let nodeStat = stats.value.find((v) => {
        return v.node == node.node;
      });
      infoLoading.value = false;
      return [node, nodeStat || {}];
    };
    let calcMemoryPercentage = computed(() => {
      return calcPercentage(
        currentInfo.value[0]["memory_used"],
        currentInfo.value[0]["memory_total"]
      );
    });
    let resizeFn = () => {
      let graphDom = graph?.value?.getBoundingClientRect() || {
        width: 200,
        height: 100,
      };
      let reCalcWidth = Math.min(graphDom.width / 2, graphDom.height);
      if ("attr" in svg.value)
        svg.value
          .attr("width", Math.floor(reCalcWidth))
          .attr("height", Math.floor(reCalcWidth));
    };

    onUnmounted(() => {
      window.removeEventListener("resize", resizeFn);
    });

    onMounted(async () => {
      await Promise.all([getNodes(), getStats()]).catch(() => {});
      nextTick((vue) => {
        // let graphDom = graph?.value?.getBoundingClientRect() || { width: 200, height: 100 }
        // let gMargin = 10

        svg.value = ddd
          .select("#graph-entity")
          .append("svg")
          .attr("viewBox", "-100 -100 200 200");
        // .attr('transform', `translate(${gMargin},${gMargin})`)
        resizeFn();
        window.addEventListener("resize", resizeFn);

        let lineGroup = svg.value.append("g");
        let arcGroup = svg.value.append("g");
        let pointGroup = svg.value.append("g");

        let nodeSVGsize = [22, 24];
        let nodeTotal = nodes.value.length > 10 ? 10 : nodes.value.length;

        let nodePoints = [];

        if (nodeTotal > 1) {
          let arcRamdon = Math.random() * Math.PI * 2;
          if (nodeTotal === 2) {
            arcRamdon = 0;
            nodeSVGsize = [33, 36];
          }
          for (let x = 0; x < nodeTotal; x++) {
            let arcConstant = (Math.PI * 2) / nodeTotal;
            let arc = ddd.arc();
            let param = {
              innerRadius: 100 - Math.max(...nodeSVGsize),
              outerRadius: 100 - Math.min(...nodeSVGsize),
              startAngle: arcConstant * x + arcRamdon,
              endAngle: arcConstant * (x + 1) + arcRamdon,
            };
            let path = arc(param);
            let centrePoint = arc.centroid(param);
            arcGroup.attr("fill", "none").append("path").attr("d", path);

            nodePoints.push(centrePoint);
            ddd.svg(nodeNormal).then((r) => {
              pointGroup
                .append("svg")
                .attr("x", centrePoint[0] - nodeSVGsize[0] / 2)
                .attr("y", centrePoint[1] - nodeSVGsize[1] / 2)
                .attr("width", nodeSVGsize[0])
                .attr("height", nodeSVGsize[1])
                .datum(composeNodeInfo(nodes.value[x]))
                .on("mouseover", checkNode)
                .node()
                .append(r.documentElement);
            });
          }

          for (let y = 0; y < nodePoints.length; y++) {
            let currentPoint = nodePoints[y];
            nodePoints.forEach((v, k) => {
              if (k <= y) return;
              let line = ddd.line();
              let path = line([currentPoint, v]);
              lineGroup
                .attr("fill", "none")
                .append("path")
                .attr("stroke", "grey")
                .attr("d", path);
            });
          }
          currentInfo.value = composeNodeInfo(nodes.value[0]);
        } else {
          ddd.svg(nodeDynamic).then((r) => {
            let composeData = composeNodeInfo(nodes.value[0]);
            currentInfo.value = composeData;

            pointGroup
              .append("svg")
              .attr("width", 150)
              .attr("height", 150)
              .attr("x", -75)
              .attr("y", -75)
              .datum(composeData)
              .on("mouseover", checkNode)
              .node()
              .append(r.documentElement);
          });
        }
      });
    });

    return {
      graph,
      currentInfo,
      tl,
      getDuration,
      calcPercentage,
      calcMemoryPercentage,
      getProgressColor,
      infoLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.graph-title {
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 700;
}
.graph-wrapper {
  display: flex;
  flex-direction: column;
}
.graph-entity {
  flex-grow: 1;
  display: flex;
  justify-content: space-evenly;
}

.node-detail {
  width: 50%;
  display: flex;
  flex-direction: column;
  color: #1d1d1d;

  .node-title {
    font-size: 14px;
    margin-bottom: 20px;
    font-weight: 700;
    margin-left: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .node-info {
    margin: 20px;
    flex-grow: 1;
    padding: 10px;
    background: linear-gradient(33deg, #f8fdfd 0%, #f8faff 46%, #fbfaff 100%);
    overflow: hidden;
  }
  .el-row {
    line-height: 1.8;
    :first-child {
      color: #8d96a2;
      word-break: break-all;
      padding-right: 5px;
    }
  }

  .el-progress {
    line-height: 1.8;
  }
}
</style>
