<template>
  <v-card-text class="pl-4 text--primary">
    <v-row justify="space-between">
      <v-col cols="4">
        <ol>
          <li
            v-for="req in task.requirements"
            :key="req._id || req"
          >
            <spinner v-if="typeof req === 'string'" />
            <span
              v-else
              class="text-body-1"
            >{{ req.description }}</span>
          </li>
        </ol>
      </v-col>
      <v-col
        v-if="chartOption"
        cols="8"
      >
        <echart
          :option="chartOption"
          style="width: 100%; min-height: 200px"
        />
      </v-col>
    </v-row>
    <div class="d-flex">
      <v-btn
        color="primary"
        class="ml-4"
        text
        @click="expand = !expand"
      >
        {{ expand ? '收合詳細' : '展開詳細' }}
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        @click="downloadStats"
      >
        <v-icon class="mr-1">
          mdi-download
        </v-icon>
        匯出統計資料
      </v-btn>
    </div>
    <v-data-table
      v-if="expand"
      :loading="isValidating"
      :headers="headers"
      :items="items"
      :items-per-page="Number(-1)"
      hide-default-footer
    >
      <template #[`item`]="{ item, headers: hdrs }">
        <tr>
          <td class="text-start">
            {{ item.userInfo.displayName }}
          </td>
          <td
            v-for="header in hdrs.slice(1, -1)"
            :key="header.value"
            class="text-start"
          >
            <v-icon v-if="item[header.value].progress[0] === item[header.value].progress[1]">
              mdi-check
            </v-icon>
            <span v-else>
              {{ `${item[header.value].progress[0]}/${item[header.value].progress[1]}` }}
            </span>
          </td>
          <td class="text-start">
            {{ item.sum }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card-text>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { ref, computed } from '@vue/composition-api'
import useSWRV from 'swrv'
import { fetcher } from '@/api/agent'
import { downloadFile } from '@/lib/utils'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
])

const yValue = (n) => new Array(n+1).fill(0)
const yAxis = (n) => new Array(n+1).fill(null).map((_, index) => index)

export default {
  components: { echart: VChart },

  props: {
    task: {
      type: Object,
      required: true,
    },
  },

  setup(props, context) {
    const { task } = props
    const expand = ref(false)
    const route = context.root.$route
    const store = context.root.$store
    const chartOption = ref(null)

    const numOfSubtask = task.completes.length > 0 ? task.completes[0].progress[1] : 0
    const completeNumCounter = task.completes.reduce(
      (counter, complete) => {
        counter[complete.progress[0]] += 1
        return counter
      },
      yValue(numOfSubtask),
    )
    chartOption.value = {
      xAxis: {
        name: '人數',
        type: 'value',
        minInterval: 1,
      },
      yAxis: {
        name: '完成數量',
        type: 'category',
        data: yAxis(numOfSubtask),
      },
      series: [
        {
          data: completeNumCounter,
          type: 'bar',
          showBackground: true,
        },
      ],
    }

    const url = `/course/${route.params.id}/task/${props.task.id}/record`
    const { data, error, isValidating } = useSWRV(url, fetcher)
    const taskDetailRecord = computed(() => data.value && data.value.data.data)
    const headers = computed(
      () => {
        if (!taskDetailRecord.value) return []
        const stuColumn = { text: '學生', value: 'userInfo' }
        const reqColumns = taskDetailRecord.value.requirements.map((r, index) => ({
          text: `${index+1}`, value: r.id, sortable: false,
        }))
        const sumColumn = { text: '完成數', value: 'sum' }
        return [stuColumn, ...reqColumns, sumColumn]
      },
    )
    const items = computed(
      () => {
        if (!taskDetailRecord.value || taskDetailRecord.value.requirements.length === 0) return []
        const arr = taskDetailRecord.value.requirements[0].completes.map((complete) => ({
          userInfo: complete.userInfo,
          [taskDetailRecord.value.requirements[0].id]: {
            progress: complete.progress,
            completes: complete.completes,
          },
        }))
        for (let i=1; i<taskDetailRecord.value.requirements.length; ++i) {
          taskDetailRecord.value.requirements[i].completes.forEach((complete) => {
            const index = arr.findIndex((e) => e.userInfo.id === complete.userInfo.id)
            arr[index][taskDetailRecord.value.requirements[i].id] = {
              progress: complete.progress,
              complete: complete.completes,
            }
          })
        }
        const arrWithSum = arr.map((row) => ({
          ...row,
          sum: Object.values(row)
            .filter((cell) => cell.progress && cell.progress[0] === cell.progress[1]).length,
        }))
        return arrWithSum
      },
    )
    function downloadData() {
      const csvHeader = headers.value.map((h) => h.text).join(',')
      const csvBody = items.value
        .map((item) => {
          const row = []
          headers.value.slice(1, -1).forEach(({ value }) => {
            const state = `${item[value].progress[0] === item[value].progress[1] ? '完成' : '未完成'}`
            const metric = `(${item[value].progress[0]}/${item[value].progress[1]})`
            row.push(`${state}${metric}`)
          })
          return [
            `${item.userInfo.displayName}(${item.userInfo.username})`,
            ...row,
            `${item.sum}`,
          ].join(',')
        })
        .join('\n')
      return `${csvHeader}\n${csvBody}`
    }
    function downloadStats() {
      const csvContent = 'data:text/csv;charset=utf-8,' + downloadData()
      downloadFile(`${store.state.course.courseInfo?.name || '課程'}_任務統計.csv`, csvContent)
    }
    return {
      chartOption,
      expand,
      data,
      error,
      isValidating,
      headers,
      items,
      downloadStats,
    }
  },
}
</script>
