module.exports = {
  projects: [
    {
      displayName: 'default',
      testMatch: ['**/__tests__/**/*.[jt]s?(x)', '!**/schema/**'],
    },
    {
      displayName: 'schema',
      testMatch: ['**/__tests__/schema/**/*.[jt]s?(x)'],
    },
  ],
  testEnvironment: 'node',
}
