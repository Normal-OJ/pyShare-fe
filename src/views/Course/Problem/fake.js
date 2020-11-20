export const comments = [
  {
    id: '3',
    title: '測試一下',
    floor: 3,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
    content: '<h5>真奇怪</h5>',
    submissions: [1, 2, 3],
    submission: {
      code: "print('hi')",
      result: {
        files: [],
        stdout: '',
        stderr: '',
      },
    },
    liked: [],
    created: 1605194262,
    updated: 1605078260,
    hasAccepted: true,
    replies: [],
  },
  {
    id: '2',
    title: '測試一下',
    floor: 2,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
    content: '<h5>真奇怪</h5>',
    submissions: [1, 2],
    submission: {
      code:
        "print('hi')\nprint('hi')\nprint('hi')\nprint('hi')\nprint('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')print('hi')",
      result: {
        files: [],
        stdout: '',
        stderr: '',
      },
    },
    liked: [1, 2, 3],
    created: 1605194489,
    updated: 1605194469,
    hasAccepted: false,
    replies: [1, 2, 3, 4, 5, 6],
  },
  {
    id: '1',
    title: '測試一下',
    floor: 1,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
    content: '<h5>真奇怪</h5>',
    submissions: [1],
    submission: {
      code: "print('hi')",
      result: {
        files: [],
        stdout: '',
        stderr: '',
      },
    },
    liked: [1],
    created: 1603404000,
    updated: 1605078360,
    hasAccepted: true,
    replies: [],
  },
]
