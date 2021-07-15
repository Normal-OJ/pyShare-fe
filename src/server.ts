import { createServer, Response } from 'miragejs'

const mockDatasets = [
  {
    id: '1',
    title: '新竹市立動物園110年度門票收入及入園人數統計表',
    description: '新竹市立動物園110年度門票收入及入園人數',
    author: {
      username: 'test1',
      displayName: '張老師',
      id: 'a',
    },
    update: 1619368544,
    view: 10,
    download: 5,
  },
  {
    id: '2',
    title: '臺北市公園設施資料',
    description: '提供臺北市公園設施資料，包含兒童遊戲場及體健設施',
    author: {
      username: 'test2',
      displayName: '吳老師',
      id: 'b',
    },
    update: 1619668543,
    view: 102,
    download: 50,
  },
  {
    id: '3',
    title: '臺北市身心障礙街頭藝人聯絡方式及表演項目名單',
    description: '本市身障街頭藝人名單，包含其聯絡方式及其擅長的表演項目，如樂器演奏或唱歌',
    author: {
      username: 'test3',
      displayName: '吳老師',
      id: 'c',
    },
    update: 1619665544,
    view: 4,
    download: 2,
  },
  {
    id: '4',
    title: '各縣市國軍英雄館基本資料表',
    description: '提供民眾各縣市國軍英雄館地址、電話，以利民眾旅遊住宿使用。',
    author: {
      username: 'test3',
      displayName: '吳老師',
      id: 'c',
    },
    update: 1619665544,
    view: 4,
    download: 2,
  },
  {
    id: '5',
    title: '新北市禁止或限制水域遊憩活動區域',
    description: '新北市禁止或限制水域遊憩活動區域，包含資料座標、主管機關、法令依據與罰則',
    author: {
      username: 'test3',
      displayName: '吳老師',
      id: 'c',
    },
    update: 1619665544,
    view: 4,
    download: 2,
  },
]

// TODO: how to get the type of serverconfig in mirage?
export const makeServer = ({ environment }: { environment?: string }) =>
  createServer({
    environment,

    routes() {
      this.namespace = 'api'
      // this.get('/course/:id/statistic/oj-problem', () => {
      //   return new Response(
      //     200,
      //     {},
      //     {
      //       data: {
      //         overview: {
      //           '210': {
      //             acCount: 16,
      //             acUser: 0,
      //             tryCount: 1,
      //             tryUser: 1,
      //           },
      //           '212': {
      //             acCount: 1,
      //             acUser: 0,
      //             tryCount: 0,
      //             tryUser: 0,
      //           },
      //         },
      //         users: [
      //           {
      //             '210': {
      //               commentId: '60caecab01fd1c6e4c68bb50',
      //               result: 1,
      //               tryCount: 1,
      //             },
      //             '212': {
      //               commentId: null,
      //               result: 2,
      //               tryCount: 0,
      //             },
      //             info: {
      //               displayName: '測試帳號001',
      //               email: 'test001@test.com',
      //               id: '6048e99665d64e90c904e3b2',
      //               md5: 'ec8c7e61be690fa89efc380ea00be559',
      //               role: 2,
      //               school: '',
      //               username: 'test001',
      //             },
      //             overview: {
      //               acCount: 0,
      //               tryCount: 1,
      //             },
      //           },
      //           {
      //             '210': {
      //               commentId: null,
      //               result: 2,
      //               tryCount: 0,
      //             },
      //             '212': {
      //               commentId: null,
      //               result: 2,
      //               tryCount: 0,
      //             },
      //             info: {
      //               displayName: '測試帳號002',
      //               email: 'test002@test.com',
      //               id: '6048e99665d64e90c904e3b3',
      //               md5: 'bf6b54bbcd23c6fc428327962b4b3297',
      //               role: 2,
      //               school: '',
      //               username: 'test002',
      //             },
      //             overview: {
      //               acCount: 0,
      //               tryCount: 0,
      //             },
      //           },
      //           {
      //             '210': {
      //               commentId: null,
      //               result: 2,
      //               tryCount: 0,
      //             },
      //             '212': {
      //               commentId: null,
      //               result: 2,
      //               tryCount: 0,
      //             },
      //             info: {
      //               displayName: '測試帳號003',
      //               email: 'test003@test.com',
      //               id: '6048e99665d64e90c904e3b4',
      //               md5: 'b483edefc19a249040a63a5bf8bf6587',
      //               role: 2,
      //               school: '',
      //               username: 'test003',
      //             },
      //             overview: {
      //               acCount: 0,
      //               tryCount: 0,
      //             },
      //           },
      //           {
      //             '210': {
      //               commentId: null,
      //               result: 2,
      //               tryCount: 0,
      //             },
      //             '212': {
      //               commentId: null,
      //               result: 2,
      //               tryCount: 0,
      //             },
      //             info: {
      //               displayName: '測試帳號004',
      //               email: 'test004@test.com',
      //               id: '6048e99665d64e90c904e3b5',
      //               md5: 'e36005b7afa0885e67a7256965fe161d',
      //               role: 2,
      //               school: '',
      //               username: 'test004',
      //             },
      //             overview: {
      //               acCount: 0,
      //               tryCount: 0,
      //             },
      //           },
      //         ],
      //       },
      //     },
      //   )
      // })
      this.get('/dataset', () => new Response(200, {}, { data: mockDatasets }))
      this.get('/dataset/:id', (schema, request) => {
        const id = request.params.id
        try {
          const dataset = mockDatasets.find(d => d.id === id)
          return new Response(200, {}, { data: dataset })
        } catch {
          return new Response(404, {}, { message: 'dataset not found' })
        }
      })
      this.passthrough()
    },
  })
