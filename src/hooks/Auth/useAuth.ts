export default function useAuth(): {
  titleMap: {
    [key: string]: string
  }
} {
  const titleMap = {
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
    http: 'HTTP Server',
    built_in_database: 'Built-in Database',
    jwt: 'JWT',
    redis: 'Redis',
    mongodb: 'MongoDB',
    file: 'File',
  }
  return {
    titleMap,
  }
}
