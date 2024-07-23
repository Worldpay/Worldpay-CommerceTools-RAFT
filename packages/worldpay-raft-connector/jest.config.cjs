module.exports = {
  displayName: 'Tests Typescript Application - Messages package',
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[tj]s?(x)'],
  testEnvironment: 'node',
  rootDir: 'src',
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: true,
            dynamicImport: true,
          },
        },
      },
    ],
  },
}
