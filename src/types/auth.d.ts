declare namespace Auth {
  interface ILoginBody {
    school?: string
    username?: string
    password: string
    email?: string
  }

  interface IBatchSignupBody {
    course: string
    csvString: string
  }

  interface IChangePasswordBody {
    oldPassword: string
    newPassword: string
  }

  interface IChangeEmailBody {
    password: string
    email: string
  }

  interface IValidateEmailBody {
    email: string
  }
}
