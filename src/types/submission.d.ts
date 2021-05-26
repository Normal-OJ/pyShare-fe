declare namespace Submission {
  type ID = string

  enum State {
    Pending = 0,
    Accepted = 1,
    Denied = 2,
  }

  interface IInfo {
    code: string
    files: string[]
    judge_result: number | null
    state: Submission.State
    stderr: string
    stdout: string
    timestamp: Date
  }

  interface ITestBody {
    problem: Problem.ID
    code: string
  }
}
