export default {
  API_BASE_URL: 'https://gitlab.com/api/v4',
  HEADER: {
    Authorization: `${process.env.VUE_APP_GITLAB_NAME} ${process.env.VUE_APP_GITLAB_TOKEN}`,
  },
  PROJECT_ID: 'pyShare%2FFrontend',
}
