import { createServer, Response } from 'miragejs'

const mockDatasets = [
  {
    id: 1,
    filename: '新竹市立動物園110年度門票收入及入園人數統計表',
    description:
      '區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺',
    author: {
      username: 'test1',
      displayName: '張老師',
      id: 'a',
    },
    view: 10,
    download: 5,
  },
  {
    id: 2,
    filename: '新竹市立動物園110年度門票收入及入園人數統計表',
    description:
      '區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記、戶數、性別、人口數、遷入人數合計、遷入人數自國外、遷入人數自他省市新北市、遷入人數自他省市臺',
    author: {
      username: 'test2',
      displayName: '吳老師',
      id: 'b',
    },
    view: 102,
    download: 50,
  },
  {
    id: 3,
    filename: '新竹市立動物園110年度門票收入及入園人數統計表',
    description: '區域別、村里數現有門牌、村里數戶籍登記、鄰數現有門牌、鄰數戶籍登記',
    author: {
      username: 'test3',
      displayName: '吳老師',
      id: 'c',
    },
    view: 4,
    download: 2,
  },
]

export const makeServer = ({ environment }) =>
  createServer({
    environment,

    routes() {
      this.namespace = 'api'
      this.get('/dataset', () => new Response(200, {}, { data: mockDatasets }))
      this.passthrough()
    },
  })
